import { z } from "zod";

import {
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";

export const updatePaymentStatusSchema =
  z.object({
    status: z.nativeEnum(PaymentStatus),
  });

export const updatePaymentMethodSchema =
  z.object({
    method: z.nativeEnum(PaymentMethod),
  });

export const updateTransactionSchema =
  z.object({
    transactionId: z.string().min(1),

    gateway: z
      .string()
      .optional(),

    gatewayResponse: z
      .record(z.string(), z.any())
      .optional(),
  });

export type UpdatePaymentStatusInput =
  z.infer<
    typeof updatePaymentStatusSchema
  >;

export type UpdatePaymentMethodInput =
  z.infer<
    typeof updatePaymentMethodSchema
  >;

export type UpdateTransactionInput =
  z.infer<
    typeof updateTransactionSchema
  >;