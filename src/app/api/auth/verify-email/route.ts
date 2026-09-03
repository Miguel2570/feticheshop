import { NextRequest, NextResponse } from "next/server";
import { emailVerificationService } from "@/server/services/email-verification.service";
import { authService } from "@/server/services/auth.service";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = String(body.email || "").trim().toLowerCase();
    const code = String(body.code || "").trim();

    if (!email || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { success: false, message: "Email ou código inválido." },
        { status: 400 }
      );
    }

    await emailVerificationService.verify(email, code);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    let tokens = null;

    if (user) {
      tokens = await authService.generateTokens(user);
    }

    return NextResponse.json({
      success: true,
      message: "Email confirmado com sucesso.",
      ...(tokens || {}),
    });
  } catch (error) {
    console.error("Email verification error:", error);

    if (error instanceof Error && error.message === "VERIFICATION_EXPIRED") {
      return NextResponse.json(
        { success: false, message: "O código expirou. Pede um novo código." },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return NextResponse.json(
        { success: false, message: "Utilizador não encontrado." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Código de verificação inválido." },
      { status: 400 }
    );
  }
}