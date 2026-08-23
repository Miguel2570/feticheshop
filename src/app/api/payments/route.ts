import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";

import { requireAdmin } from "@/server/middleware/admin";
import { paymentService } from "@/server/services/payment.service";

export async function GET(
  request: NextRequest
) {
  try {
    await requireAdmin();

    const searchParams =
      request.nextUrl.searchParams;

    const page = Number(
      searchParams.get("page") ?? "1"
    );

    const limit = Number(
      searchParams.get("limit") ?? "20"
    );

    const orderId =
      searchParams.get("orderId") ??
      undefined;

    const status =
      searchParams.get("status") ??
      undefined;

    const method =
      searchParams.get("method") ??
      undefined;

    const payments =
      await paymentService.getPayments({
        page,
        limit,
        orderId,

        status: status
          ? (status as PaymentStatus)
          : undefined,

        method: method
          ? (method as PaymentMethod)
          : undefined,
      });

    return NextResponse.json(payments);
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "Unauthorized"
    ) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 401,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message === "Forbidden"
    ) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        message:
          "Failed to fetch payments",
      },
      {
        status: 500,
      }
    );
  }
}