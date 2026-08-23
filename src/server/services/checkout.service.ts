import { randomUUID } from "crypto";

import {
  InventoryMovementType,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class CheckoutService {
  async checkout(
    userId: string,
    input: {
      addressId: string;
      notes?: string;
      couponCode?: string;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      // =====================================================
      // Carrinho
      // =====================================================

      const cart = await tx.cart.findUnique({
        where: {
          userId,
        },

        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });

      if (!cart) {
        throw new Error("Cart not found");
      }

      if (cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      // =====================================================
      // Morada
      // =====================================================

      const address =
        await tx.userAddress.findUnique({
          where: {
            id: input.addressId,
          },
        });

      if (!address) {
        throw new Error("Address not found");
      }

      // =====================================================
      // Snapshot da morada
      // =====================================================

      const orderAddress =
        await tx.orderAddress.create({
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

      // =====================================================
      // Totais
      // =====================================================

      let subtotal = new Prisma.Decimal(0);

      for (const item of cart.items) {
        const price =
          item.variant?.price ??
          item.product.price;

        subtotal = subtotal.plus(
          price.mul(item.quantity)
        );
      }

      const shipping =
        new Prisma.Decimal(0);

      const discount =
        new Prisma.Decimal(0);

      const total = subtotal
        .plus(shipping)
        .minus(discount);

      // =====================================================
      // Encomenda
      // =====================================================

      const order =
        await tx.order.create({
          data: {
            orderNumber:
              randomUUID()
                .replaceAll("-", "")
                .slice(0, 10)
                .toUpperCase(),

            user: {
              connect: {
                id: userId,
              },
            },

            orderAddress: {
              connect: {
                id: orderAddress.id,
              },
            },

            subtotal,
            shipping,
            discount,
            total,

            notes: input.notes,
          },
        });

      // =====================================================
      // Itens + Stock
      // =====================================================

      for (const item of cart.items) {
        const price =
          item.variant?.price ??
          item.product.price;

        await tx.orderItem.create({
          data: {
            order: {
              connect: {
                id: order.id,
              },
            },

            product: {
              connect: {
                id: item.productId,
              },
            },

            ...(item.variantId && {
              variant: {
                connect: {
                  id: item.variantId,
                },
              },
            }),

            name: item.product.name,

            sku:
              item.variant?.sku ??
              item.product.sku,

            ean:
              item.variant?.ean ??
              item.product.ean,

            quantity: item.quantity,

            unitPrice: price,

            totalPrice: price.mul(
              item.quantity
            ),
          },
        });

        // ==========================================
        // Atualizar stock
        // ==========================================

        if (item.variantId) {
          const variant =
            await tx.productVariant.findUnique({
              where: {
                id: item.variantId,
              },

              select: {
                id: true,
                stock: true,
              },
            });

          if (!variant) {
            throw new Error("Variant not found");
          }

          const stockBefore = variant.stock;

          const stockAfter =
            stockBefore - item.quantity;

          await tx.productVariant.update({
            where: {
              id: variant.id,
            },

            data: {
              stock: stockAfter,
            },
          });

          await tx.inventoryMovement.create({
            data: {
              variant: {
                connect: {
                  id: variant.id,
                },
              },

              type: InventoryMovementType.SALE,

              quantity: item.quantity,

              stockBefore,

              stockAfter,

              referenceType: "ORDER",

              referenceId: order.id,

              createdBy: {
                connect: {
                  id: userId,
                },
              },
            },
          });
        }
      }

      // =====================================================
      // Pagamento
      // =====================================================

      await tx.payment.create({
        data: {
          order: {
            connect: {
              id: order.id,
            },
          },

          method: PaymentMethod.CARD,

          amount: total,

          status: PaymentStatus.PENDING,
        },
      });

      // =====================================================
      // Limpar carrinho
      // =====================================================

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      // =====================================================
      // Resultado
      // =====================================================

      return tx.order.findUnique({
        where: {
          id: order.id,
        },

        include: {
          orderAddress: true,
          payment: true,

          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });
    });
  }
}

export const checkoutService =
  new CheckoutService();