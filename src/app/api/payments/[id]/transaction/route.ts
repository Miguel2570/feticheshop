import {
  NextRequest,
  NextResponse,
} from "next/server";

import { requireAdmin } from "@/server/middleware/admin";
import { paymentService } from "@/server/services/payment.service";

import { updateTransactionSchema } from "@/validations/payment";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const body =
      updateTransactionSchema.parse(
        await request.json()
      );

    const payment =
      await paymentService.setTransaction(
        id,
        body.transactionId,
        body.gateway,
        body.gatewayResponse
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
          "Failed to update transaction",
      },
      {
        status: 500,
      }
    );
  }
}