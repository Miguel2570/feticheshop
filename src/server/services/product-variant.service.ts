import { Prisma } from "@prisma/client";

import { ProductVariantRepository } from "@/server/repositories/product-variant.repository";

export interface ProductVariantInput {
  productId: string;

  name: string;

  sku?: string | null;
  ean?: string | null;
  barcode?: string | null;

  price?: Prisma.Decimal | number | null;
  comparePrice?: Prisma.Decimal | number | null;
  costPrice?: Prisma.Decimal | number | null;

  stock?: number;

  allowBackorder?: boolean;

  weight?: number | null;
  width?: number | null;
  height?: number | null;
  length?: number | null;

  isActive?: boolean;
}

export class ProductVariantService {
  private repository =
    new ProductVariantRepository();

  async getVariants(options?: {
    page?: number;
    limit?: number;
    search?: string;
    productId?: string;
    isActive?: boolean;
  }) {
    return this.repository.findAll(options);
  }

  async getVariantById(id: string) {
    const variant =
      await this.repository.findById(id);

    if (!variant) {
      throw new Error("Variant not found");
    }

    return variant;
  }

  async createVariant(
    data: ProductVariantInput
  ) {
    if (data.sku) {
      const sku =
        await this.repository.findBySku(
          data.sku
        );

      if (sku) {
        throw new Error(
          "SKU already exists"
        );
      }
    }

    const prismaData: Prisma.ProductVariantCreateInput =
      {
        name: data.name,

        sku: data.sku ?? null,
        ean: data.ean ?? null,
        barcode:
          data.barcode ?? null,

        price:
          data.price != null
            ? new Prisma.Decimal(
                data.price
              )
            : null,

        comparePrice:
          data.comparePrice != null
            ? new Prisma.Decimal(
                data.comparePrice
              )
            : null,

        costPrice:
          data.costPrice != null
            ? new Prisma.Decimal(
                data.costPrice
              )
            : null,

        stock: data.stock ?? 0,

        allowBackorder:
          data.allowBackorder ??
          false,

        weight:
          data.weight ?? null,

        width:
          data.width ?? null,

        height:
          data.height ?? null,

        length:
          data.length ?? null,

        isActive:
          data.isActive ?? true,

        product: {
          connect: {
            id: data.productId,
          },
        },
      };

    return this.repository.create(
      prismaData
    );
  }

  async updateVariant(
    id: string,
    data: Partial<ProductVariantInput>
  ) {
    const current =
      await this.getVariantById(id);

    if (
      data.sku &&
      data.sku !== current.sku
    ) {
      const exists =
        await this.repository.findBySku(
          data.sku
        );

      if (
        exists &&
        exists.id !== id
      ) {
        throw new Error(
          "SKU already exists"
        );
      }
    }

    const prismaData: Prisma.ProductVariantUpdateInput =
      {};

    if (data.name !== undefined)
      prismaData.name = data.name;

    if (data.sku !== undefined)
      prismaData.sku = data.sku;

    if (data.ean !== undefined)
      prismaData.ean = data.ean;

    if (
      data.barcode !== undefined
    )
      prismaData.barcode =
        data.barcode;

    if (data.price !== undefined)
      prismaData.price =
        data.price == null
          ? null
          : new Prisma.Decimal(
              data.price
            );

    if (
      data.comparePrice !==
      undefined
    )
      prismaData.comparePrice =
        data.comparePrice == null
          ? null
          : new Prisma.Decimal(
              data.comparePrice
            );

    if (
      data.costPrice !==
      undefined
    )
      prismaData.costPrice =
        data.costPrice == null
          ? null
          : new Prisma.Decimal(
              data.costPrice
            );

    if (data.stock !== undefined)
      prismaData.stock = data.stock;

    if (
      data.allowBackorder !==
      undefined
    )
      prismaData.allowBackorder =
        data.allowBackorder;

    if (
      data.weight !== undefined
    )
      prismaData.weight =
        data.weight;

    if (
      data.width !== undefined
    )
      prismaData.width =
        data.width;

    if (
      data.height !== undefined
    )
      prismaData.height =
        data.height;

    if (
      data.length !== undefined
    )
      prismaData.length =
        data.length;

    if (
      data.isActive !== undefined
    )
      prismaData.isActive =
        data.isActive;

    return this.repository.update(
      id,
      prismaData
    );
  }

  async deleteVariant(id: string) {
    await this.getVariantById(id);

    return this.repository.delete(id);
  }
}

export const productVariantService =
  new ProductVariantService();