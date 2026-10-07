// app/api/admin/brands-for-products/route.ts
import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/server/middleware/admin";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const categoryId = request.nextUrl.searchParams.get("category");

    const brands = await prisma.brand.findMany({
      where: {
        deletedAt: null,

        ...(categoryId
          ? {
              products: {
                some: {
                  deletedAt: null,
                  categories: { some: { categoryId } },
                },
              },
            }
          : {}),
      },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(brands);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ message: error.message }, { status: 401 });
      }
      if (error.message === "Forbidden") {
        return NextResponse.json({ message: error.message }, { status: 403 });
      }
    }

    return NextResponse.json(
      { message: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}