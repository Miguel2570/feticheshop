import { prisma } from "@/lib/prisma";

import { CartRepository } from "@/server/repositories/cart.repository";

type CartWithItems = NonNullable<
  Awaited<
    ReturnType<
      CartRepository["findByUserId"]
    >
  >
>;

export class CartService {
  private repository =
    new CartRepository();

  async getCart(userId: string) {
    let cart =
      await this.repository.findByUserId(
        userId
      );

    if (!cart) {
      cart =
        await this.repository.create(
          userId
        );
    }

    return this.calculateTotals(cart);
  }

  async addItem(
    userId: string,
    productId: string,
    quantity: number,
    variantId?: string
  ) {
    if (quantity <= 0) {
      throw new Error(
        "Quantity must be greater than zero"
      );
    }

    let cart =
      await this.repository.findByUserId(
        userId
      );

    if (!cart) {
      cart =
        await this.repository.create(
          userId
        );
    }

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!product) {
      throw new Error(
        "Product not found"
      );
    }

    if (
      product.status !== "ACTIVE"
    ) {
      throw new Error(
        "Product unavailable"
      );
    }

    let availableStock =
      product.stock;

    if (variantId) {
      const variant =
        await prisma.productVariant.findUnique(
          {
            where: {
              id: variantId,
            },
          }
        );

      if (!variant) {
        throw new Error(
          "Variant not found"
        );
      }

      if (!variant.isActive) {
        throw new Error(
          "Variant unavailable"
        );
      }

      availableStock =
        variant.stock;
    }

    const existing =
      await this.repository.findItemByCart(
        cart.id,
        productId,
        variantId
      );

    const newQuantity =
      (existing?.quantity ?? 0) +
      quantity;

    if (
      product.manageStock &&
      !product.allowBackorder &&
      newQuantity > availableStock
    ) {
      throw new Error(
        "Insufficient stock"
      );
    }

    if (existing) {
      await this.repository.updateItem(
        existing.id,
        {
          quantity: newQuantity,
        }
      );
    } else {
      const price =
        variantId
          ? (
              await prisma.productVariant.findUnique(
                {
                  where: {
                    id: variantId,
                  },
                  select: {
                    price: true,
                  },
                }
              )
            )?.price ??
            product.price
          : product.price;

      await this.repository.addItem({
        quantity,

        unitPrice: price,

        cart: {
          connect: {
            id: cart.id,
          },
        },

        product: {
          connect: {
            id: productId,
          },
        },

        ...(variantId && {
          variant: {
            connect: {
              id: variantId,
            },
          },
        }),
      });
    }

    return this.getCart(userId);
  }

  async updateItem(
    userId: string,
    itemId: string,
    quantity: number
  ) {
    const item =
      await this.repository.findItem(
        itemId
      );

    if (!item) {
      throw new Error(
        "Item not found"
      );
    }

    if (
      item.cart.userId !== userId
    ) {
      throw new Error(
        "Item not found"
      );
    }

    if (quantity <= 0) {
      await this.repository.removeItem(
        item.id
      );

      return this.getCart(userId);
    }

    let stock =
      item.product.stock;

    if (item.variant) {
      stock = item.variant.stock;
    }

    if (
      item.product.manageStock &&
      !item.product.allowBackorder &&
      quantity > stock
    ) {
      throw new Error(
        "Insufficient stock"
      );
    }

    await this.repository.updateItem(
      item.id,
      {
        quantity,
      }
    );

    return this.getCart(userId);
  }

  async removeItem(
    userId: string,
    itemId: string
  ) {
    const item =
      await this.repository.findItem(
        itemId
      );

    if (!item) {
      throw new Error(
        "Item not found"
      );
    }

    if (
      item.cart.userId !== userId
    ) {
      throw new Error(
        "Item not found"
      );
    }

    await this.repository.removeItem(
      item.id
    );

    return true;
  }

  async clearCart(userId: string) {
    const cart =
      await this.repository.findByUserId(
        userId
      );

    if (!cart) {
      return true;
    }

    await this.repository.clear(
      cart.id
    );

    return true;
  }

  private calculateTotals(
    cart: CartWithItems
  ) {
    const items = cart.items.map(
      (item) => {
        const price = Number(
          item.variant?.price ??
            item.unitPrice ??
            item.product.price
        );

        return {
          id: item.id,

          productId:
            item.productId,

          variantId:
            item.variantId,

          quantity:
            item.quantity,

          price,

          subtotal:
            price * item.quantity,

          product: {
            id: item.product.id,

            name:
              item.product.name,

            slug:
              item.product.slug,

            price,

            image:
              item.product.images[0]?.url ??
              "/images/product-placeholder.png",

            brand:
              item.product.brand?.name ??
              "",
          },
        };
      }
    );

    const subtotal =
      items.reduce(
        (total, item) =>
          total + item.subtotal,
        0
      );

    const shipping = 0;
    const discount = 0;

    const total =
      subtotal +
      shipping -
      discount;

    return {
      id: cart.id,

      items,

      summary: {
        subtotal,
        shipping,
        discount,
        total,

        items:
          items.reduce(
            (total, item) =>
              total +
              item.quantity,
            0
          ),
      },
    };
  }
}

export const cartService =
  new CartService();