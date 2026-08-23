import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface FindAllOptions {
  page?: number;
  limit?: number;
  isActive?: boolean;
  code?: string;
}

export class CouponRepository {
  async findAll(options?: FindAllOptions) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;

    const where: Prisma.CouponWhereInput = {};

    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    if (options?.code) {
      where.code = {
        contains: options.code,
        mode: "insensitive",
      };
    }

    const [data, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,

        include: {
          orders: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.coupon.count({
        where,
      }),
    ]);

    return {
      data,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return prisma.coupon.findUnique({
      where: {
        id,
      },

      include: {
        orders: true,
      },
    });
  }

  async findByCode(code: string) {
    return prisma.coupon.findUnique({
      where: {
        code,
      },

      include: {
        orders: true,
      },
    });
  }

  async create(data: Prisma.CouponCreateInput) {
    return prisma.coupon.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.CouponUpdateInput
  ) {
    return prisma.coupon.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.coupon.delete({
      where: {
        id,
      },
    });
  }
}

export const couponRepository =
  new CouponRepository();