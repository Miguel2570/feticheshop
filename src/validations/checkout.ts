import { z } from "zod";

export const checkoutSchema = z.object({
  addressId: z.string().cuid(),

  notes: z
    .string()
    .max(500)
    .optional(),

  couponCode: z
    .string()
    .optional(),
});

export type CheckoutInput =
  z.infer<typeof checkoutSchema>;