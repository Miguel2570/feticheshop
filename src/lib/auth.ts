import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { emailService } from "@/server/services/email.service";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  user: {
    modelName: "User",
    fields: {
      name: "name",
      email: "email",
      image: "avatarUrl",
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            const userData = user as {
              id: string;
              name?: string;
              email?: string;
            };

            const name = userData.name || "Utilizador";
            const nameParts = name.split(" ");
            const firstName = nameParts[0] || "Utilizador";
            const lastName = nameParts.slice(1).join(" ") || "";

            await prisma.user.update({
              where: { id: userData.id },
              data: {
                firstName,
                lastName,
                emailVerifiedAt: new Date(),
              },
            });

            // Enviar email de boas-vindas
            if (userData.email) {
              try {
                await emailService.sendWelcomeEmail({
                  email: userData.email,
                  firstName,
                });

                console.log(`📧 Email de boas-vindas enviado para ${userData.email}`);
              } catch (emailError) {
                console.error("Erro ao enviar email de boas-vindas:", emailError);
              }
            }

            console.log(`✅ Utilizador atualizado: ${firstName} ${lastName}`);
          } catch (error) {
            console.error("Erro ao atualizar utilizador:", error);
          }
        },
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24,
    updateAge: 60 * 60,
  },

  trustedOrigins: [
    "https://feticheshop-opal.vercel.app",
    "http://localhost:3000",
  ],
});

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    return user;
  } catch (error) {
    console.error("Erro ao obter sessão:", error);
    return null;
  }
}