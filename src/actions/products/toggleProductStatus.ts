"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductStatus } from "@prisma/client";

export async function toggleProductStatus(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: { status: true },
  });

  if (!product) return;

  await prisma.product.update({
    where: { id },
    data: {
      status:
        product.status === ProductStatus.ACTIVE
          ? ProductStatus.HIDDEN
          : ProductStatus.ACTIVE,
    },
  });

  revalidatePath("/admin/products");
}