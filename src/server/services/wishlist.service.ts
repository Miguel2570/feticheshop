import { prisma } from "@/lib/prisma";

import { WishlistRepository } from "@/server/repositories/wishlist.repository";

export class WishlistService {
  private repository = new WishlistRepository();

  async getWishlist(userId: string) {
    let wishlist =
      await this.repository.findByUserId(userId);

    if (!wishlist) {
      wishlist =
        await this.repository.create(userId);
    }

    if (!wishlist) {
      throw new Error("Failed to create wishlist");
    }

    return wishlist;
  }

  async addItem(
    userId: string,
    productId: string
  ) {
    let wishlist =
      await this.repository.findByUserId(userId);

    if (!wishlist) {
      wishlist =
        await this.repository.create(userId);
    }

    if (!wishlist) {
      throw new Error("Failed to create wishlist");
    }

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!product) {
      throw new Error("Product not found");
    }

    const exists =
      await this.repository.findItem(
        wishlist.id,
        productId
      );

    if (exists) {
      return wishlist;
    }

    await this.repository.addItem({
      wishlist: {
        connect: {
          id: wishlist.id,
        },
      },

      product: {
        connect: {
          id: productId,
        },
      },
    });

    return this.getWishlist(userId);
  }

  async removeItem(
    userId: string,
    productId: string
  ) {
    const wishlist =
      await this.repository.findByUserId(userId);

    if (!wishlist) {
      throw new Error("Wishlist not found");
    }

    const item =
      await this.repository.findItem(
        wishlist.id,
        productId
      );

    if (!item) {
      throw new Error("Item not found");
    }

    await this.repository.removeItem(item.id);

    return this.getWishlist(userId);
  }

  async clear(userId: string) {
    const wishlist =
      await this.repository.findByUserId(userId);

    if (!wishlist) {
      return true;
    }

    await this.repository.clear(wishlist.id);

    return true;
  }
}

export const wishlistService =
  new WishlistService();