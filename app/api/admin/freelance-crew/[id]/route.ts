import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET - Fetch a single crew member
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    const crew = await prisma.freelanceCrew.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            booking: {
              select: {
                id: true,
                name: true,
                eventDate: true,
                venueName: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    });

    if (!crew) {
      return NextResponse.json({ error: "Crew member not found" }, { status: 404 });
    }

    return NextResponse.json({ crew });
  } catch (error: any) {
    console.error("Error fetching crew member:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch crew member" },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update a crew member
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { name, email, phone, roles, isActive } = body;

    // Check if name is being changed and if it conflicts
    if (name) {
      const existing = await prisma.freelanceCrew.findFirst({
        where: {
          id: { not: id },
          name: {
            equals: name.trim(),
            mode: "insensitive",
          },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: `Crew member "${name.trim()}" already exists` },
          { status: 409 }
        );
      }
    }

    const crew = await prisma.freelanceCrew.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(email !== undefined && { email: email?.trim() || null }),
        ...(phone !== undefined && { phone: phone?.trim() || null }),
        ...(roles !== undefined && { roles }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ crew });
  } catch (error: any) {
    console.error("Error updating crew member:", error);
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Crew member with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update crew member" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete a crew member
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    // Check if crew member has active assignments
    const assignments = await prisma.bookingStaffAssignment.findMany({
      where: {
        staffId: id,
        status: { in: ["held", "confirmed"] },
      },
    });

    if (assignments.length > 0) {
      return NextResponse.json(
        { error: `Cannot delete crew member with ${assignments.length} active assignment(s). Please cancel or complete assignments first.` },
        { status: 400 }
      );
    }

    await prisma.freelanceCrew.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting crew member:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete crew member" },
      { status: 500 }
    );
  }
}
