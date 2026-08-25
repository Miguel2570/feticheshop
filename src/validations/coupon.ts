import { z } from "zod";

const couponBaseSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "O código deve ter pelo menos 3 caracteres.")
      .max(50, "O código não pode ter mais de 50 caracteres.")
      .transform((value) => value.toUpperCase()),

    name: z
      .string()
      .trim()
      .min(2, "O nome deve ter pelo menos 2 caracteres.")
      .max(100, "O nome não pode ter mais de 100 caracteres."),

    description: z
      .string()
      .trim()
      .max(500, "A descrição não pode ter mais de 500 caracteres.")
      .optional(),

    discountValue: z.coerce
      .number()
      .positive("O desconto deve ser superior a 0."),

    isPercentage: z.coerce.boolean().default(true),

    maximumDiscount: z.coerce
      .number()
      .positive("O desconto máximo deve ser superior a 0.")
      .optional(),

    minimumAmount: z.coerce
      .number()
      .min(0, "A compra mínima não pode ser negativa.")
      .optional(),

    usageLimit: z.coerce
      .number()
      .int()
      .positive("O limite de utilizações deve ser superior a 0.")
      .optional(),

    usagePerUser: z.coerce
      .number()
      .int()
      .positive("O limite por utilizador deve ser superior a 0.")
      .default(1),

    startsAt: z.coerce.date().optional(),

    endsAt: z.coerce.date().optional(),

    isActive: z.coerce.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.isPercentage && data.discountValue > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message: "Uma percentagem não pode ser superior a 100%.",
      });
    }

    if (
      data.startsAt &&
      data.endsAt &&
      data.endsAt <= data.startsAt
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endsAt"],
        message: "A data de fim deve ser posterior à data de início.",
      });
    }

    if (
      data.maximumDiscount !== undefined &&
      !data.isPercentage
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["maximumDiscount"],
        message:
          "O desconto máximo só pode ser utilizado em cupões de percentagem.",
      });
    }
  });

export const createCouponSchema = couponBaseSchema;

export const updateCouponSchema = couponBaseSchema.partial();

export const updateCouponStatusSchema = z.object({
  isActive: z.boolean(),
});

export const validateCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3)
    .transform((value) => value.toUpperCase()),

  subtotal: z.coerce.number().positive(),
});

export type CreateCouponInput =
  z.infer<typeof createCouponSchema>;

export type UpdateCouponInput =
  z.infer<typeof updateCouponSchema>;

export type UpdateCouponStatusInput =
  z.infer<typeof updateCouponStatusSchema>;

export type ValidateCouponInput =
  z.infer<typeof validateCouponSchema>;