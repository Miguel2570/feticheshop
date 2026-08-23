"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function ToggleCouponStatus(id: string) {
  const coupon = await prisma.coupon.findUnique({
    where: { id },
  });

  if (!coupon) {
    throw new Error("Cupão não encontrado.");
  }

  await prisma.coupon.update({
    where: { id },
    data: {
      isActive: !coupon.isActive,
    },
  });

  revalidatePath("/admin/coupons");
  revalidatePath(`/admin/coupons/${id}`);
}