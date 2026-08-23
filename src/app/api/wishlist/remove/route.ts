import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/server/middleware/auth";
import { wishlistService } from "@/server/services/wishlist.service";

import { wishlistItemSchema } from "@/validations/wishlist";

export async function DELETE(
  request: NextRequest
) {
  try {
    const user = await requireAuth();

    const body = wishlistItemSchema.parse(
      await request.json()
    );

    const wishlist =
      await wishlistService.removeItem(
        user.userId,
        body.productId
      );

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      switch (error.message) {
        case "Unauthorized":
          return NextResponse.json(
            { message: error.message },
            { status: 401 }
          );

        case "Wishlist not found":
        case "Item not found":
          return NextResponse.json(
            { message: error.message },
            { status: 404 }
          );
      }
    }

    return NextResponse.json(
      { message: "Failed to remove product" },
      { status: 500 }
    );
  }
}