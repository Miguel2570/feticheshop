import {
  NextRequest,
  NextResponse,
} from "next/server";

import { requireAuth } from "@/server/middleware/auth";
import { cartService } from "@/server/services/cart.service";

import { addToCartSchema } from "@/validations/cart";

export async function POST(
  request: NextRequest
) {
  try {
    const user =
      await requireAuth();

    const body =
      addToCartSchema.parse(
        await request.json()
      );

    const cart =
      await cartService.addItem(
        user.userId,
        body.productId,
        body.quantity,
        body.variantId
      );

    return NextResponse.json(
      cart
    );
  } catch (error) {
    console.error(
      "POST /api/cart/add:",
      error
    );

    if (error instanceof Error) {
      switch (error.message) {
        case "Unauthorized":
          return NextResponse.json(
            {
              message:
                "Unauthorized",
            },
            {
              status: 401,
            }
          );

        case "Product not found":
        case "Variant not found":
        case "Product unavailable":
        case "Variant unavailable":
          return NextResponse.json(
            {
              message:
                error.message,
            },
            {
              status: 404,
            }
          );

        case "Insufficient stock":
          return NextResponse.json(
            {
              message:
                error.message,
            },
            {
              status: 409,
            }
          );
      }
    }

    return NextResponse.json(
      {
        message:
          "Failed to add product",
      },
      {
        status: 500,
      }
    );
  }
}