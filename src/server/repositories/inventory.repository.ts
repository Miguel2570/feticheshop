import {
  InventoryMovementType,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface FindAllOptions {
  page?: number;
  limit?: number;
  variantId?: string;
  type?: InventoryMovementType;
}

export class InventoryRepository {
  async findAll(options?: FindAllOptions) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;

    const skip = (page - 1) * limit;

    const where: Prisma.InventoryMovementWhereInput = {};

    if (options?.variantId) {
      where.variantId = options.variantId;
    }

    if (options?.type) {
      where.type = options.type;
    }

    const [data, total] = await Promise.all([
      prisma.inventoryMovement.findMany({
        where,
        skip,
        take: limit,
        include: {
          variant: {
            include: {
              product: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.inventoryMovement.count({
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
    return prisma.inventoryMovement.findUnique({
      where: {
        id,
      },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
        createdBy: true,
      },
    });
  }

  async create(
    data: Prisma.InventoryMovementCreateInput
  ) {
    return prisma.inventoryMovement.create({
      data,
      include: {
        variant: true,
        createdBy: true,
      },
    });
  }
}

export const inventoryRepository =
  new InventoryRepository();