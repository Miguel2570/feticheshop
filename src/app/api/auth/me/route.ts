// src/app/api/auth/me/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Não autenticado" },
        { status: 401 }
      );
    }

    // Buscar moradas do usuário
    const addresses = await prisma.userAddress.findMany({
      where: { userId: user.id },
      orderBy: { isDefault: "desc" },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        addresses: addresses,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return NextResponse.json(
      { success: false, message: "Erro" },
      { status: 500 }
    );
  }
}