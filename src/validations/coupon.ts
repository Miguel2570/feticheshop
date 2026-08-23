import { z } from "zod";

export const createCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3)
    .max(50)
    .transform((value) => value.toUpperCase()),

  name: z.string().min(2).max(100),

  description: z.string().optional(),

  discountValue: z.coerce.number().positive(),

  isPercentage: z.boolean().default(true),

  maximumDiscount: z.coerce.number().positive().optional(),

  minimumAmount: z.coerce.number().min(0).optional(),

  usageLimit: z.coerce.number().int().positive().optional(),

  usagePerUser: z.coerce.number().int().positive().optional(),

  startsAt: z.coerce.date().optional(),

  endsAt: z.coerce.date().optional(),

  isActive: z.boolean().default(true),
});

export const updateCouponSchema =
  createCouponSchema.partial();

export const updateCouponStatusSchema =
  z.object({
    isActive: z.boolean(),
  });

export const validateCouponSchema =
  z.object({
    code: z
      .string()
      .trim()
      .min(3)
      .transform((value) => value.toUpperCase()),

    subtotal: z.coerce.number(),
  });

export type CreateCouponInput =
  z.infer<typeof createCouponSchema>;

export type UpdateCouponInput =
  z.infer<typeof updateCouponSchema>;

export type UpdateCouponStatusInput =
  z.infer<
    typeof updateCouponStatusSchema
  >;

export type ValidateCouponInput =
  z.infer<
    typeof validateCouponSchema
  >;