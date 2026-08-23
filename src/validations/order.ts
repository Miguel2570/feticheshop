import { OrderStatus } from "@prisma/client";
import { z } from "zod";

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export type UpdateOrderStatusInput =
  z.infer<typeof updateOrderStatusSchema>;