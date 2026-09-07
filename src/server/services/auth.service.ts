// src/server/services/auth.service.ts

import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/server/services/email.service";
import { emailVerificationService } from "@/server/services/email-verification.service";
import { auth } from "@/lib/auth";

export class AuthService {
  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const email = data.email.trim().toLowerCase();

    // Verificar se o email já existe
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    console.log("📝 Registando novo usuário:", email);

    // Usar Better Auth para criar o usuário
    // O Better Auth guarda a senha na tabela Account automaticamente
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
      },
    });

    console.log("✅ Usuário criado com Better Auth:", email);

    // Atualizar dados adicionais no usuário
    await prisma.user.update({
      where: { email },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        role: Role.CUSTOMER,
        emailVerified: false,
        emailVerifiedAt: null,
      },
    });

    console.log("✅ Dados atualizados:", email);

    // Enviar email de verificação
    try {
      await emailVerificationService.createAndSend(email);
      console.log("📧 Email de verificação enviado para:", email);
    } catch (error) {
      console.error("Erro ao enviar email de verificação:", error);
      // Não bloquear o registo se o email falhar
    }

    // Enviar email de boas-vindas
    try {
      await emailService.sendWelcomeEmail({
        email,
        firstName: data.firstName || "Utilizador",
      });
      console.log("📧 Email de boas-vindas enviado para:", email);
    } catch (error) {
      console.error("Erro ao enviar email de boas-vindas:", error);
      // Não bloquear o registo se o email falhar
    }

    return { user: result.user };
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    console.log("📝 Login:", normalizedEmail);

    // Usar Better Auth para login
    const result = await auth.api.signInEmail({
      body: {
        email: normalizedEmail,
        password,
      },
    });

    console.log("✅ Login bem sucedido:", result.user?.email);

    return result;
  }

  async logout() {
    // Usar Better Auth para logout
    const result = await auth.api.signOut();
    return result;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    // Verificar senha atual
    const account = await prisma.account.findFirst({
      where: {
        userId,
        providerId: "credential",
      },
    });

    if (!account || !account.password) {
      throw new Error("ACCOUNT_NO_PASSWORD");
    }

    // Verificar senha atual com Better Auth
    const isValid = await auth.api.signInEmail({
      body: {
        email: user.email,
        password: currentPassword,
      },
    });

    if (!isValid) {
      throw new Error("INVALID_PASSWORD");
    }

    // Atualizar senha
    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
      },
    });

    return { success: true };
  }
}

export const authService = new AuthService();