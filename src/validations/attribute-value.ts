import { z } from "zod";

export const createAttributeValueSchema = z.object({
  attributeId: z.string().cuid(),

  value: z
    .string()
    .min(1, "Value is required")
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

  colorHex: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Invalid HEX color"
    )
    .optional()
    .nullable(),

  image: z
    .string()
    .url("Invalid image URL")
    .optional()
    .nullable(),

  position: z
    .number()
    .int()
    .min(0)
    .default(0),

  isActive: z
    .boolean()
    .default(true),
});

export const updateAttributeValueSchema =
  createAttributeValueSchema.partial();

export const attributeValueFiltersSchema =
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

    attributeId: z
      .string()
      .cuid()
      .optional(),

    isActive: z.coerce
      .boolean()
      .optional(),
  });

export type CreateAttributeValueInput =
  z.infer<
    typeof createAttributeValueSchema
  >;

export type UpdateAttributeValueInput =
  z.infer<
    typeof updateAttributeValueSchema
  >;

export type AttributeValueFilters =
  z.infer<
    typeof attributeValueFiltersSchema
  >;