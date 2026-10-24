// src/app/api/admin/products/[id]/images/[imageId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/server/middleware/admin";

// PATCH - atualizar imagem específica (isPrimary, position, alt, isHidden, videoUrl)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    await requireAdmin();
    const { id, imageId } = await params;
    const body = await request.json();
    const { isPrimary, position, alt, isHidden, videoUrl } = body;

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
        ...(isHidden !== undefined && { isHidden }),
        ...(videoUrl !== undefined && { videoUrl }), // ✅ NOVO
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

// DELETE - remover imagem específica
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    await requireAdmin();
    const { id, imageId } = await params;

    const image = await prisma.productImage.findFirst({
      where: { id: imageId, productId: id },
    });

    if (!image) {
      return NextResponse.json(
        { error: "Imagem não encontrada" },
        { status: 404 }
      );
    }

    await prisma.productImage.delete({
      where: { id: imageId },
    });

    // Se era a principal, definir outra como principal (que não esteja escondida)
    if (image.isPrimary) {
      const nextImage = await prisma.productImage.findFirst({
        where: { productId: id, isHidden: false },
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