import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { orderNumber, email } = await request.json();

    if (!orderNumber || !email) {
      return NextResponse.json(
        { message: "Introduz o número da encomenda e o email." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: { contains: orderNumber, mode: "insensitive" },
        user: {
          email: { equals: email, mode: "insensitive" },
        },
      },
      include: {
        items: {
          select: {
            name: true,
            quantity: true,
          },
        },
        shipment: {
          select: {
            carrier: true,
            trackingNumber: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Encomenda não encontrada. Verifica o número e o email." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        createdAt: order.createdAt,
        total: Number(order.total),
        items: order.items,
        shipment: order.shipment,
      },
    });
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json(
      { message: "Erro ao procurar encomenda." },
      { status: 500 }
    );
  }
}