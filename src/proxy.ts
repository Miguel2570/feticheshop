import { NextRequest, NextResponse } from "next/server";

const AGE_COOKIE = "age_verified";

const AGE_GATE_PATH = "/idade";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  /*
   * Rotas que não devem ser bloqueadas
   */

  // Página de confirmação de idade
  if (pathname === AGE_GATE_PATH) {
    return NextResponse.next();
  }

  // API responsável pela confirmação
  if (pathname === "/api/age-verification") {
    return NextResponse.next();
  }

  // Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.jpg" ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  /*
   * Ficheiros públicos
   */

  if (
    pathname.startsWith("/fonts")
  ) {
    return NextResponse.next();
  }

  /*
   * Verificar cookie
   */

  const ageVerified = request.cookies.get(
    AGE_COOKIE
  )?.value;

  if (ageVerified === "true") {
    return NextResponse.next();
  }

  /*
   * Utilizador ainda não confirmou os 18 anos.
   */

  const ageUrl = request.nextUrl.clone();

  ageUrl.pathname = AGE_GATE_PATH;

  ageUrl.search = "";

  const redirectTo = `${pathname}${search}`;

  ageUrl.searchParams.set(
    "redirect",
    redirectTo
  );

  return NextResponse.redirect(ageUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.jpg|favicon.ico|images).*)",
  ],
};