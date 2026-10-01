// app/api/cron/sync-stock/route.ts
import { NextRequest, NextResponse } from "next/server";

import { syncStock } from "@/lib/sync-stock";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // segundos — Vercel Hobby permite até 60s

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

  try {
    const result = await syncStock();
    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    console.error("Erro no cron:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}