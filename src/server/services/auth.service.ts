import { Role, User } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import {
  hashPassword,
  verifyPassword,
} from "@/server/auth/password";

import {
  generateAccessToken,
  generateRefreshToken,
} from "@/server/auth/jwt";

export class AuthService {
  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const exists = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (exists) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        role: Role.CUSTOMER,
        emailVerified: true,        // ← Email verificado automaticamente
        emailVerifiedAt: new Date(), // ← Data de verificação
      },
    });

    return await this.generateTokens(user);
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    if (!user.password) {
      throw new Error("ACCOUNT_NO_PASSWORD");
    }

    const valid = await verifyPassword(
      password,
      user.password
    );

    if (!valid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Remove a verificação de email - já está verificado no registo
    // if (!user.emailVerified) {
    //   throw new Error("EMAIL_NOT_VERIFIED");
    // }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });

    return await this.generateTokens({
      ...user,
      lastLoginAt: new Date(),
    });
  }

  private async generateTokens(user: User) {
    const payload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ),
      },
    });

    const { password, ...safeUser } = user;

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }
}

export const authService = new AuthService();