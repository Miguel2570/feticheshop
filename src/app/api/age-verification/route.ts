import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const AGE_COOKIE = "age_verified";

const ONE_YEAR =
  60 * 60 * 24 * 365;

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.set(
      AGE_COOKIE,
      "true",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        path: "/",
        maxAge: ONE_YEAR,
      }
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "POST /api/age-verification:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Não foi possível confirmar a idade.",
      },
      {
        status: 500,
      }
    );
  }
}