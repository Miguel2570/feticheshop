import { Prisma, ProductStatus, } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface FindAllOptions {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  status?: ProductStatus;
}

export class ProductRepository {
  async findAll(options?: FindAllOptions) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
    };

    if (options?.status) {
      where.status = options.status;
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
      ];
    }

    if (options?.brandId) {
      where.brandId = options.brandId;
    }

    if (options?.categoryId) {
      where.categories = {
        some: {
          categoryId: options.categoryId,
        },
      };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          brand: true,
          images: true,
          variants: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.product.count({
        where,
      }),
    ]);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        brand: true,
        images: true,
        variants: true,
        attributes: {
          include: {
            attributeValue: {
              include: {
                attribute: true,
              },
            },
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        brand: true,
        images: true,
        variants: true,
      },
    });
  }

  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.ProductUpdateInput
  ) {
    return prisma.product.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.product.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}