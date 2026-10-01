// app/api/admin/products/set-stock-mode/route.ts
import { NextRequest, NextResponse } from "next/server";
import { StockMode } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/server/middleware/admin";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { mode } = body;

    console.log("🔍 set-stock-mode recebido:", { mode });

    if (mode !== "SUPPLIER" && mode !== "PHYSICAL" && mode !== "BOTH") {
      return NextResponse.json(
        { message: "Modo inválido. Use SUPPLIER, PHYSICAL ou BOTH." },
        { status: 400 }
      );
    }

    const result = await prisma.product.updateMany({
      where: { deletedAt: null },
      data: {
        stockMode: mode as StockMode,
      },
    });

    console.log("✅ Atualizados:", result.count);

    const labels: Record<string, string> = {
      SUPPLIER: "Fornecedor (dropshipping)",
      PHYSICAL: "Loja (stock físico)",
      BOTH: "Ambos",
    };

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `Modo "${labels[mode]}" aplicado a ${result.count} produtos`,
    });
  } catch (error) {
    console.error("❌ ERRO set-stock-mode:", error);

    const message =
      error instanceof Error ? error.message : "Erro desconhecido";

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      if (error.message === "Forbidden") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json(
      { message: `Erro: ${message}` },
      { status: 500 }
    );
  }
}