import {
  NextRequest,
  NextResponse,
} from "next/server";

import { requireAdmin } from "@/server/middleware/admin";
import { couponService } from "@/server/services/coupon.service";

import { updateCouponStatusSchema } from "@/validations/coupon";

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
      updateCouponStatusSchema.parse(
        await request.json()
      );

    const coupon =
      await couponService.updateStatus(
        id,
        body.isActive
      );

    return NextResponse.json(coupon);
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
        "Coupon not found"
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
          "Failed to update coupon status",
      },
      {
        status: 500,
      }
    );
  }
}