"use server";

import { prisma } from "@/lib/prisma";

export async function getFeaturedCategories() {
  return prisma.category.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
}