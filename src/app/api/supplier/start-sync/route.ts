import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import {
  syncDreamlove,
} from "@/actions/supplier/supplier-actions";

export async function POST() {
  // Verificar no banco se há sincronização em execução
  const existingSync = await prisma.supplierSync.findFirst({
    where: {
      status: "RUNNING",
      startedAt: {
        gte: new Date(Date.now() - 10 * 60 * 1000), // últimos 10 minutos
      },
    },
  });

  if (existingSync) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Já existe uma sincronização em execução.",
      },
      {
        status: 409,
      }
    );
  }

  // Limpar sincronizações antigas
  await prisma.supplierSync.updateMany({
    where: {
      status: "RUNNING",
      startedAt: {
        lt: new Date(Date.now() - 10 * 60 * 1000),
      },
    },
    data: {
      status: "FAILED",
      message: "Reset automático - sincronização presa",
      finishedAt: new Date(),
    },
  });

  // Iniciar sincronização
  syncDreamlove()
    .catch((error) => {
      console.error(
        "Erro na sincronização Dreamlove:",
        error
      );
    });

  return NextResponse.json({
    success: true,
    message:
      "Sincronização iniciada.",
  });
}