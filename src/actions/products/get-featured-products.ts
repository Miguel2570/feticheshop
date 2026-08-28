"use server";

import { prisma } from "@/lib/prisma";

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: {
      isFeatured: true,
      status: "ACTIVE",
    },

    include: {
      brand: true,

      images: {
        where: {
          isPrimary: true,
        },
        orderBy: {
          position: "asc",
        },
        take: 1,
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 8,
  });
}