import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { cleanBrokenImages } from "@/lib/sync/clean-broken-images";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutos

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Dispara em background para o cron-job.org receber 200 OK imediato
  waitUntil(
    cleanBrokenImages()
      .then((res) => console.log("✅ Limpeza concluída:", res))
      .catch((err) => console.error("❌ Erro na limpeza:", err))
  );

  return NextResponse.json({
    success: true,
    status: "started",
    message: "Limpeza de imagens em background",
  });
}

export async function POST(request: NextRequest) {
  return GET(request);
}