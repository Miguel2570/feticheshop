import { NextResponse } from "next/server";

import { requireAdmin } from "@/server/middleware/admin";

import { dashboardService } from "@/server/services/dashboard.service";

export async function GET() {
  try {
    await requireAdmin();

    const stats =
      await dashboardService.getStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          {
            message: error.message,
          },
          {
            status: 401,
          }
        );
      }

      if (error.message === "Forbidden") {
        return NextResponse.json(
          {
            message: error.message,
          },
          {
            status: 403,
          }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Failed to load dashboard",
      },
      {
        status: 500,
      }
    );
  }
}