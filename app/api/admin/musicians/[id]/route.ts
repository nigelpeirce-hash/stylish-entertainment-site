import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to prevent database connection during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import * as z from "zod";

const updateMusicianSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  bio: z.string().optional(),
  instrument: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

// Get single musician
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const musicianId = resolvedParams.id;

    const musician = await prisma.musician.findUnique({
      where: { id: musicianId },
    });

    if (!musician) {
      return NextResponse.json({ error: "Musician not found" }, { status: 404 });
    }

    return NextResponse.json({ musician });
  } catch (error) {
    console.error("Error fetching musician:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update musician
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const musicianId = resolvedParams.id;

    const body = await request.json();
    const validatedData = updateMusicianSchema.parse(body);

    const musician = await prisma.musician.update({
      where: { id: musicianId },
      data: validatedData,
    });

    return NextResponse.json({ musician });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating musician:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete musician
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const musicianId = resolvedParams.id;

    await prisma.musician.delete({
      where: { id: musicianId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting musician:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
