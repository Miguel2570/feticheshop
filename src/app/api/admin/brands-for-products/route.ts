// app/api/admin/brands-for-products/route.ts
import { NextResponse } from "next/server";

import { requireAdmin } from "@/server/middleware/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();

    const brands = await prisma.brand.findMany({
      where: {
        isActive: true,
        products: { some: { status: "ACTIVE", deletedAt: null } },
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