// src/app/api/products/[slug]/stock-mode/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }  // Mudar de id para slug
) {
  const { slug } = await params;  // Extrair slug em vez de id
  const body = await request.json();
  const mode = body.mode;

  if (!["PHYSICAL", "SUPPLIER", "BOTH"].includes(mode)) {
    return NextResponse.json({ error: "Modo inválido" }, { status: 400 });
  }

  try {
    const product = await prisma.product.update({
      where: { slug },  // Usar slug em vez de id
      data: { stockMode: mode },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Erro ao atualizar modo de stock:", error);
    return NextResponse.json(
      { error: "Produto não encontrado ou erro ao atualizar" },
      { status: 404 }
    );
  }
}