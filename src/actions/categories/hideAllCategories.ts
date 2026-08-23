"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function hideAllCategories() {
  await prisma.category.updateMany({
    where: {
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });

  revalidatePath("/admin/categories");
}