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

  // ✅ Next internals + ficheiros públicos (imagens, favicons, etc.)
  if (
    pathname.startsWith("/_next") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".webp") ||
    pathname.startsWith("/images") ||
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
    // Apenas bloqueia a raiz e todas as páginas, ignorando a API e os arquivos estáticos internos do Next
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};