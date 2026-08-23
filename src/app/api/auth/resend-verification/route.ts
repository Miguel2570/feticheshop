import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  emailVerificationService,
} from "@/server/services/email-verification.service";

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const email =
      String(body.email || "")
        .trim()
        .toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Introduz o teu email.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Não revelamos se o email existe.
     */

    try {
      await emailVerificationService.createAndSend(
        email
      );
    } catch {
      // resposta genérica
    }

    return NextResponse.json({
      success: true,
      message:
        "Se existir uma conta por verificar, receberás um novo código.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Não foi possível reenviar o código.",
      },
      {
        status: 500,
      }
    );
  }
}