"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type ActionState = {
  success?: boolean;
  error?: string;
} | null;

export async function UpdateGeneralSettings(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const settings = [
      {
        key: "store_name",
        value: String(formData.get("store_name") ?? "").trim(),
      },
      {
        key: "store_email",
        value: String(formData.get("store_email") ?? "").trim(),
      },
      {
        key: "store_phone",
        value: String(formData.get("store_phone") ?? "").trim(),
      },
      {
        key: "store_address",
        value: String(formData.get("store_address") ?? "").trim(),
      },
      {
        key: "vat",
        // ✅ Converter sempre para String
        value: String(Number(formData.get("vat") ?? 23)),
      },
      {
        key: "currency",
        value: String(formData.get("currency") ?? "EUR").trim(),
      },
      {
        key: "free_shipping",
        // ✅ Converter sempre para String
        value: String(Number(formData.get("free_shipping") ?? 0)),
      },
      {
        key: "shipping_price",
        // ✅ Converter sempre para String
        value: String(Number(formData.get("shipping_price") ?? 0)),
      },
    ];

    for (const setting of settings) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: {
          key: setting.key,
          value: setting.value,
          category: "general",
        },
      });
    }

    revalidatePath("/admin/settings");
    // ✅ Também revalidar a raiz e outras páginas que usem estas settings
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("[UpdateGeneralSettings] Erro:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao guardar as definições.",
    };
  }
}