import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
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
      return NextResponse.redirect(url, 301);
    }
  }

  // Check if the route is protected
  if (request.nextUrl.pathname.startsWith("/client")) {
    const pathname = request.nextUrl.pathname;
    const magicToken = request.nextUrl.searchParams.get("token");

    // Tokenized magic link: /client/bookings/[id]?token=... grants immediate access (no login)
    if (/^\/client\/bookings\/[^/]+$/.test(pathname) && magicToken) {
      return NextResponse.next();
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Allow admins to access client pages for preview/testing
    if (token && (token as any).role === "admin") {
      // Admins can always access client pages to preview the client experience
      return NextResponse.next();
    }

    // If no token, redirect to login (but allow admins above)
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/client/:path*",
  ],
};
