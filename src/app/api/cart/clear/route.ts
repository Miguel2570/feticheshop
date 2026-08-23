import { NextResponse } from "next/server";

import { requireAuth } from "@/server/middleware/auth";
import { cartService } from "@/server/services/cart.service";

export async function DELETE() {
  try {
    const user =
      await requireAuth();

    await cartService.clearCart(
      user.userId
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/cart/clear:",
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

    return NextResponse.json(
      {
        message:
          "Failed to clear cart",
      },
      {
        status: 500,
      }
    );
  }
}