// src/app/api/auth/forgot-password/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/server/services/email.service";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email é obrigatório" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Se a conta existir, receberás um email para redefinir a palavra-passe.",
      });
    }

    const resetToken = crypto.randomUUID();
    const resetExpires = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.passwordReset.deleteMany({
      where: {
        email: user.email,
        usedAt: null,
      },
    });

    await prisma.passwordReset.create({
      data: {
        email: user.email,
        token: resetToken,
        expiresAt: resetExpires,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    await emailService.sendPasswordResetEmail({
      email: user.email,
      firstName: user.firstName || "Utilizador",
      resetUrl,
    });

    return NextResponse.json({
      success: true,
      message: "Se a conta existir, receberás um email para redefinir a palavra-passe.",
    });
  } catch (error) {
    console.error("Erro ao enviar email de recuperação:", error);
    return NextResponse.json(
      { message: "Erro ao enviar email" },
      { status: 500 }
    );
  }
}