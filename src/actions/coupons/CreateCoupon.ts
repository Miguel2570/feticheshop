"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export async function CreateCoupon(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  const discountValue = Number(
    formData.get("discountValue") ?? 0,
  );

  const isPercentage =
    formData.get("isPercentage") === "true";

  const maximumDiscount =
    formData.get("maximumDiscount")
      ? Number(formData.get("maximumDiscount"))
      : null;

  const minimumAmount =
    formData.get("minimumAmount")
      ? Number(formData.get("minimumAmount"))
      : null;

  const usageLimit =
    formData.get("usageLimit")
      ? Number(formData.get("usageLimit"))
      : null;

  const usagePerUser =
    formData.get("usagePerUser")
      ? Number(formData.get("usagePerUser"))
      : 1;

  const startsAt = formData.get("startsAt")
    ? new Date(String(formData.get("startsAt")))
    : null;

  const endsAt = formData.get("endsAt")
    ? new Date(String(formData.get("endsAt")))
    : null;

  const isActive =
    formData.get("isActive") === "true";

  if (!code) {
    throw new Error("Código obrigatório.");
  }

  if (!name) {
    throw new Error("Nome obrigatório.");
  }

  if (discountValue <= 0) {
    throw new Error(
      "O desconto deve ser superior a 0.",
    );
  }

  const exists = await prisma.coupon.findUnique({
    where: {
      code,
    },
  });

  if (exists) {
    throw new Error(
      "Já existe um cupão com esse código.",
    );
  }

  await prisma.coupon.create({
    data: {
      code,
      name,
      description: description || null,

      discountValue,

      isPercentage,

      maximumDiscount,

      minimumAmount,

      usageLimit,

      usagePerUser,

      startsAt,

      endsAt,

      isActive,
    },
  });

  revalidatePath("/admin/coupons");

  redirect("/admin/coupons");
}