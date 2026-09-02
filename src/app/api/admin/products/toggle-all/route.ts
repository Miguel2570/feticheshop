// src/app/api/admin/products/toggle-all/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/server/middleware/admin";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { active } = body; // true = mostrar todos, false = ocultar todos

    if (typeof active !== "boolean") {
      return NextResponse.json(
        { message: "Parâmetro 'active' é obrigatório" },
        { status: 400 }
      );
    }

    // Atualizar todos os produtos
    const result = await prisma.product.updateMany({
      where: {
        status: active ? "HIDDEN" : "ACTIVE",
      },
      data: {
        status: active ? "ACTIVE" : "HIDDEN",
      },
    });

    return NextResponse.json({
      success: true,
      updated: result.count,
      message: active
        ? `${result.count} produtos mostrados no site`
        : `${result.count} produtos ocultados do site`,
    });
  } catch (error) {
    console.error("Erro ao atualizar produtos:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Erro ao atualizar produtos" },
      { status: 500 }
    );
  }
}