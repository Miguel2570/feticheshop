import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const stock = body.stock;

  if (typeof stock !== "number" || stock < 0) {
    return NextResponse.json({ error: "Stock inválido" }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id },
    data: { physicalStock: stock },
  });

  return NextResponse.json(product);
}