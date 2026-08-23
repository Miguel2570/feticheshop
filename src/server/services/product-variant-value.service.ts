import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { ProductVariantValueRepository } from "@/server/repositories/product-variant-value.repository";

export interface ProductVariantValueInput {
  variantId: string;
  attributeValueId: string;
}

export class ProductVariantValueService {
  private repository =
    new ProductVariantValueRepository();

  async getValues(variantId?: string) {
    return this.repository.findAll({
      variantId,
    });
  }

  async createValue(
    data: ProductVariantValueInput
  ) {
    // Verifica se a variante existe
    const variant =
      await prisma.productVariant.findUnique({
        where: {
          id: data.variantId,
        },
      });

    if (!variant) {
      throw new Error("Variant not found");
    }

    // Verifica se o valor existe
    const attributeValue =
      await prisma.attributeValue.findUnique({
        where: {
          id: data.attributeValueId,
        },
        include: {
          attribute: true,
        },
      });

    if (!attributeValue) {
      throw new Error(
        "Attribute value not found"
      );
    }

    // Não permitir duplicados
    const exists =
      await this.repository.findOne(
        data.variantId,
        data.attributeValueId
      );

    if (exists) {
      throw new Error(
        "Attribute value already assigned"
      );
    }

    // Não permitir duas cores, dois tamanhos, etc.
    const currentValues =
      await prisma.productVariantValue.findMany({
        where: {
          variantId: data.variantId,
        },
        include: {
          attributeValue: true,
        },
      });

    const ids = currentValues.map(
      (v) => v.attributeValueId
    );

    if (ids.length > 0) {
      const values =
        await prisma.attributeValue.findMany({
          where: {
            id: {
              in: ids,
            },
          },
        });

      const alreadyHasSameAttribute =
        values.some(
          (v) =>
            v.attributeId ===
            attributeValue.attributeId
        );

      if (alreadyHasSameAttribute) {
        throw new Error(
          "Variant already has a value for this attribute"
        );
      }
    }

    const prismaData: Prisma.ProductVariantValueCreateInput =
      {
        variant: {
          connect: {
            id: data.variantId,
          },
        },

        attributeValue: {
          connect: {
            id: data.attributeValueId,
          },
        },
      };

    return this.repository.create(
      prismaData
    );
  }

  async deleteValue(
    variantId: string,
    attributeValueId: string
  ) {
    const exists =
      await this.repository.findOne(
        variantId,
        attributeValueId
      );

    if (!exists) {
      throw new Error(
        "Relation not found"
      );
    }

    return this.repository.delete(
      variantId,
      attributeValueId
    );
  }
}

export const productVariantValueService =
  new ProductVariantValueService();