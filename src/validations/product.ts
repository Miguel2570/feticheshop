import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  sku: z.string().nullable().optional(),
  ean: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  keywords: z.string().nullable().optional(),
  price: z.coerce.number().positive(),
  comparePrice: z.coerce.number().nullable().optional(),
  costPrice: z.coerce.number().nullable().optional(),
  stock: z.coerce.number().int().default(0),
  physicalStock: z.coerce.number().int().default(0),
  supplierStock: z.coerce.number().int().default(0),
  stockMode: z.enum(["PHYSICAL", "SUPPLIER", "BOTH"]).default("PHYSICAL"),
  manageStock: z.boolean().default(true),
  status: z.enum(["DRAFT", "ACTIVE", "HIDDEN", "OUT_OF_STOCK", "ARCHIVED"]).default("DRAFT"),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  weight: z.coerce.number().nullable().optional(),
  width: z.coerce.number().nullable().optional(),
  height: z.coerce.number().nullable().optional(),
  length: z.coerce.number().nullable().optional(),
  brandId: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;