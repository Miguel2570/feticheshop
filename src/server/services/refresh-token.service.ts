import { User } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/server/auth/jwt";

import { refreshTokenRepository } from "@/server/repositories/refresh-token.repository";

export class RefreshTokenService {
  async refresh(token: string) {
    const payload = verifyRefreshToken(token);

    const storedToken = await refreshTokenRepository.find(token);

    if (!storedToken) {
      throw new Error("Invalid refresh token");
    }

    if (storedToken.revokedAt) {
      throw new Error("Refresh token revoked");
    }

    if (storedToken.expiresAt < new Date()) {
      throw new Error("Refresh token expired");
    }

    await refreshTokenRepository.delete(token);

    const user = storedToken.user;

    return this.generateTokens(user);
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

export const refreshTokenService =
  new RefreshTokenService();