import { z } from "zod";

export const createCategorySchema = z.object({
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

  image: z
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

  sortOrder: z.number().int().default(0),

  parentId: z
    .string()
    .cuid()
    .optional()
    .nullable(),
});

export const updateCategorySchema =
  createCategorySchema.partial();

export const categoryFiltersSchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(20),

  search: z.string().optional(),

  parentId: z.string().cuid().optional(),

  isActive: z.coerce.boolean().optional(),
});

export type CreateCategoryInput =
  z.infer<typeof createCategorySchema>;

export type UpdateCategoryInput =
  z.infer<typeof updateCategorySchema>;

export type CategoryFilters =
  z.infer<typeof categoryFiltersSchema>;