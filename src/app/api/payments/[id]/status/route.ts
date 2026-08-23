import {
  NextRequest,
  NextResponse,
} from "next/server";

import { PaymentStatus } from "@prisma/client";

import { requireAdmin } from "@/server/middleware/admin";
import { paymentService } from "@/server/services/payment.service";

import { updatePaymentStatusSchema } from "@/validations/payment";

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
      updatePaymentStatusSchema.parse(
        await request.json()
      );

    const payment =
      await paymentService.updateStatus(
        id,
        body.status as PaymentStatus
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
          "Failed to update payment status",
      },
      {
        status: 500,
      }
    );
  }
}