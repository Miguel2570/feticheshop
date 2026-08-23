import { NextRequest, NextResponse } from "next/server";

import { refreshTokenService } from "@/server/services/refresh-token.service";

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    const result = await refreshTokenService.refresh(
      refreshToken
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Invalid refresh token",
      },
      {
        status: 401,
      }
    );
  }
}