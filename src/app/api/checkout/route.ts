import {
  NextRequest,
  NextResponse,
} from "next/server";

import { requireAuth } from "@/server/middleware/auth";
import { checkoutService } from "@/server/services/checkout.service";

import { checkoutSchema } from "@/validations/checkout";

export async function POST(
  request: NextRequest
) {
  try {
    const user =
      await requireAuth();

    const body =
      checkoutSchema.parse(
        await request.json()
      );

    const order =
        await checkoutService.checkout(
            user.userId,
            body
    );

    return NextResponse.json(order);
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
      error.message === "Cart not found"
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

    if (
      error instanceof Error &&
      error.message === "Cart is empty"
    ) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Checkout failed",
      },
      {
        status: 500,
      }
    );
  }
}