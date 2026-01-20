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

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        invitedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { valid: false, error: "User not found" },
        { status: 404 }
      );
    }

    // If already verified, token is invalid (already used)
    if (user.emailVerified) {
      return NextResponse.json(
        { valid: false, error: "Account already set up. Please log in." },
        { status: 400 }
      );
    }

    // Basic token validation - decode and check email matches
    try {
      const decoded = Buffer.from(token, "base64").toString("utf-8");
      const [tokenEmail] = decoded.split(":");
      
      if (tokenEmail !== email) {
        return NextResponse.json(
          { valid: false, error: "Invalid token" },
          { status: 400 }
        );
      }
    } catch (decodeError) {
      return NextResponse.json(
        { valid: false, error: "Invalid token format" },
        { status: 400 }
      );
    }

    // Token is valid
    return NextResponse.json({ valid: true });
  } catch (error: any) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to validate token" },
      { status: 500 }
    );
  }
}
