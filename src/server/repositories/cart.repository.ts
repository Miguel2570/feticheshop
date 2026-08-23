import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

/* =========================================================
   INCLUDE DO CARRINHO
========================================================= */

const cartInclude = {
  items: {
    orderBy: {
      createdAt: "asc" as const,
    },

    include: {
      product: {
        include: {
          images: {
            orderBy: {
              position: "asc" as const,
            },
          },

          brand: true,
        },
      },

      variant: true,
    },
  },
};

/* =========================================================
   REPOSITORY
========================================================= */

export class CartRepository {
  /* =======================================================
     FIND CART BY USER
  ======================================================= */

  async findByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: {
        userId,
      },

      include: cartInclude,
    });
  }

  /* =======================================================
     CREATE CART
  ======================================================= */

  async create(userId: string) {
    return prisma.cart.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
      },

      include: cartInclude,
    });
  }

  /* =======================================================
     ADD ITEM
  ======================================================= */

  async addItem(
    data: Prisma.CartItemCreateInput
  ) {
    return prisma.cartItem.create({
      data,

      include: {
        product: {
          include: {
            images: {
              orderBy: {
                position: "asc",
              },
            },

            brand: true,
          },
        },

        variant: true,
      },
    });
  }

  /* =======================================================
     FIND ITEM
  ======================================================= */

  async findItem(id: string) {
    return prisma.cartItem.findUnique({
      where: {
        id,
      },

      include: {
        cart: true,

        product: {
          include: {
            images: {
              orderBy: {
                position: "asc",
              },
            },

            brand: true,
          },
        },

        variant: true,
      },
    });
  }

  /* =======================================================
     FIND ITEM BY CART + PRODUCT + VARIANT
  ======================================================= */

  async findItemByCart(
    cartId: string,
    productId: string,
    variantId?: string
  ) {
    return prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,

        variantId:
          variantId ?? null,
      },
    });
  }

  /* =======================================================
     UPDATE ITEM
  ======================================================= */

  async updateItem(
    id: string,
    data: Prisma.CartItemUpdateInput
  ) {
    return prisma.cartItem.update({
      where: {
        id,
      },

      data,

      include: {
        product: {
          include: {
            images: {
              orderBy: {
                position: "asc",
              },
            },

            brand: true,
          },
        },

        variant: true,
      },
    });
  }

  /* =======================================================
     REMOVE ITEM
  ======================================================= */

  async removeItem(id: string) {
    return prisma.cartItem.delete({
      where: {
        id,
      },
    });
  }

  /* =======================================================
     CLEAR CART
  ======================================================= */

  async clear(cartId: string) {
    return prisma.cartItem.deleteMany({
      where: {
        cartId,
      },
    });
  }
}

/* =========================================================
   SINGLETON
========================================================= */

export const cartRepository =
  new CartRepository();