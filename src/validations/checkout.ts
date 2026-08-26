import { z } from "zod";
import { PaymentMethod } from "@prisma/client";

export const checkoutSchema = z.object({
  addressId: z.string().min(1, "Seleciona uma morada de envio."),
  notes: z.string().max(500).optional(),
  couponCode: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;