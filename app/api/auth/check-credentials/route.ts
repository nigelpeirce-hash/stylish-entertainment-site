import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to prevent database connection during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    });
    
    // Return more details in development
    const errorMessage = process.env.NODE_ENV === "development" 
      ? error?.message || "Internal server error"
      : "Internal server error";
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: errorMessage,
        ...(process.env.NODE_ENV === "development" && { 
          details: error?.code,
          stack: error?.stack 
        })
      },
      { status: 500 }
    );
  }
}
