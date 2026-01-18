import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if email exists in database
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { id: true, email: true, password: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "EMAIL_NOT_RECOGNIZED", message: "Email not recognised" },
        { status: 404 }
      );
    }

    // Email exists, but we don't verify password here (let NextAuth do that)
    // We just confirm the email is in the system
    return NextResponse.json(
      { exists: true, message: "Email found" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error checking credentials:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
