import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const mode = body.mode;

  if (!["PHYSICAL", "SUPPLIER", "BOTH"].includes(mode)) {
    return NextResponse.json({ error: "Modo inválido" }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id },
    data: { stockMode: mode },
  });

  return NextResponse.json(product);
}