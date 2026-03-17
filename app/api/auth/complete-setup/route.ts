import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import * as z from "zod";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const setupSchema = z.object({
  email: z.string().email("Invalid email address"),
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = setupSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
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
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Account already set up. Please log in." },
        { status: 400 }
      );
    }

    if (!user.inviteToken) {
      return NextResponse.json(
        { error: "No active invite found. Please request a new invite." },
        { status: 400 }
      );
    }

    if (user.inviteTokenExpiresAt && user.inviteTokenExpiresAt < new Date()) {
      return NextResponse.json(
        { error: "This invite link has expired. Please ask to be re-invited." },
        { status: 400 }
      );
    }

    const hashedIncoming = createHash("sha256").update(validatedData.token).digest("hex");
    if (hashedIncoming !== user.inviteToken) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        emailVerified: new Date(),
        inviteToken: null,
        inviteTokenExpiresAt: null,
      },
    });

    return NextResponse.json(
      { message: "Account setup complete. You can now log in." },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Setup completion error:", error);
    return NextResponse.json(
      { error: "Failed to complete setup" },
      { status: 500 }
    );
  }
}
