import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { syncPricesAndNewProducts } from "@/lib/sync/sync-prices";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  waitUntil(
    syncPricesAndNewProducts()
      .then((res) => console.log("✅ Sync preços/novos concluído:", res))
      .catch((err) => console.error("❌ Erro no sync de preços:", err))
  );

  return NextResponse.json({ success: true, message: "A atualizar preços e novos produtos..." });
}