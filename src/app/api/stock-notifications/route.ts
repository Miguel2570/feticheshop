// app/api/stock-notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const schema = z.object({
  productId: z.string().min(1, "Produto obrigatório"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Precisas de fazer login para seres avisado" },
        { status: 401 }
      );
    }

    const email = session.user.email.toLowerCase().trim();
    const body = await request.json();
    const { productId } = schema.parse(body);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, stock: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Produto não encontrado" },
        { status: 404 }
      );
    }

    if (product.stock > 0) {
      return NextResponse.json(
        { message: "Este produto já está disponível" },
        { status: 400 }
      );
    }

    await prisma.stockNotification.upsert({
      where: {
        email_productId: { email, productId },
      },
      update: {},
      create: { email, productId },
    });

    return NextResponse.json({
      message: "Vamos avisar-te quando estiver disponível!",
    });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Erro ao registar. Tenta novamente." },
      { status: 500 }
    );
  }
}