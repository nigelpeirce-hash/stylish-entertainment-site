import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

const updateDjSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  bio: z.string().optional(),
  mixcloudUrl: z.string().url().optional().nullable(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

// Get single DJ
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
    const djId = resolvedParams.id;

    const dj = await prisma.dJ.findUnique({
      where: { id: djId },
    });

    if (!dj) {
      return NextResponse.json({ error: "DJ not found" }, { status: 404 });
    }

    return NextResponse.json({ dj });
  } catch (error) {
    console.error("Error fetching DJ:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update DJ
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
    const djId = resolvedParams.id;

    const body = await request.json();
    const validatedData = updateDjSchema.parse(body);

    const dj = await prisma.dJ.update({
      where: { id: djId },
      data: validatedData,
    });

    return NextResponse.json({ dj });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating DJ:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete DJ
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
    const djId = resolvedParams.id;

    await prisma.dJ.delete({
      where: { id: djId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting DJ:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
