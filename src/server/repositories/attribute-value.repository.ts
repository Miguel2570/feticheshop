import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface FindAllOptions {
  page?: number;
  limit?: number;
  search?: string;
  attributeId?: string;
  isActive?: boolean;
}

export class AttributeValueRepository {
  async findAll(options?: FindAllOptions) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.AttributeValueWhereInput = {
      deletedAt: null,
    };

    if (options?.attributeId) {
      where.attributeId = options.attributeId;
    }

    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    if (options?.search) {
      where.OR = [
        {
          value: {
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

    const [values, total] = await Promise.all([
      prisma.attributeValue.findMany({
        where,
        skip,
        take: limit,
        include: {
          attribute: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: [
          {
            attribute: {
              position: "asc",
            },
          },
          {
            position: "asc",
          },
        ],
      }),

      prisma.attributeValue.count({
        where,
      }),
    ]);

    return {
      data: values,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return prisma.attributeValue.findUnique({
      where: {
        id,
      },
      include: {
        attribute: true,
        products: true,
      },
    });
  }

  async findBySlug(
    attributeId: string,
    slug: string
  ) {
    return prisma.attributeValue.findFirst({
      where: {
        attributeId,
        slug,
      },
    });
  }

  async create(
    data: Prisma.AttributeValueCreateInput
  ) {
    return prisma.attributeValue.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.AttributeValueUpdateInput
  ) {
    return prisma.attributeValue.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.attributeValue.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}