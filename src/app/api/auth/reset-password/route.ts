import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    // Logs para debug
    console.log("Token recebido:", token);
    console.log("Nova senha recebida (tamanho):", newPassword?.length);

    // Validar campos obrigatórios
    if (!token || !newPassword) {
      return NextResponse.json(
        { 
          message: "Token e nova palavra-passe são obrigatórios",
          code: "MISSING_FIELDS"
        },
        { status: 400 }
      );
    }

    // Validar tamanho mínimo da senha
    if (newPassword.length < 8) {
      return NextResponse.json(
        { 
          message: "A palavra-passe deve ter pelo menos 8 caracteres",
          code: "PASSWORD_TOO_SHORT"
        },
        { status: 400 }
      );
    }

    // Buscar o token no banco de dados
    const passwordReset = await prisma.passwordReset.findFirst({
      where: {
        token: token,
        usedAt: null,
      },
    });

    console.log("Token encontrado no banco:", passwordReset);

    // Verificar se o token existe
    if (!passwordReset) {
      console.log("Token não encontrado ou já usado");
      return NextResponse.json(
        { 
          message: "Token inválido ou já utilizado",
          code: "INVALID_TOKEN"
        },
        { status: 400 }
      );
    }

    // Verificar se o token expirou
    console.log("Token expira em:", passwordReset.expiresAt);
    console.log("Agora:", new Date());
    console.log("Token expirado?", passwordReset.expiresAt < new Date());

    if (passwordReset.expiresAt < new Date()) {
      return NextResponse.json(
        { 
          message: "Token expirado. Solicite um novo link de recuperação",
          code: "TOKEN_EXPIRED"
        },
        { status: 400 }
      );
    }

    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: passwordReset.email },
    });

    if (!user) {
      return NextResponse.json(
        { 
          message: "Usuário não encontrado",
          code: "USER_NOT_FOUND"
        },
        { status: 400 }
      );
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar a senha do usuário em uma transação
    await prisma.$transaction([
      // Atualizar senha
      prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
        },
      }),
      // Marcar token como usado
      prisma.passwordReset.update({
        where: { id: passwordReset.id },
        data: {
          usedAt: new Date(),
        },
      }),
      // Invalidar sessões existentes
      prisma.session.deleteMany({
        where: { userId: user.id },
      }),
      // Invalidar refresh tokens
      prisma.refreshToken.updateMany({
        where: { 
          userId: user.id,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      }),
    ]);

    console.log("Senha atualizada com sucesso para:", user.email);

    return NextResponse.json({
      success: true,
      message: "Palavra-passe alterada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao redefinir palavra-passe:", error);
    return NextResponse.json(
      { 
        message: "Erro ao redefinir palavra-passe",
        code: "INTERNAL_ERROR"
      },
      { status: 500 }
    );
  }
}