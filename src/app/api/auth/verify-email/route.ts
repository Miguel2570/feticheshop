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

    const code =
      String(body.code || "")
        .trim();

    if (
      !email ||
      !/^\d{6}$/.test(code)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email ou código inválido.",
        },
        {
          status: 400,
        }
      );
    }

    await emailVerificationService.verify(
      email,
      code
    );

    return NextResponse.json({
      success: true,
      message:
        "Email confirmado com sucesso.",
    });
  } catch (error) {
    console.error(
      "Email verification error:",
      error
    );

    if (
      error instanceof Error &&
      error.message ===
        "VERIFICATION_EXPIRED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "O código expirou. Pede um novo código.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Código de verificação inválido.",
      },
      {
        status: 400,
      }
    );
  }
}