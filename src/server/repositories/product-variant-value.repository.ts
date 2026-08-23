import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface FindAllOptions {
  variantId?: string;
}

export class ProductVariantValueRepository {
  async findAll(options?: FindAllOptions) {
    return prisma.productVariantValue.findMany({
      where: {
        ...(options?.variantId && {
          variantId: options.variantId,
        }),
      },

      include: {
        variant: {
          include: {
            product: true,
          },
        },

        attributeValue: {
          include: {
            attribute: true,
          },
        },
      },

      orderBy: {
        attributeValue: {
          position: "asc",
        },
      },
    });
  }

  async findOne(
    variantId: string,
    attributeValueId: string
  ) {
    return prisma.productVariantValue.findUnique({
      where: {
        variantId_attributeValueId: {
          variantId,
          attributeValueId,
        },
      },
    });
  }

  async create(
    data: Prisma.ProductVariantValueCreateInput
  ) {
    return prisma.productVariantValue.create({
      data,

      include: {
        variant: true,

        attributeValue: {
          include: {
            attribute: true,
          },
        },
      },
    });
  }

  async delete(
    variantId: string,
    attributeValueId: string
  ) {
    return prisma.productVariantValue.delete({
      where: {
        variantId_attributeValueId: {
          variantId,
          attributeValueId,
        },
      },
    });
  }
}