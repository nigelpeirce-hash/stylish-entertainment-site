import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

function withPathnameHeader(response: NextResponse, pathname: string): NextResponse {
  response.headers.set("x-pathname", pathname);
  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Force HTTPS redirect in production
  if (process.env.NODE_ENV === "production") {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get("host") || "";
    
    // Check if request is HTTP and should be HTTPS
    if (
      request.headers.get("x-forwarded-proto") !== "https" &&
      !hostname.includes("localhost") &&
      !hostname.includes("127.0.0.1")
    ) {
      url.protocol = "https:";
      return withPathnameHeader(NextResponse.redirect(url, 301), pathname);
    }
  }

  // Check if the route is protected
  if (pathname.startsWith("/client")) {
    const pathname = request.nextUrl.pathname;
    const magicToken = request.nextUrl.searchParams.get("token");

    // Tokenized magic link: /client/bookings/[id]?token=... grants immediate access (no login)
    if (/^\/client\/bookings\/[^/]+$/.test(pathname) && magicToken) {
      return withPathnameHeader(NextResponse.next(), pathname);
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Allow admins to access client pages for preview/testing
    if (token && (token as any).role === "admin") {
      return withPathnameHeader(NextResponse.next(), pathname);
    }

    // If no token, redirect to login
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return withPathnameHeader(NextResponse.redirect(url), pathname);
    }
  }

  return withPathnameHeader(NextResponse.next(), pathname);
}

export const config = {
  matcher: [
    "/client/:path*",
    "/admin/:path*",
    "/",
    "/((?!_next/static|_next/image|api|favicon\\.ico).*)",
  ],
};
