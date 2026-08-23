import {
  NextRequest,
  NextResponse,
} from "next/server";

import { requireAdmin } from "@/server/middleware/admin";
import { paymentService } from "@/server/services/payment.service";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const payment =
      await paymentService.getPaymentById(
        id
      );

    return NextResponse.json(payment);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          {
            message: error.message,
          },
          {
            status: 401,
          }
        );
      }

      if (error.message === "Forbidden") {
        return NextResponse.json(
          {
            message: error.message,
          },
          {
            status: 403,
          }
        );
      }

      if (
        error.message ===
        "Payment not found"
      ) {
        return NextResponse.json(
          {
            message: error.message,
          },
          {
            status: 404,
          }
        );
      }
    }

    return NextResponse.json(
      {
        message:
          "Failed to fetch payment",
      },
      {
        status: 500,
      }
    );
  }
}