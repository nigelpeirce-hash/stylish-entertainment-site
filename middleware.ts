// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Allow localhost through without a session check (matches requireAdmin() dev bypass)
  const host = request.headers.get('host') || ''
  const isLocalhost =
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.startsWith('192.168.') ||
    host.startsWith('10.')
  if (isLocalhost) return NextResponse.next()

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  })

  if (!token || (token as any).role !== 'admin') {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Narrow matcher: only admin pages — login, /api/*, /client/*, public all untouched
  matcher: ['/admin/:path*'],
}
