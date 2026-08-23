"use server";

import { prisma } from "@/lib/prisma";

export async function toggleFeatured(categoryId: string) {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new Error("Categoria não encontrada.");
  }

  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      isFeatured: !category.isFeatured,
    },
  });
}