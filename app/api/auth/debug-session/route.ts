/**
 * Debug endpoint to diagnose 401 on admin.
 * GET /api/auth/debug-session - returns whether a session token is present and valid.
 * Remove or restrict this in production once fixed.
 */
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
    const token = await getToken({
      req: request,
      secret: secret || undefined,
    });

    const hasCookie = request.cookies.has("__Secure-authjs.session-token") ||
      request.cookies.has("authjs.session-token");

    return NextResponse.json({
      hasToken: !!token,
      hasCookie,
      role: token?.role ?? null,
      email: token?.email ?? null,
      secretSet: !!secret,
      secretIsPlaceholder: secret === "CHANGE_ME_RANDOM_SECRET",
      nextAuthUrl: process.env.NEXTAUTH_URL ? "set" : "missing",
    });
  } catch (e: any) {
    return NextResponse.json({
      error: e?.message || "Unknown error",
      hasToken: false,
    }, { status: 500 });
  }
}
