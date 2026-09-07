import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/server/middleware/admin";
import { Role } from "@prisma/client";

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json(
        { message: "Email e cargo são obrigatórios" },
        { status: 400 }
      );
    }

    const validRoles: Role[] = [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER];

    if (!validRoles.includes(role as Role)) {
      return NextResponse.json(
        { message: "Cargo inválido" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Utilizador não encontrado com este email" },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: role as Role },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Erro ao adicionar staff:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Erro ao adicionar staff" },
      { status: 500 }
    );
  }
}