"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function DeleteCoupon(
  id: string,
) {
  const coupon =
    await prisma.coupon.findUnique({
      where: {
        id,
      },
    });

  if (!coupon) {
    throw new Error(
      "Cupão não encontrado."
    );
  }

  const orders =
    await prisma.order.count({
      where: {
        couponId: id,
      },
    });

  if (orders > 0) {
    throw new Error(
      "Não é possível eliminar um cupão que já foi utilizado."
    );
  }

  await prisma.coupon.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/coupons");
}