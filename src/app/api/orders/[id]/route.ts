import { NextResponse } from "next/server";

import { requireAdmin } from "@/server/middleware/admin";
import { orderService } from "@/server/services/order.service";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const order =
      await orderService.getOrderById(id);

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { message: error.message },
          { status: 401 }
        );
      }

      if (error.message === "Forbidden") {
        return NextResponse.json(
          { message: error.message },
          { status: 403 }
        );
      }

      if (error.message === "Order not found") {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Failed to fetch order",
      },
      {
        status: 500,
      }
    );
  }
}