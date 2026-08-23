import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface FindAllOptions {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export class BrandRepository {
  async findAll(options?: FindAllOptions) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.BrandWhereInput = {
      deletedAt: null,
    };

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
          slug: {
            contains: options.search,
            mode: "insensitive",
          },
        },
      ];
    }

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),

      prisma.brand.count({
        where,
      }),
    ]);

    return {
      data: brands,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return prisma.brand.findUnique({
      where: {
        id,
      },
      include: {
        products: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.brand.findUnique({
      where: {
        slug,
      },
    });
  }

  async create(data: Prisma.BrandCreateInput) {
    return prisma.brand.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.BrandUpdateInput
  ) {
    return prisma.brand.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.brand.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}