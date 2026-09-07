// src/server/auth/cookies.ts

import { NextResponse } from "next/server";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

const isProduction = process.env.NODE_ENV === "production";

// Para usar em route handlers
export function setAuthCookiesOnResponse(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  response.cookies.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  response.cookies.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

// Para ler cookies (funciona em qualquer lugar)
export async function getAccessToken() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE)?.value;
}

export async function getRefreshToken() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE)?.value;
}

export async function clearAuthCookies() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}