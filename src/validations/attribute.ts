import { z } from "zod";

export const createAttributeSchema = z.object({
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

  isFilter: z.boolean().default(true),

  isRequired: z.boolean().default(false),

  isActive: z.boolean().default(true),

  position: z
    .number()
    .int()
    .min(0)
    .default(0),
});

export const updateAttributeSchema =
  createAttributeSchema.partial();

export const attributeFiltersSchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(20),

  search: z.string().optional(),

  isActive: z.coerce.boolean().optional(),
});

export type CreateAttributeInput =
  z.infer<typeof createAttributeSchema>;

export type UpdateAttributeInput =
  z.infer<typeof updateAttributeSchema>;

export type AttributeFilters =
  z.infer<typeof attributeFiltersSchema>;