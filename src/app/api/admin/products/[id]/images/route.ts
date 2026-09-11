// src/app/api/admin/products/[id]/images/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/server/middleware/admin";

// GET - listar imagens do produto
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const images = await prisma.productImage.findMany({
      where: { productId: id },
      orderBy: { position: "asc" },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar imagens" },
      { status: 500 }
    );
  }
}

// PATCH - atualizar imagem (isPrimary, position, alt)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { imageId, isPrimary, position, alt } = body;

    if (!imageId) {
      return NextResponse.json(
        { error: "imageId é obrigatório" },
        { status: 400 }
      );
    }

    // Se está a definir como principal, remover principal das outras
    if (isPrimary === true) {
      await prisma.productImage.updateMany({
        where: { productId: id },
        data: { isPrimary: false },
      });
    }

    const image = await prisma.productImage.update({
      where: { id: imageId },
      data: {
        ...(isPrimary !== undefined && { isPrimary }),
        ...(position !== undefined && { position }),
        ...(alt !== undefined && { alt }),
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar imagem" },
      { status: 500 }
    );
  }
}

// DELETE - remover imagem
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json(
        { error: "imageId é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se a imagem pertence ao produto
    const image = await prisma.productImage.findFirst({
      where: { id: imageId, productId: id },
    });

    if (!image) {
      return NextResponse.json(
        { error: "Imagem não encontrada" },
        { status: 404 }
      );
    }

    // Apagar do banco
    await prisma.productImage.delete({
      where: { id: imageId },
    });

    // Se era a principal, definir outra como principal
    if (image.isPrimary) {
      const nextImage = await prisma.productImage.findFirst({
        where: { productId: id },
        orderBy: { position: "asc" },
      });

      if (nextImage) {
        await prisma.productImage.update({
          where: { id: nextImage.id },
          data: { isPrimary: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao remover imagem" },
      { status: 500 }
    );
  }
}