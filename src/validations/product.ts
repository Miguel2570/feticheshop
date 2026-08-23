import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3).max(255),

  slug: z.string().min(3).max(255),

  shortDescription: z.string().optional(),

  description: z.string().optional(),

  metaTitle: z.string().optional(),

  metaDescription: z.string().optional(),

  keywords: z.string().optional(),

  price: z.coerce.number().positive(),

  comparePrice: z.coerce.number().optional(),

  costPrice: z.coerce.number().optional(),

  manageStock: z.boolean().default(true),

  weight: z.coerce.number().optional(),

  width: z.coerce.number().optional(),

  height: z.coerce.number().optional(),

  length: z.coerce.number().optional(),

  featured: z.boolean().default(false),

  brandId: z.string().nullable().optional(),
});

export const updateProductSchema =
  createProductSchema.partial();

export type CreateProductInput =
  z.infer<typeof createProductSchema>;

export type UpdateProductInput =
  z.infer<typeof updateProductSchema>;