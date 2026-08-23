import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";

import { requireAdmin } from "@/server/middleware/admin";
import { orderService } from "@/server/services/order.service";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;

    const page = Number(
      searchParams.get("page") ?? "1"
    );

    const limit = Number(
      searchParams.get("limit") ?? "20"
    );

    const userId =
      searchParams.get("userId") ?? undefined;

    const statusParam =
      searchParams.get("status");

    const status =
      statusParam &&
      Object.values(OrderStatus).includes(
        statusParam as OrderStatus
      )
        ? (statusParam as OrderStatus)
        : undefined;

    const orders =
      await orderService.getOrders({
        page,
        limit,
        userId,
        status,
      });

    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "Unauthorized"
    ) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "Forbidden"
    ) {
      return NextResponse.json(
        { message: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to fetch orders",
      },
      {
        status: 500,
      }
    );
  }
}