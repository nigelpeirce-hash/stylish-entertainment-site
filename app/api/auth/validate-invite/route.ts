import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { valid: false, error: "Email and token are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        inviteToken: true,
        inviteTokenExpiresAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { valid: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { valid: false, error: "Account already set up. Please log in." },
        { status: 400 }
      );
    }

    if (!user.inviteToken) {
      return NextResponse.json(
        { valid: false, error: "No active invite found. Please request a new invite." },
        { status: 400 }
      );
    }

    if (user.inviteTokenExpiresAt && user.inviteTokenExpiresAt < new Date()) {
      return NextResponse.json(
        { valid: false, error: "This invite link has expired. Please ask to be re-invited." },
        { status: 400 }
      );
    }

    const hashedIncoming = createHash("sha256").update(token).digest("hex");
    if (hashedIncoming !== user.inviteToken) {
      return NextResponse.json(
        { valid: false, error: "Invalid token" },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error: any) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to validate token" },
      { status: 500 }
    );
  }
}
