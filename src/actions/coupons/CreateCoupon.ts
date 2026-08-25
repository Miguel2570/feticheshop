"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import {
  createCouponSchema,
} from "@/schemas/Coupon";

export async function CreateCoupon(
  formData: FormData,
) {
  const rawData = {
    code: formData.get("code"),
    name: formData.get("name"),
    description:
      formData.get("description") || undefined,

    discountValue:
      formData.get("discountValue"),

    isPercentage:
      formData.get("isPercentage"),

    maximumDiscount:
      formData.get("maximumDiscount") || undefined,

    minimumAmount:
      formData.get("minimumAmount") || undefined,

    usageLimit:
      formData.get("usageLimit") || undefined,

    usagePerUser:
      formData.get("usagePerUser") || undefined,

    startsAt:
      formData.get("startsAt") || undefined,

    endsAt:
      formData.get("endsAt") || undefined,

    isActive:
      formData.get("isActive"),
  };

  const result =
    createCouponSchema.safeParse(
      rawData
    );

  if (!result.success) {
    throw new Error(
      result.error.issues[0]?.message ??
        "Dados do cupão inválidos."
    );
  }

  const data = result.data;

  const exists =
    await prisma.coupon.findUnique({
      where: {
        code: data.code,
      },
    });

  if (exists) {
    throw new Error(
      "Já existe um cupão com esse código."
    );
  }

  await prisma.coupon.create({
    data: {
      code: data.code,
      name: data.name,
      description:
        data.description || null,

      discountValue:
        data.discountValue,

      isPercentage:
        data.isPercentage,

      maximumDiscount:
        data.maximumDiscount ?? null,

      minimumAmount:
        data.minimumAmount ?? null,

      usageLimit:
        data.usageLimit ?? null,

      usagePerUser:
        data.usagePerUser ?? 1,

      startsAt:
        data.startsAt ?? null,

      endsAt:
        data.endsAt ?? null,

      isActive:
        data.isActive,
    },
  });

  revalidatePath("/admin/coupons");

  redirect("/admin/coupons");
}