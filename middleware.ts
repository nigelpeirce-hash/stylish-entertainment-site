// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/** Legacy WP domain → canonical site (must run before trailingSlash normalization). */
const LEGACY_DOMAIN = /^(www\.)?stylishweddingdisco\.co\.uk$/i
const CANONICAL_ORIGIN = 'https://www.stylishentertainment.co.uk'

function legacyDomainRedirect(request: NextRequest): NextResponse | null {
  const host = (request.headers.get('host') || '').split(':')[0]
  if (!LEGACY_DOMAIN.test(host)) return null
  const { pathname, search } = request.nextUrl
  return NextResponse.redirect(`${CANONICAL_ORIGIN}${pathname}${search}`, 308)
}

/**
 * Client-area paths that are intentionally public:
 *
 * /client/deposit-paid-thank-you  — landing page after clicking "I've paid" in a
 *   deposit invoice email. Reached via a redirect from the signed deposit-paid API
 *   route. No session required; the page only shows a static confirmation message.
 *
 * /client/account-deleted  — post-deletion landing page. The user's session has
 *   already been invalidated (signOut is called on mount). Must be reachable without
 *   a session or the redirect loop would be infinite.
 */
const PUBLIC_CLIENT_PATHS = [
  '/client/deposit-paid-thank-you',
  '/client/account-deleted',
]

function isPublicClientPath(pathname: string): boolean {
  return PUBLIC_CLIENT_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )
}

export async function middleware(request: NextRequest) {
  const legacyRedirect = legacyDomainRedirect(request)
  if (legacyRedirect) return legacyRedirect

  // Allow all localhost traffic through — matches the dev bypass in requireAdmin().
  const host = request.headers.get('host') || ''
  const isLocalhost =
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.startsWith('192.168.') ||
    host.startsWith('10.')
  if (isLocalhost) return NextResponse.next()

  const { pathname, searchParams } = request.nextUrl

  // Auth middleware only applies to admin/client routes.
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/client')) {
    return NextResponse.next()
  }

  // --- Client area: early exits before JWT decode ---
  if (pathname.startsWith('/client')) {
    // Public pages — no auth ever required
    if (isPublicClientPath(pathname)) return NextResponse.next()

    // Portal magic link — ?token= is present. The page component validates the
    // token against the DB and will show an "invalid link" error if it fails.
    // We must not redirect here or the client's emailed link stops working.
    if (searchParams.has('token')) return NextResponse.next()
  }

  // JWT decode — shared by both admin and client checks below.
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
  const isSecure = request.nextUrl.protocol === 'https:'
  // NextAuth v5 renamed the cookie — try both names.
  const v5CookieName = isSecure ? '__Secure-authjs.session-token' : 'authjs.session-token'
  const v4CookieName = isSecure ? '__Secure-next-auth.session-token' : 'next-auth.session-token'

  let token = await getToken({ req: request, secret, cookieName: v5CookieName })
  if (!token) {
    token = await getToken({ req: request, secret, cookieName: v4CookieName })
  }

  // --- Admin routes: require admin role ---
  if (pathname.startsWith('/admin')) {
    if (!token || (token as any).role !== 'admin') {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // --- Client routes: require any authenticated session ---
  if (pathname.startsWith('/client')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  // All page routes: legacy-domain redirect must run before trailingSlash.
  // Static assets and Next internals are excluded to avoid unnecessary work.
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)',
  ],
}
