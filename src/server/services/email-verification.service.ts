import crypto from "crypto";

import { prisma } from "@/lib/prisma";

import { emailService } from "./email.service";

const VERIFICATION_EXPIRATION_MINUTES = 15;

function generateVerificationCode(): string {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
}

export class EmailVerificationService {
  async createAndSend(
    email: string
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      throw new Error(
        "USER_NOT_FOUND"
      );
    }

    if (user.emailVerifiedAt) {
      throw new Error(
        "EMAIL_ALREADY_VERIFIED"
      );
    }

    await prisma.verificationToken.deleteMany(
      {
        where: {
          email,
          usedAt: null,
        },
      }
    );

    const token =
      generateVerificationCode();

    const expiresAt = new Date(
      Date.now() +
        VERIFICATION_EXPIRATION_MINUTES *
          60 *
          1000
    );

    await prisma.verificationToken.create(
      {
        data: {
          email,
          token,
          expiresAt,
        },
      }
    );

    await emailService.sendVerificationEmail(
      {
        email: user.email,
        firstName: user.firstName ?? "Utilizador", // ← Corrige null
        code: token,
      }
    );
  }

  async verify(
    email: string,
    code: string
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      throw new Error(
        "INVALID_VERIFICATION"
      );
    }

    if (user.emailVerifiedAt) {
      return user;
    }

    const verification =
      await prisma.verificationToken.findFirst(
        {
          where: {
            email,
            token: code,
            usedAt: null,
          },
          orderBy: {
            createdAt: "desc",
          },
        }
      );

    if (!verification) {
      throw new Error(
        "INVALID_VERIFICATION"
      );
    }

    if (
      verification.expiresAt <
      new Date()
    ) {
      throw new Error(
        "VERIFICATION_EXPIRED"
      );
    }

    const updatedUser =
      await prisma.$transaction(
        async (tx) => {
          const updated =
            await tx.user.update({
              where: {
                id: user.id,
              },
              data: {
                emailVerifiedAt:
                  new Date(),
              },
            });

          await tx.verificationToken.update(
            {
              where: {
                id: verification.id,
              },
              data: {
                usedAt: new Date(),
              },
            }
          );

          return updated;
        }
      );

    await emailService.sendWelcomeEmail({
      email: updatedUser.email,
      firstName: updatedUser.firstName ?? "Utilizador", // ← Corrige null
    });

    return updatedUser;
  }
}

export const emailVerificationService =
  new EmailVerificationService();