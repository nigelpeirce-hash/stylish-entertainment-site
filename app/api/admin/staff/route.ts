import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import * as z from "zod";
import { randomUUID } from "crypto";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const staffSchema = z.object({
  name: z.string().min(2),
  professionalTitle: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  technicalSkills: z.array(z.string()).default([]),
  roles: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

// GET - List all staff
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const staff = await prisma.freelanceCrew.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ staff });
  } catch (error: any) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch staff" },
      { status: error.status || 500 }
    );
  }
}

// POST - Create new staff member
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const validated = staffSchema.parse(body);

    // Check if email already exists
    const existing = await prisma.freelanceCrew.findFirst({
      where: { email: validated.email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A staff member with this email already exists" },
        { status: 400 }
      );
    }

    // Create staff member
    // Note: professionalTitle, bio, and technicalSkills will be available after running the migration
    const staff = await prisma.freelanceCrew.create({
      data: {
        id: randomUUID(),
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        roles: validated.roles || [],
        isActive: validated.isActive ?? true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ staff }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating staff:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create staff member" },
      { status: 500 }
    );
  }
}
