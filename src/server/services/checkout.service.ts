import { randomUUID } from "crypto";
import {
  InventoryMovementType,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

// ✅ NOVO: Tipo para a query raw do cupão
type CouponQueryResult = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discountValue: Prisma.Decimal;
  isPercentage: boolean;
  maximumDiscount: Prisma.Decimal | null;
  minimumAmount: Prisma.Decimal | null;
  usageLimit: number | null;
  usedCount: number;
  usagePerUser: number | null;
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
};

export class CheckoutService {
  async checkout(
    userId: string,
    input: {
      addressId: string;
      notes?: string;
      couponCode?: string;
      paymentMethod: PaymentMethod;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true, variant: true } } },
      });

      if (!cart) throw new Error("Carrinho não encontrado.");
      if (cart.items.length === 0) throw new Error("O carrinho está vazio.");

      const address = await tx.userAddress.findUnique({ where: { id: input.addressId } });
      if (!address || address.userId !== userId) throw new Error("Morada inválida.");

      const orderAddress = await tx.orderAddress.create({
        data: {
          firstName: address.firstName,
          lastName: address.lastName,
          company: address.company,
          vatNumber: address.vatNumber,
          email: address.email,
          phone: address.phone,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          postalCode: address.postalCode,
          city: address.city,
          district: address.district,
          country: address.country,
        },
      });

      let subtotal = new Prisma.Decimal(0);
      for (const item of cart.items) {
        const price = item.unitPrice ?? item.product.price;
        if (price === null || price === undefined) throw new Error(`Preço inválido para ${item.product.name}.`);
        if (item.quantity <= 0) throw new Error(`Quantidade inválida para ${item.product.name}.`);
        subtotal = subtotal.plus(price.mul(item.quantity));
      }

      let couponId: string | null = null;
      let discount = new Prisma.Decimal(0);

      if (input.couponCode?.trim()) {
        const code = input.couponCode.trim().toUpperCase();
        
        // ✅ CORRIGIDO: Usa o tipo CouponQueryResult em vez de any
        const coupons = await tx.$queryRaw<CouponQueryResult[]>`
          SELECT 
            id, code, name, description, 
            "discountValue", "isPercentage", "maximumDiscount", 
            "minimumAmount", "usageLimit", "usedCount", 
            "usagePerUser", "isActive", "startsAt", "endsAt"
          FROM "Coupon" 
          WHERE "code" = ${code} 
          FOR UPDATE
        `;

        const coupon = coupons[0];
        if (!coupon) throw new Error("Cupão inválido.");
        if (!coupon.isActive) throw new Error("Este cupão está desativado.");
        
        const now = new Date();
        if (coupon.startsAt && coupon.startsAt > now) throw new Error("Cupão ainda não disponível.");
        if (coupon.endsAt && coupon.endsAt < now) throw new Error("Cupão expirou.");
        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) throw new Error("Limite atingido.");
        
        if (coupon.usagePerUser !== null) {
          const userUsage = await tx.order.count({ where: { userId, couponId: coupon.id } });
          if (userUsage >= coupon.usagePerUser) throw new Error("Já atingiu o limite deste cupão.");
        }
        
        if (coupon.minimumAmount !== null && subtotal.lessThan(coupon.minimumAmount)) {
          throw new Error(`Compra mínima de ${Number(coupon.minimumAmount).toFixed(2)} €`);
        }

        if (coupon.isPercentage) {
          discount = subtotal.mul(coupon.discountValue).div(100);
          if (coupon.maximumDiscount !== null && discount.greaterThan(coupon.maximumDiscount)) {
            discount = coupon.maximumDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }
        if (discount.greaterThan(subtotal)) discount = subtotal;
        if (discount.lessThan(0)) discount = new Prisma.Decimal(0);
        
        couponId = coupon.id;
      }

      const shipping = new Prisma.Decimal(0);
      const total = subtotal.plus(shipping).minus(discount);

      const order = await tx.order.create({
        data: {
          orderNumber: randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase(),
          user: { connect: { id: userId } },
          orderAddress: { connect: { id: orderAddress.id } },
          subtotal,
          shipping,
          discount,
          total,
          notes: input.notes,
          ...(couponId && { coupon: { connect: { id: couponId } } }),
        },
      });

      if (couponId) {
        await tx.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });
      }

      for (const item of cart.items) {
        const price = item.unitPrice ?? item.product.price;

        await tx.orderItem.create({
          data: {
            order: { connect: { id: order.id } },
            product: { connect: { id: item.productId } },
            ...(item.variantId && { variant: { connect: { id: item.variantId } } }),
            name: item.product.name,
            sku: item.product.sku,
            ean: item.product.ean,
            quantity: item.quantity,
            unitPrice: price,
            totalPrice: price.mul(item.quantity),
          },
        });

        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { id: true, stock: true, allowBackorder: true, manageStock: true },
        });

        if (!product) throw new Error("Produto não encontrado.");

        if (product.manageStock) {
          const stockBefore = product.stock;
          const stockAfter = stockBefore - item.quantity;

          if (stockAfter < 0 && !product.allowBackorder) {
            throw new Error(`Stock insuficiente para o produto ${product.id}.`);
          }

          await tx.product.update({
            where: { id: product.id },
            data: { stock: stockAfter },
          });

          if (item.variantId) {
            await tx.inventoryMovement.create({
              data: {
                variant: { connect: { id: item.variantId } },
                type: InventoryMovementType.SALE,
                quantity: item.quantity,
                stockBefore,
                stockAfter,
                referenceType: "ORDER",
                referenceId: order.id,
                createdBy: { connect: { id: userId } },
              },
            });
          }
        }
      }

      await tx.payment.create({
        data: {
          order: { connect: { id: order.id } },
          method: input.paymentMethod,
          amount: total,
          status: PaymentStatus.PENDING,
        },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          orderAddress: true,
          payment: true,
          coupon: true,
          items: { include: { product: true, variant: true } },
        },
      });
    });
  }
}

export const checkoutService = new CheckoutService();