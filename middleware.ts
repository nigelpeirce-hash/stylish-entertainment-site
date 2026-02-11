// middleware.ts
// Middleware intentionally disabled to avoid redirect loops.
// Auth logic reintroduced separately once routing is stable.
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
