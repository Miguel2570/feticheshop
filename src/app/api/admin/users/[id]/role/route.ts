// src/app/api/admin/users/[id]/role/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/server/middleware/admin";
import { Role } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    if (!role || !Object.values(Role).includes(role as Role)) {
      return NextResponse.json(
        { message: "Cargo inválido" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role: role as Role },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erro ao atualizar cargo:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Erro ao atualizar cargo" },
      { status: 500 }
    );
  }
}