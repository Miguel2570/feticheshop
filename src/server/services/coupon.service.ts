import { Prisma } from "@prisma/client";

import { CouponRepository } from "@/server/repositories/coupon.repository";

export class CouponService {
  private repository =
    new CouponRepository();

  async getCoupons(options?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    code?: string;
  }) {
    return this.repository.findAll(options);
  }

  async getCouponById(id: string) {
    const coupon =
      await this.repository.findById(id);

    if (!coupon) {
      throw new Error("Coupon not found");
    }

    return coupon;
  }

  async getCouponByCode(code: string) {
    const coupon =
      await this.repository.findByCode(code);

    if (!coupon) {
      throw new Error("Coupon not found");
    }

    return coupon;
  }

  async createCoupon(
    data: Prisma.CouponCreateInput
  ) {
    const exists =
      await this.repository.findByCode(
        data.code
      );

    if (exists) {
      throw new Error(
        "Coupon code already exists"
      );
    }

    return this.repository.create(data);
  }

  async updateCoupon(
    id: string,
    data: Prisma.CouponUpdateInput
  ) {
    await this.getCouponById(id);

    if (
      data.code &&
      typeof data.code === "string"
    ) {
      const exists =
        await this.repository.findByCode(
          data.code
        );

      if (exists && exists.id !== id) {
        throw new Error(
          "Coupon code already exists"
        );
      }
    }

    return this.repository.update(id, data);
  }

  async updateStatus(
    id: string,
    isActive: boolean
  ) {
    await this.getCouponById(id);

    return this.repository.update(id, {
      isActive,
    });
  }

  async deleteCoupon(id: string) {
    await this.getCouponById(id);

    return this.repository.delete(id);
  }

  async validateCoupon(
    code: string
  ) {
    const coupon =
      await this.repository.findByCode(
        code
      );

    if (!coupon) {
      throw new Error("Coupon not found");
    }

    if (!coupon.isActive) {
      throw new Error(
        "Coupon is not active"
      );
    }

    if (
      coupon.startsAt &&
      coupon.startsAt > new Date()
    ) {
      throw new Error(
        "Coupon is not active yet"
      );
    }

    if (
      coupon.endsAt &&
      coupon.endsAt < new Date()
    ) {
      throw new Error(
        "Coupon has expired"
      );
    }

    if (
      coupon.usageLimit &&
      coupon.usedCount >=
        coupon.usageLimit
    ) {
      throw new Error(
        "Coupon usage limit reached"
      );
    }

    return coupon;
  }

  async incrementUsage(id: string) {
    return this.repository.update(id, {
      usedCount: {
        increment: 1,
      },
    });
  }
}

export const couponService =
  new CouponService();