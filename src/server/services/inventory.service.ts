import {
  InventoryMovementType,
  InventoryReferenceType,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { InventoryRepository } from "@/server/repositories/inventory.repository";

export interface CreateInventoryMovementInput {
  variantId: string;

  quantity: number;

  type: InventoryMovementType;

  referenceType?: InventoryReferenceType;

  referenceId?: string;

  reason?: string;

  createdById?: string;
}

export class InventoryService {
  private repository =
    new InventoryRepository();

  async getMovements(options?: {
    page?: number;
    limit?: number;
    variantId?: string;
    type?: InventoryMovementType;
  }) {
    return this.repository.findAll(options);
  }

  async getMovement(id: string) {
    const movement =
      await this.repository.findById(id);

    if (!movement) {
      throw new Error(
        "Inventory movement not found"
      );
    }

    return movement;
  }

  async createMovement(
    input: CreateInventoryMovementInput
  ) {
    return prisma.$transaction(async (tx) => {
      const variant =
        await tx.productVariant.findUnique({
          where: {
            id: input.variantId,
          },
        });

      if (!variant) {
        throw new Error(
          "Variant not found"
        );
      }

      const stockBefore =
        variant.stock;

      const stockAfter =
        stockBefore + input.quantity;

      if (stockAfter < 0) {
        throw new Error(
          "Insufficient stock"
        );
      }

      await tx.productVariant.update({
        where: {
          id: variant.id,
        },

        data: {
          stock: stockAfter,
        },
      });

      return tx.inventoryMovement.create({
        data: {
          variant: {
            connect: {
              id: variant.id,
            },
          },

          quantity: input.quantity,

          type: input.type,

          stockBefore,

          stockAfter,

          referenceId:
            input.referenceId,

          referenceType:
            input.referenceType,

          reason: input.reason,

          ...(input.createdById && {
            createdBy: {
              connect: {
                id: input.createdById,
              },
            },
          }),
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
    });
  }
}

export const inventoryService =
  new InventoryService();