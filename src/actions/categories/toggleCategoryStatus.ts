"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleCategoryStatus(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      isActive: true,
    },
  });

  if (!category) return;

  await prisma.category.update({
    where: { id },
    data: {
      isActive: !category.isActive,

      // Se a categoria for ocultada,
      // deixa também de ser destacada.
      ...(category.isActive
        ? {
            isFeatured: false,
          }
        : {}),
    },
  });

  revalidatePath("/admin/categories");
}