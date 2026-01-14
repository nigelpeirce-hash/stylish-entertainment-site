import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to prevent database connection during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import * as z from "zod";

const musicianSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  bio: z.string().optional(),
  instrument: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  displayOrder: z.number().int().optional().default(0),
});

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Get all musicians
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");
    const instrument = searchParams.get("instrument");

    const where: any = {};
    if (isActive !== null) where.isActive = isActive === "true";
    if (instrument) where.instrument = instrument;

    const musicians = await prisma.musician.findMany({
      where,
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ musicians });
  } catch (error) {
    console.error("Error fetching musicians:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Create new musician
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = musicianSchema.parse(body);

    // Generate slug if not provided
    const slug = validatedData.slug || createSlug(validatedData.name);

    // Check if slug already exists
    const existing = await prisma.musician.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A musician with this name already exists" },
        { status: 400 }
      );
    }

    const musician = await prisma.musician.create({
      data: {
        ...validatedData,
        slug,
        imageUrl: validatedData.imageUrl || null,
        instrument: validatedData.instrument || null,
      },
    });

    return NextResponse.json({ musician }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating musician:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
