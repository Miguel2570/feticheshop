"use server";

import { prisma } from "@/lib/prisma";

export async function getCategoryProducts(slug: string) {
  return prisma.product.findMany({
    where: {
      status: "ACTIVE",
      categories: {
        some: {
          category: {
            slug,
            isActive: true,
          },
        },
      },
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
  });
}