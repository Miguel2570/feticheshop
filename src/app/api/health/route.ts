import { NextResponse } from "next/server";

import { checkDatabase } from "@/lib/health";

export async function GET() {
  const health = await checkDatabase();

  if (!health.ok) {
    return NextResponse.json(
      {
        status: "unhealthy",
        database: false,
      },
      {
        status: 503,
      }
    );
  }

  return NextResponse.json({
    status: "healthy",
    database: true,
  });
}