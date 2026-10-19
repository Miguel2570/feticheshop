import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { syncCatalogStatus } from "@/lib/sync/sync-catalog-status";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutos

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.warn("⚠️  CRON_SECRET não definido — endpoint desprotegido");
    return true;
  }

  return authHeader === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("🔄 A iniciar sync-catalog-status em background...");

  // ✅ waitUntil: garante que a Vercel não mata o processo aos 1s
  waitUntil(
    syncCatalogStatus()
      .then((resultado) => {
        console.log("✅ Sync catálogo concluído:", resultado);
      })
      .catch((error) => {
        console.error("❌ Erro no sync-catalog-status:", error);
      })
  );

  // Responde ao cron-job.org instantaneamente (200 OK)
  return NextResponse.json({
    success: true,
    status: "started",
    message: "Verificação de catálogo a correr em background",
    startedAt: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  return GET(request);
}