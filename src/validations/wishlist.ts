import { z } from "zod";

export const wishlistItemSchema = z.object({
  productId: z.string().cuid(),
});

export type WishlistItemInput =
  z.infer<typeof wishlistItemSchema>;