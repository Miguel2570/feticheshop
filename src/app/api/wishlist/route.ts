import { NextResponse } from "next/server";

import { requireAuth } from "@/server/middleware/auth";
import { wishlistService } from "@/server/services/wishlist.service";

export async function GET() {
  try {
    const user = await requireAuth();

    const wishlist = await wishlistService.getWishlist(
      user.userId
    );

    return NextResponse.json(wishlist);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Unauthorized"
    ) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Wishlist API error:", error);

    return NextResponse.json(
      { message: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}