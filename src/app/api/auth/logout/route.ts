import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/server/auth/cookies";
import { logoutService } from "@/server/services/logout.service";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // 1. Logout do JWT (email/senha)
    await logoutService.logout();
    await clearAuthCookies();

    // 2. Logout do Better Auth (Google)
    try {
      await auth.api.signOut({
        headers: request.headers,
      });
    } catch {
      // Ignorar erro do Better Auth
    }

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