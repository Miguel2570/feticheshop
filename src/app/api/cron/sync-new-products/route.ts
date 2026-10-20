import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { syncNewProducts } from "@/lib/sync/sync-new-products";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("🔄 A iniciar importação de novos produtos...");

  waitUntil(
    syncNewProducts()
      .then((resultado) => {
        console.log("✅ Importação concluída:", resultado);
      })
      .catch((error) => {
        console.error("❌ Erro na importação:", error);
      })
  );

  return NextResponse.json({
    success: true,
    status: "started",
    message: "Importação de novos produtos a correr em background",
  });
}