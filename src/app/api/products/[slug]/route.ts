import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json();

  try {
    const product = await prisma.product.update({
      where: { slug },
      data: {
        name: body.name,
        slug: body.slug,
        sku: body.sku,
        ean: body.ean,
        shortDescription: body.shortDescription,
        description: body.description,
        price: body.price,
        comparePrice: body.comparePrice,
        physicalStock: body.physicalStock,
        stockMode: body.stockMode,
        status: body.status,
        isFeatured: body.isFeatured,
        isNew: body.isNew,
        isOnSale: body.isOnSale,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}