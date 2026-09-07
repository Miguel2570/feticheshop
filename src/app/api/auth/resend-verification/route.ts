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

    console.log("📧 Reenviar código para:", email);

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

    try {
      await emailVerificationService.createAndSend(
        email
      );
      console.log("✅ Código reenviado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao reenviar código:", error);
      console.error("Mensagem:", error instanceof Error ? error.message : error);
      // resposta genérica
    }

    return NextResponse.json({
      success: true,
      message:
        "Se existir uma conta por verificar, receberás um novo código.",
    });
  } catch (error) {
    console.error("❌ Erro na rota de reenvio:", error);
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