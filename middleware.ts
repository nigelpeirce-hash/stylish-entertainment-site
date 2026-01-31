import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Create NextResponse.next() with x-pathname on the forwarded request so layout can read it. */
function nextWithPathname(pathname: string, request: NextRequest): NextResponse {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

/** Check for session cookie presence (Edge-safe; no JWT decode). Real auth happens in pages/APIs. */
function hasSessionCookie(request: NextRequest): boolean {
  const cookie = request.cookies.get("authjs.session-token") ?? request.cookies.get("__Secure-authjs.session-token");
  return !!cookie?.value;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Force HTTPS redirect in production
  if (process.env.NODE_ENV === "production") {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get("host") || "";
    if (
      request.headers.get("x-forwarded-proto") !== "https" &&
      !hostname.includes("localhost") &&
      !hostname.includes("127.0.0.1")
    ) {
      url.protocol = "https:";
      return NextResponse.redirect(url, 301);
    }
  }

  // Protect /client routes (no getToken – Edge-safe cookie check)
  if (pathname.startsWith("/client")) {
    const magicToken = request.nextUrl.searchParams.get("token");
    if (/^\/client\/bookings\/[^/]+$/.test(pathname) && magicToken) {
      return nextWithPathname(pathname, request);
    }
    if (!hasSessionCookie(request)) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(url, 302);
    }
  }

  return nextWithPathname(pathname, request);
}

export const config = {
  matcher: [
    "/client/:path*",
    "/admin/:path*",
    "/",
    "/((?!_next/static|_next/image|api|favicon\\.ico).*)",
  ],
};
