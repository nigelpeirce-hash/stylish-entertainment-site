import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "stylishentertainment.co.uk";

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // Hard bypass: already on correct domain — do nothing
  if (hostname === CANONICAL_HOST) {
    return NextResponse.next();
  }

  // Exact www catch: redirect to non-www (trailing slash left to next.config.js)
  if (hostname.startsWith("www.")) {
    const pathname = request.nextUrl.pathname;
    const search = request.nextUrl.search;
    const url = `https://${CANONICAL_HOST}${pathname}${search}`;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico).*)"],
};
