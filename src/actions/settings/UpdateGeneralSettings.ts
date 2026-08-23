"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function UpdateGeneralSettings(
  formData: FormData,
) {
  const settings = [
    {
      key: "store_name",
      value: String(
        formData.get("store_name") ?? "",
      ),
    },

    {
      key: "store_email",
      value: String(
        formData.get("store_email") ?? "",
      ),
    },

    {
      key: "store_phone",
      value: String(
        formData.get("store_phone") ?? "",
      ),
    },

    {
      key: "store_address",
      value: String(
        formData.get("store_address") ?? "",
      ),
    },

    {
      key: "vat",
      value: Number(
        formData.get("vat") ?? 23,
      ),
    },

    {
      key: "currency",
      value: String(
        formData.get("currency") ?? "EUR",
      ),
    },

    {
      key: "free_shipping",
      value: Number(
        formData.get("free_shipping") ?? 0,
      ),
    },

    {
      key: "shipping_price",
      value: Number(
        formData.get("shipping_price") ?? 0,
      ),
    },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: {
        key: setting.key,
      },

      update: {
        value: setting.value,
      },

      create: {
        key: setting.key,
        value: setting.value,
        category: "general",
      },
    });
  }

  revalidatePath("/admin/settings");
}