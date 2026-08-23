import {
  NextRequest,
  NextResponse,
} from "next/server";

import { requireAuth } from "@/server/middleware/auth";
import { cartService } from "@/server/services/cart.service";

import { removeCartItemSchema } from "@/validations/cart";

export async function DELETE(
  request: NextRequest
) {
  try {
    const user =
      await requireAuth();

    const body =
      removeCartItemSchema.parse(
        await request.json()
      );

    await cartService.removeItem(
      user.userId,
      body.itemId
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/cart/remove:",
      error
    );

    if (
      error instanceof Error &&
      error.message ===
        "Unauthorized"
    ) {
      return NextResponse.json(
        {
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "Item not found"
    ) {
      return NextResponse.json(
        {
          message:
            "Item not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message:
          "Failed to remove item",
      },
      {
        status: 500,
      }
    );
  }
}