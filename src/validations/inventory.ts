import { InventoryMovementType } from "@prisma/client";
import { z } from "zod";

export const createInventoryMovementSchema =
  z.object({
    variantId: z.string().cuid(),

    quantity: z
      .number()
      .int()
      .refine((value) => value !== 0, {
        message:
          "Quantity cannot be zero",
      }),

    type: z.nativeEnum(
      InventoryMovementType
    ),

    referenceType: z
      .enum([
        "ORDER",
        "PURCHASE",
        "MANUAL",
        "IMPORT",
      ])
      .optional(),

    referenceId: z
      .string()
      .optional(),

    reason: z.string().optional(),
  });

export const inventoryFiltersSchema =
  z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce
      .number()
      .min(1)
      .max(100)
      .default(20),

    variantId: z
      .string()
      .cuid()
      .optional(),

    type: z
      .nativeEnum(
        InventoryMovementType
      )
      .optional(),
  });

export type CreateInventoryMovementInput =
  z.infer<
    typeof createInventoryMovementSchema
  >;

export type InventoryFilters =
  z.infer<
    typeof inventoryFiltersSchema
  >;