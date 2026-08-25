// src/app/api/products/[slug]/physical-stock/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }  // Mudar de id para slug
) {
  const { slug } = await params;  // Extrair slug em vez de id
  const body = await request.json();
  const stock = body.stock;

  if (typeof stock !== "number" || stock < 0) {
    return NextResponse.json({ error: "Stock inválido" }, { status: 400 });
  }

  try {
    const product = await prisma.product.update({
      where: { slug },  // Usar slug em vez de id
      data: { physicalStock: stock },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Erro ao atualizar stock físico:", error);
    return NextResponse.json(
      { error: "Produto não encontrado ou erro ao atualizar" },
      { status: 404 }
    );
  }
}

// Se também houver um GET para verificar o stock
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }  // Mudar de id para slug
) {
  const { slug } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug },  // Usar slug em vez de id
      select: {
        physicalStock: true,
        supplierStock: true,
        stock: true,
        stockMode: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Erro ao buscar stock:", error);
    return NextResponse.json(
      { error: "Erro ao buscar stock" },
      { status: 500 }
    );
  }
}