import { z } from "zod";

export const createBrandSchema = z.object({
  name: z
    .string()
    .min(2, "Name must have at least 2 characters")
    .max(100),

  slug: z
    .string()
    .min(2)
    .max(150)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),

  description: z
    .string()
    .max(1000)
    .optional()
    .nullable(),

  logo: z
    .string()
    .url()
    .optional()
    .nullable(),

  metaTitle: z
    .string()
    .max(60)
    .optional()
    .nullable(),

  metaDescription: z
    .string()
    .max(160)
    .optional()
    .nullable(),

  isActive: z.boolean().default(true),
});

export const updateBrandSchema =
  createBrandSchema.partial();

export const brandFiltersSchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(20),

  search: z.string().optional(),

  isActive: z.coerce.boolean().optional(),
});

export type CreateBrandInput =
  z.infer<typeof createBrandSchema>;

export type UpdateBrandInput =
  z.infer<typeof updateBrandSchema>;

export type BrandFilters =
  z.infer<typeof brandFiltersSchema>;