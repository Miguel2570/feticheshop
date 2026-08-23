import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Prisma } from "@prisma/client";

import { requireAdmin } from "@/server/middleware/admin";
import { couponService } from "@/server/services/coupon.service";

import { createCouponSchema } from "@/validations/coupon";

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

    const code =
      searchParams.get("code") ??
      undefined;

    const isActiveParam =
      searchParams.get("isActive");

    const coupons =
      await couponService.getCoupons({
        page,
        limit,
        code,
        isActive:
          isActiveParam === null
            ? undefined
            : isActiveParam === "true",
      });

    return NextResponse.json(coupons);
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
          "Failed to fetch coupons",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    await requireAdmin();

    const body =
      createCouponSchema.parse(
        await request.json()
      );

    const coupon =
      await couponService.createCoupon({
        code: body.code,
        name: body.name,
        description:
          body.description,

        discountValue:
          new Prisma.Decimal(
            body.discountValue
          ),

        isPercentage:
          body.isPercentage,

        maximumDiscount:
          body.maximumDiscount !==
          undefined
            ? new Prisma.Decimal(
                body.maximumDiscount
              )
            : undefined,

        minimumAmount:
          body.minimumAmount !==
          undefined
            ? new Prisma.Decimal(
                body.minimumAmount
              )
            : undefined,

        usageLimit:
          body.usageLimit,

        usagePerUser:
          body.usagePerUser,

        startsAt:
          body.startsAt,

        endsAt:
          body.endsAt,

        isActive:
          body.isActive,
      });

    return NextResponse.json(
      coupon,
      {
        status: 201,
      }
    );
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

    if (
      error instanceof Error &&
      error.message ===
        "Coupon code already exists"
    ) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        message:
          "Failed to create coupon",
      },
      {
        status: 500,
      }
    );
  }
}