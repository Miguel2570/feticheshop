import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().cuid(),

  variantId: z.string().cuid().optional(),

  quantity: z.coerce
    .number()
    .int()
    .min(1)
    .max(99),
});

export const updateCartItemSchema = z.object({
  itemId: z.string().cuid(),

  quantity: z.coerce
    .number()
    .int()
    .min(1)
    .max(99),
});

export const removeCartItemSchema = z.object({
  itemId: z.string().cuid(),
});

export type AddToCartInput = z.infer<
  typeof addToCartSchema
>;

export type UpdateCartItemInput = z.infer<
  typeof updateCartItemSchema
>;

export type RemoveCartItemInput = z.infer<
  typeof removeCartItemSchema
>;