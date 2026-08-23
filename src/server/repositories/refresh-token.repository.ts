import { prisma } from "@/lib/prisma";

export class RefreshTokenRepository {
  async create(
    userId: string,
    token: string,
    expiresAt: Date
  ) {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async find(token: string) {
    return prisma.refreshToken.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });
  }

  async revoke(token: string) {
    return prisma.refreshToken.update({
        where: {
        token,
        },
        data: {
        revokedAt: new Date(),
        },
    });
  }

  async delete(token: string) {
    return prisma.refreshToken.delete({
      where: {
        token,
      },
    });
  }

  async deleteAllByUser(userId: string) {
    return prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }
}

export const refreshTokenRepository =
  new RefreshTokenRepository();