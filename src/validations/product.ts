import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  sku: z.string().nullable().optional(),
  ean: z.string().nullable().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
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
  weight: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  length: z.coerce.number().optional(),
  featured: z.boolean().default(false),
  brandId: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;