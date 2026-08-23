import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class WishlistRepository {
  async findByUserId(userId: string) {
    return prisma.wishlist.findUnique({
      where: {
        userId,
      },

      include: {
        items: {
          include: {
            product: {
              include: {
                brand: true,
                images: true,
              },
            },
          },
        },
      },
    });
  }

  async create(userId: string) {
    return prisma.wishlist.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
      },

      include: {
        items: {
          include: {
            product: {
              include: {
                brand: true,
                images: true,
              },
            },
          },
        },
      },
    });
  }

  async findItem(
    wishlistId: string,
    productId: string
  ) {
    return prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId,
          productId,
        },
      },
    });
  }

  async addItem(
    data: Prisma.WishlistItemCreateInput
  ) {
    return prisma.wishlistItem.create({
      data,

      include: {
        product: {
          include: {
            brand: true,
            images: true,
          },
        },
      },
    });
  }

  async removeItem(id: string) {
    return prisma.wishlistItem.delete({
      where: {
        id,
      },
    });
  }

  async clear(wishlistId: string) {
    return prisma.wishlistItem.deleteMany({
      where: {
        wishlistId,
      },
    });
  }
}

export const wishlistRepository =
  new WishlistRepository();