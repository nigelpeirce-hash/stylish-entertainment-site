import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { fixCloudinaryUrlForDisplay } from "@/lib/cloudinary-utils";

// Force dynamic rendering to prevent database connection during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import * as z from "zod";

const musicianSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  bio: z.string().optional(),
  strapLine: z.string().optional().nullable(),
  fullBio: z.string().optional().nullable(),
  instrument: z.string().optional(),
  youtubeEmbed: z.string().url().optional().nullable(),
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

    // Fix Cloudinary URLs for display; guard against non-string imageUrl
    const musiciansWithFixedUrls = musicians.map(musician => {
      const url = musician.imageUrl != null && typeof musician.imageUrl === "string" ? musician.imageUrl : null;
      let imageUrl: string | null = null;
      try {
        imageUrl = fixCloudinaryUrlForDisplay(url);
      } catch {
        imageUrl = url;
      }
      return { ...musician, imageUrl };
    });

    return NextResponse.json({ musicians: musiciansWithFixedUrls });
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
        id: randomUUID(),
        name: validatedData.name,
        slug,
        bio: validatedData.bio ?? null,
        strapLine: validatedData.strapLine ?? null,
        fullBio: validatedData.fullBio ?? null,
        instrument: validatedData.instrument ?? null,
        youtubeEmbed: validatedData.youtubeEmbed ?? null,
        seoTitle: validatedData.seoTitle ?? null,
        seoDescription: validatedData.seoDescription ?? null,
        imageUrl: validatedData.imageUrl ?? null,
        isActive: validatedData.isActive ?? true,
        displayOrder: validatedData.displayOrder ?? 0,
        updatedAt: new Date(),
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
