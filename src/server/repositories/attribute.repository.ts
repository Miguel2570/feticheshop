import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface FindAllOptions {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export class AttributeRepository {
  async findAll(options?: FindAllOptions) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.AttributeWhereInput = {
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

    const [attributes, total] = await Promise.all([
      prisma.attribute.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              values: true,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      }),

      prisma.attribute.count({
        where,
      }),
    ]);

    return {
      data: attributes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return prisma.attribute.findUnique({
      where: {
        id,
      },
      include: {
        values: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.attribute.findUnique({
      where: {
        slug,
      },
    });
  }

  async create(data: Prisma.AttributeCreateInput) {
    return prisma.attribute.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.AttributeUpdateInput
  ) {
    return prisma.attribute.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.attribute.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}