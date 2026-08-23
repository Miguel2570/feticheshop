import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/server/middleware/auth";
import { wishlistService } from "@/server/services/wishlist.service";

import { wishlistItemSchema } from "@/validations/wishlist";

export async function POST(
  request: NextRequest
) {
  try {
    const user = await requireAuth();

    const body = wishlistItemSchema.parse(
      await request.json()
    );

    const wishlist =
      await wishlistService.addItem(
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

        case "Product not found":
          return NextResponse.json(
            { message: error.message },
            { status: 404 }
          );
      }
    }

    return NextResponse.json(
      { message: "Failed to add product" },
      { status: 500 }
    );
  }
}