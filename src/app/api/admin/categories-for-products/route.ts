// src/app/api/admin/categories-for-products/route.ts

import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/server/middleware/admin";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    // Buscar apenas subcategorias (parentId != null) com o pai incluído
    const categories = await prisma.category.findMany({
      where: {
        parentId: { not: null },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { parent: { sortOrder: "asc" } },
        { sortOrder: "asc" },
      ],
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Erro ao buscar categorias" },
      { status: 500 }
    );
  }
}