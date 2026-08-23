"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function DeleteCoupon(id: string) {
  const coupon = await prisma.coupon.findUnique({
    where: {
      id,
    },

    include: {
      orders: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!coupon) {
    throw new Error("Cupão não encontrado.");
  }

  if (coupon.orders.length > 0) {
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