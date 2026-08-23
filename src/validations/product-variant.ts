import { z } from "zod";

export const createProductVariantSchema = z.object({
  productId: z.string().cuid(),

  name: z
    .string()
    .min(2)
    .max(150),

  sku: z
    .string()
    .max(100)
    .optional()
    .nullable(),

  ean: z
    .string()
    .max(100)
    .optional()
    .nullable(),

  barcode: z
    .string()
    .max(100)
    .optional()
    .nullable(),

  price: z
    .coerce
    .number()
    .min(0)
    .optional()
    .nullable(),

  comparePrice: z
    .coerce
    .number()
    .min(0)
    .optional()
    .nullable(),

  costPrice: z
    .coerce
    .number()
    .min(0)
    .optional()
    .nullable(),

  stock: z
    .number()
    .int()
    .min(0)
    .default(0),

  allowBackorder: z
    .boolean()
    .default(false),

  weight: z
    .coerce
    .number()
    .min(0)
    .optional()
    .nullable(),

  width: z
    .coerce
    .number()
    .min(0)
    .optional()
    .nullable(),

  height: z
    .coerce
    .number()
    .min(0)
    .optional()
    .nullable(),

  length: z
    .coerce
    .number()
    .min(0)
    .optional()
    .nullable(),

  isActive: z
    .boolean()
    .default(true),
});

export const updateProductVariantSchema =
  createProductVariantSchema.partial();

export const productVariantFiltersSchema =
  z.object({
    page: z.coerce
      .number()
      .min(1)
      .default(1),

    limit: z.coerce
      .number()
      .min(1)
      .max(100)
      .default(20),

    search: z.string().optional(),

    productId: z
      .string()
      .cuid()
      .optional(),

    isActive: z.coerce
      .boolean()
      .optional(),
  });

export type CreateProductVariantInput =
  z.infer<
    typeof createProductVariantSchema
  >;

export type UpdateProductVariantInput =
  z.infer<
    typeof updateProductVariantSchema
  >;

export type ProductVariantFilters =
  z.infer<
    typeof productVariantFiltersSchema
  >;