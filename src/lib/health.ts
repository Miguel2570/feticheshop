import { prisma } from "@/lib/prisma";

export async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      ok: true,
      database: true,
    };
  } catch (error) {
    console.error("Database health check failed:", error);

    return {
      ok: false,
      database: false,
    };
  }
}