"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleFeatured(id: string) {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    select: {
      isFeatured: true,
    },
  });

  if (!product) {
    return;
  }

  await prisma.product.update({
    where: {
      id,
    },
    data: {
      isFeatured: !product.isFeatured,
    },
  });

  // Admin
  revalidatePath("/admin/products");

  // Homepage
  revalidatePath("/");

  // Produtos
  revalidatePath("/products");

  // Produto individual
  revalidatePath(`/product/${id}`);
}