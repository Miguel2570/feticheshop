import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { syncMissingImages } from "@/lib/sync/sync-images";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  waitUntil(
    syncMissingImages()
      .then((resultado) => {
        console.log("✅ Sync de imagens concluído:", resultado);
      })
      .catch((error) => {
        console.error("❌ Erro no sync de imagens:", error);
      })
  );

  return NextResponse.json({
    success: true,
    status: "started",
    message: "Sincronização de imagens em background",
  });
}

export async function POST(request: NextRequest) {
  return GET(request);
}