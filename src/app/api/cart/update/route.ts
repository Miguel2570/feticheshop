import {
  NextRequest,
  NextResponse,
} from "next/server";

import { requireAuth } from "@/server/middleware/auth";
import { cartService } from "@/server/services/cart.service";

import { updateCartItemSchema } from "@/validations/cart";

export async function PATCH(
  request: NextRequest
) {
  try {
    const user =
      await requireAuth();

    const body =
      updateCartItemSchema.parse(
        await request.json()
      );

    const cart =
      await cartService.updateItem(
        user.userId,
        body.itemId,
        body.quantity
      );

    return NextResponse.json(
      cart
    );
  } catch (error) {
    console.error(
      "PATCH /api/cart/update:",
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

        case "Item not found":
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
          "Failed to update cart",
      },
      {
        status: 500,
      }
    );
  }
}