import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Prisma } from "@prisma/client";

import { couponService } from "@/server/services/coupon.service";

import { validateCouponSchema } from "@/validations/coupon";

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      validateCouponSchema.parse(
        await request.json()
      );

    const coupon =
      await couponService.validateCoupon(
        body.code
      );

    const subtotal = new Prisma.Decimal(
      body.subtotal ?? 0
    );

    let discount =
      new Prisma.Decimal(0);

    if (
      coupon.minimumAmount &&
      subtotal.lessThan(
        coupon.minimumAmount
      )
    ) {
      return NextResponse.json(
        {
          valid: false,
          message:
            "Minimum order amount not reached",
        },
        {
          status: 400,
        }
      );
    }

    if (coupon.isPercentage) {
      discount = subtotal.mul(
        coupon.discountValue.div(100)
      );

      if (
        coupon.maximumDiscount &&
        discount.greaterThan(
          coupon.maximumDiscount
        )
      ) {
        discount =
          coupon.maximumDiscount;
      }
    } else {
      discount =
        coupon.discountValue;

      if (
        discount.greaterThan(
          subtotal
        )
      ) {
        discount = subtotal;
      }
    }

    return NextResponse.json({
      valid: true,

      coupon,

      discount,

      total: subtotal.minus(
        discount
      ),
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          valid: false,
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        valid: false,
        message:
          "Failed to validate coupon",
      },
      {
        status: 500,
      }
    );
  }
}