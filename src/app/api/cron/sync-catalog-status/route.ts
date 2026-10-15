import { NextRequest, NextResponse } from "next/server";

import { syncCatalogStatus } from "@/lib/sync/sync-catalog-status";

// Protege o endpoint com CRON_SECRET
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.warn("⚠️  CRON_SECRET não definido — endpoint desprotegido");
    return true; // dev only, em prod devia bloquear
  }

  return authHeader === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("🔄 A iniciar sync-catalog-status...");
    const resultado = await syncCatalogStatus();
    console.log("✅ Sync concluído:", resultado);

    return NextResponse.json({
      success: true,
      ...resultado,
    });
  } catch (error) {
    console.error("❌ Erro no sync-catalog-status:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}