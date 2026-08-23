"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleFeaturedCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    select: {
      isFeatured: true,
    },
  });

  if (!category) {
    throw new Error("Categoria não encontrada.");
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data: {
      isFeatured: !category.isFeatured,
    },
    select: {
      id: true,
      isFeatured: true,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");

  return updatedCategory;
}