import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  authService,
} from "@/server/services/auth.service";

import {
  setAuthCookies,
} from "@/server/auth/cookies";

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const result =
      await authService.login(
        String(body.email || ""),
        String(body.password || "")
      );

    await setAuthCookies(
      result.accessToken,
      result.refreshToken
    );

    return NextResponse.json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    if (
      error instanceof Error &&
      error.message ===
        "EMAIL_NOT_VERIFIED"
    ) {
      return NextResponse.json(
        {
          success: false,
          code: "EMAIL_NOT_VERIFIED",
          message:
            "Tens de confirmar o teu email antes de iniciar sessão.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "ACCOUNT_DISABLED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A tua conta está desativada.",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Email ou palavra-passe incorretos.",
      },
      {
        status: 401,
      }
    );
  }
}