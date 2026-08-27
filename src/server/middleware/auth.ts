import { verifyAccessToken } from "@/server/auth/jwt";
import { getAccessToken } from "@/server/auth/cookies";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function requireAuth() {
  // 1. Tentar JWT (email/senha)
  const token = await getAccessToken();

  if (token) {
    try {
      return verifyAccessToken(token);
    } catch {
      // Token inválido - continuar para Better Auth
    }
  }

  // 2. Tentar Better Auth (Google)
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user) {
      // Buscar utilizador na BD para obter o role
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          role: true,
        },
      });

      if (dbUser) {
        return {
          userId: dbUser.id,
          role: dbUser.role,
        };
      }

      // Fallback se não encontrar na BD
      return {
        userId: session.user.id,
        role: "CUSTOMER",
      };
    }
  } catch {
    // Sem sessão Better Auth
  }

  throw new Error("Unauthorized");
}