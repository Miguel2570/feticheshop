import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Prisma } from "@prisma/client";

import { requireAdmin } from "@/server/middleware/admin";
import { couponService } from "@/server/services/coupon.service";

import { updateCouponSchema } from "@/validations/coupon";

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

    const coupon =
      await couponService.getCouponById(id);

    return NextResponse.json(coupon);
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

      if (
        error.message ===
        "Coupon not found"
      ) {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        message:
          "Failed to fetch coupon",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const body =
      updateCouponSchema.parse(
        await request.json()
      );

    const coupon =
      await couponService.updateCoupon(id, {
        ...(body.code && {
            code: body.code,
        }),

        ...(body.name && {
            name: body.name,
        }),

        ...(body.description !== undefined && {
            description: body.description,
        }),

        ...(body.discountValue !== undefined && {
            discountValue: new Prisma.Decimal(
            body.discountValue
            ),
        }),

        ...(body.isPercentage !== undefined && {
            isPercentage: body.isPercentage,
        }),

        ...(body.minimumAmount !== undefined && {
            minimumAmount:
            body.minimumAmount === null
                ? null
                : new Prisma.Decimal(
                    body.minimumAmount
                ),
        }),

        ...(body.maximumDiscount !== undefined && {
            maximumDiscount:
            body.maximumDiscount === null
                ? null
                : new Prisma.Decimal(
                    body.maximumDiscount
                ),
        }),

        ...(body.usageLimit !== undefined && {
            usageLimit: body.usageLimit,
        }),

        ...(body.usagePerUser !== undefined && {
            usagePerUser: body.usagePerUser,
        }),

        ...(body.startsAt !== undefined && {
            startsAt: body.startsAt,
        }),

        ...(body.endsAt !== undefined && {
            endsAt: body.endsAt,
        }),

        ...(body.isActive !== undefined && {
            isActive: body.isActive,
        }),
    });

    return NextResponse.json(coupon);
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

      if (
        error.message ===
        "Coupon not found"
      ) {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }

      if (
        error.message ===
        "Coupon code already exists"
      ) {
        return NextResponse.json(
          { message: error.message },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        message:
          "Failed to update coupon",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    await requireAdmin();

    const { id } = await params;

    await couponService.deleteCoupon(
      id
    );

    return NextResponse.json({
      success: true,
    });
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

      if (
        error.message ===
        "Coupon not found"
      ) {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        message:
          "Failed to delete coupon",
      },
      {
        status: 500,
      }
    );
  }
}