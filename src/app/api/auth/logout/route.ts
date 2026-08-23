import { NextResponse } from "next/server";

import { clearAuthCookies } from "@/server/auth/cookies";
import { logoutService } from "@/server/services/logout.service";

export async function POST() {
  try {
    await logoutService.logout();

    await clearAuthCookies();

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Logout failed",
      },
      {
        status: 500,
      }
    );
  }
}