import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import * as z from "zod";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  try {
    // Check database connection first
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is not set");
      return NextResponse.json(
        { error: "Database configuration error", message: "Database connection not configured" },
        { status: 500 }
      );
    }

    // Test database connection
    try {
      await prisma.$connect();
    } catch (dbError: any) {
      console.error("Database connection failed:", dbError);
      return NextResponse.json(
        { 
          error: "Database connection error", 
          message: process.env.NODE_ENV === "development" 
            ? dbError.message 
            : "Unable to connect to database. Please try again later." 
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
    } catch (dbError: any) {
      console.error("Database query error (findUnique):", dbError);
      return NextResponse.json(
        { 
          error: "Database error", 
          message: process.env.NODE_ENV === "development" 
            ? dbError.message 
            : "Unable to check user. Please try again later." 
        },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    let user;
    try {
      user = await prisma.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          password: hashedPassword,
          role: "client",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    } catch (dbError: any) {
      console.error("Database query error (create):", dbError);
      // Check for unique constraint violation
      if (dbError.code === 'P2002') {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { 
          error: "Database error", 
          message: process.env.NODE_ENV === "development" 
            ? dbError.message 
            : "Unable to create user. Please try again later." 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      stack: error?.stack,
    });
    
    // Provide more detailed error information in development
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isDevelopment = process.env.NODE_ENV === "development";
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: isDevelopment ? errorMessage : "An error occurred during registration",
        ...(isDevelopment && { 
          details: {
            code: error?.code,
            name: error?.name,
          }
        })
      },
      { status: 500 }
    );
  } finally {
    // Don't disconnect in Next.js - let it manage connections
    // await prisma.$disconnect();
  }
}
