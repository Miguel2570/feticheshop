import { NextResponse } from "next/server";
import { requireAuth } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireAuth();

    const addresses = await prisma.userAddress.findMany({
      where: { userId: user.userId },
      orderBy: { isDefault: "desc" },
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const address = await prisma.userAddress.create({
      data: {
        userId: user.userId,
        type: body.type || "SHIPPING",
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        email: body.email || null,
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2 || null,
        postalCode: body.postalCode,
        city: body.city,
        district: body.district || null,
        country: body.country || "Portugal",
        vatNumber: body.vatNumber || null,
        isDefault: body.isDefault || false,
      },
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar morada" }, { status: 500 });
  }
}