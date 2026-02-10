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

const CANONICAL_HOST = "stylishentertainment.co.uk";
const LEGACY_QUERY_PARAMS = ["attachment_id", "wordfence_lh", "hid", "wc-ajax"];
const SEARCH_PARAM = "s";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // Production-only: HTTPS and www → non-www (canonical). Avoid circular redirects.
  if (process.env.NODE_ENV === "production" && !hostname.includes("localhost") && !hostname.includes("127.0.0.1")) {
    // Force HTTPS (only redirect if not already https)
    if (request.headers.get("x-forwarded-proto") !== "https") {
      url.protocol = "https:";
      return NextResponse.redirect(url, 301);
    }
    // Only redirect when host specifically starts with www (prevents accidental redirects)
    if (hostname.startsWith("www.")) {
      url.host = CANONICAL_HOST;
      url.protocol = "https:";
      // Preserve trailing slash so Next.js (trailingSlash: true) doesn't trigger a second redirect
      if (pathname !== "/" && !pathname.endsWith("/")) {
        url.pathname = pathname + "/";
      }
      return NextResponse.redirect(url, 301);
    }
  }

  // Strip legacy/plugin query params and redirect to same path (GSC: discovered/crawled-not-indexed)
  const searchParams = url.searchParams;
  let hasLegacyParam = false;
  if (searchParams.has(SEARCH_PARAM)) {
    // WordPress search ?s=... → /about/blog/
    url.pathname = "/about/blog/";
    url.search = "";
    return NextResponse.redirect(url, 301);
  }
  for (const param of LEGACY_QUERY_PARAMS) {
    if (searchParams.has(param)) {
      searchParams.delete(param);
      hasLegacyParam = true;
    }
  }
  if (hasLegacyParam) {
    url.search = searchParams.toString();
    return NextResponse.redirect(url, 301);
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

// Exclude static files and Next internals to prevent redirect loops (images, favicon, _next/static)
export const config = {
  matcher: [
    "/client/:path*",
    "/admin/:path*",
    "/",
    "/((?!_next/static|_next/image|api|favicon\\.ico|.*\\.(ico|svg|png|jpe?g|gif|webp|css|js)$).*)",
  ],
};
