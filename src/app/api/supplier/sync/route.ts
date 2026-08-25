import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get("supplierId");

  const sync = await prisma.supplierSync.findFirst({
    orderBy: { createdAt: "desc" },
  });

  // Contagem real de produtos na BD
  const totalInDb = await prisma.product.count();

  if (!sync) {
    return NextResponse.json({
      status: "IDLE",
      progress: 0,
      message: "Nenhuma sincronização",
      imported: totalInDb,
      updated: 0,
      failed: 0,
      totalProducts: totalInDb,
    });
  }

  const total = sync.totalProducts || 14804;
  const processed = sync.imported + sync.updated + sync.failed;
  const progress = sync.totalProducts > 0
    ? Math.min(100, Math.round((totalInDb / total) * 100))
    : Math.min(100, Math.round((processed / total) * 100));

  // Mensagem dinâmica que muda com o progresso
  const message = sync.status === "RUNNING"
    ? `A sincronizar... ${totalInDb}/${total} produtos na BD`
    : sync.message || `Concluída: ${totalInDb} produtos`;

  return NextResponse.json({
    status: sync.status,
    progress,
    message,
    imported: totalInDb,
    updated: sync.updated,
    failed: sync.failed,
    totalProducts: totalInDb,
    startedAt: sync.startedAt,
    finishedAt: sync.finishedAt,
  });
}