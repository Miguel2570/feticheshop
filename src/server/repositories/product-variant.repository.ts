import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface FindAllOptions {
  page?: number;
  limit?: number;
  search?: string;
  productId?: string;
  isActive?: boolean;
}

export class ProductVariantRepository {
  async findAll(options?: FindAllOptions) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductVariantWhereInput =
      {};

    if (options?.productId) {
      where.productId = options.productId;
    }

    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    if (options?.search) {
      where.OR = [
        {
          name: {
            contains: options.search,
            mode: "insensitive",
          },
        },
        {
          sku: {
            contains: options.search,
            mode: "insensitive",
          },
        },
        {
          ean: {
            contains: options.search,
            mode: "insensitive",
          },
        },
      ];
    }

    const [variants, total] = await Promise.all([
      prisma.productVariant.findMany({
        where,
        skip,
        take: limit,

        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.productVariant.count({
        where,
      }),
    ]);

    return {
      data: variants,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return prisma.productVariant.findUnique({
      where: {
        id,
      },

      include: {
        product: true,
      },
    });
  }

  async findBySku(sku: string) {
    return prisma.productVariant.findUnique({
      where: {
        sku,
      },
    });
  }

  async create(
    data: Prisma.ProductVariantCreateInput
  ) {
    return prisma.productVariant.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.ProductVariantUpdateInput
  ) {
    return prisma.productVariant.update({
      where: {
        id,
      },

      data,
    });
  }

  async delete(id: string) {
    return prisma.productVariant.delete({
      where: {
        id,
      },
    });
  }
}