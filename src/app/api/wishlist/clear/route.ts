import { NextResponse } from "next/server";

import { requireAuth } from "@/server/middleware/auth";
import { wishlistService } from "@/server/services/wishlist.service";

export async function DELETE() {
  try {
    const user = await requireAuth();

    await wishlistService.clear(user.userId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "Unauthorized"
    ) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Failed to clear wishlist" },
      { status: 500 }
    );
  }
}