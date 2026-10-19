import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { syncStock } from "@/lib/sync/sync-stock";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  if (!expectedToken) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = new Date();

  // ✅ A MÁGICA ACONTECE AQUI
  // Dizes à Vercel para manter a função viva até o sync terminar
  waitUntil(
    syncStock()
      .then((result) => {
        console.log("✅ Sync concluído:", {
          duration: result.durationMs,
          itemsProcessed: result.itemsProcessed,
          productsUpdated: result.productsUpdated,
          errors: result.errors,
        });
      })
      .catch((error) => {
        console.error("❌ Sync falhou:", error);
      })
  );

  // O cron-job.org recebe isto em milissegundos e fica verde
  return NextResponse.json({
    status: "started",
    message: "Sync a correr em background (waitUntil)",
    startedAt: startedAt.toISOString(),
  });
}

export async function POST(request: NextRequest) {
  return GET(request);
}