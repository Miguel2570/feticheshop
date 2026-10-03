// app/api/cron/sync-stock/route.ts
import { NextRequest, NextResponse } from "next/server";

import { syncStock } from "@/lib/sync-stock";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // segundos

export async function GET(request: NextRequest) {
  // Proteção por secret
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  if (!expectedToken) {
    console.error("❌ CRON_SECRET não configurado");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Fire and forget: dispara o sync e responde imediatamente
  // O sync continua a correr em background.
  const startedAt = new Date();

  void syncStock()
    .then((result) => {
      console.log("✅ Sync concluído:", {
        duration: result.durationMs,
        itemsProcessed: result.itemsProcessed,
        variantsUpdated: result.variantsUpdated,
        errors: result.errors,
      });
    })
    .catch((error) => {
      console.error("❌ Sync falhou:", error);
    });

  return NextResponse.json({
    status: "started",
    message: "Sync a correr em background",
    startedAt: startedAt.toISOString(),
  });
}

export async function POST(request: NextRequest) {
  return GET(request);
}