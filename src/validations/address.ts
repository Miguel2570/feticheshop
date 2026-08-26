import { z } from "zod";

export const createAddressSchema = z.object({
  type: z.enum(["SHIPPING", "BILLING"]).default("SHIPPING"),
  firstName: z.string().min(1, "Primeiro nome é obrigatório"),
  lastName: z.string().min(1, "Último nome é obrigatório"),
  phone: z.string().min(9, "Telemóvel inválido"),
  email: z.string().email().optional(),
  addressLine1: z.string().min(1, "Morada é obrigatória"),
  addressLine2: z.string().optional(),
  postalCode: z.string().min(4, "Código postal inválido"),
  city: z.string().min(1, "Cidade é obrigatória"),
  district: z.string().optional(),
  country: z.string().default("Portugal"),
  isDefault: z.boolean().default(false),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;