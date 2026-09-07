// src/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    console.log("📝 Tentativa de login:", email);

    const result = await auth.api.signInEmail({
      body: { email, password },
      headers: request.headers,
    });

    console.log("✅ Login bem sucedido:", result.user?.email);

    // Criar resposta e copiar cookies
    const response = NextResponse.json({
      success: true,
      user: result.user,
    });

    return response;
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { success: false, message: "Email ou palavra-passe incorretos." },
      { status: 401 }
    );
  }
}