import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncDreamlove } from "@/actions/supplier/supplier-actions";

export async function POST(request: Request) {
  const body = await request.json();
  const supplierId = body.supplierId;

  // Verificar se já existe sincronização RUNNING recente
  const existing = await prisma.supplierSync.findFirst({
    where: {
      status: "RUNNING",
      startedAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
    },
  });

  if (existing) {
    return NextResponse.json({
      success: false,
      message: "Já existe uma sincronização em execução.",
    }, { status: 409 });
  }

  // Criar registo imediatamente
  await prisma.supplierSync.create({
    data: {
      supplierId,
      status: "RUNNING",
      totalProducts: 14804,
      message: "A iniciar sincronização...",
    },
  });

  // Iniciar em background (sem await)
  syncDreamlove().catch(console.error);

  return NextResponse.json({
    success: true,
    message: "Sincronização iniciada.",
  });
}