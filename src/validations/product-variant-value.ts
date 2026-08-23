import { z } from "zod";

export const createProductVariantValueSchema =
  z.object({
    variantId: z.string().cuid(),

    attributeValueId: z.string().cuid(),
  });

export const deleteProductVariantValueSchema =
  z.object({
    variantId: z.string().cuid(),

    attributeValueId: z.string().cuid(),
  });

export const productVariantValueFiltersSchema =
  z.object({
    variantId: z
      .string()
      .cuid()
      .optional(),
  });

export type CreateProductVariantValueInput =
  z.infer<
    typeof createProductVariantValueSchema
  >;

export type DeleteProductVariantValueInput =
  z.infer<
    typeof deleteProductVariantValueSchema
  >;

export type ProductVariantValueFilters =
  z.infer<
    typeof productVariantValueFiltersSchema
  >;