import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface FindAllOptions {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string;
  isActive?: boolean;
}

export class CategoryRepository {
  async findAll(options?: FindAllOptions) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.CategoryWhereInput = {
      deletedAt: null,
    };

    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    if (options?.parentId) {
      where.parentId = options.parentId;
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

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        include: {
          parent: true,
          children: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            name: "asc",
          },
        ],
      }),

      prisma.category.count({
        where,
      }),
    ]);

    return {
      data: categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findTree() {
    return prisma.category.findMany({
      where: {
        parentId: null,
        deletedAt: null,
      },
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
    });
  }

  async findById(id: string) {
    return prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        parent: true,
        children: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: {
        slug,
      },
    });
  }

  async create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.CategoryUpdateInput
  ) {
    return prisma.category.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.category.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}