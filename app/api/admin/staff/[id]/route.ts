import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

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

// GET - Get single staff member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id } = await params;
    const staff = await prisma.freelanceCrew.findUnique({
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
        },
      },
    });

    if (!staff) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ staff });
  } catch (error: any) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch staff" },
      { status: error.status || 500 }
    );
  }
}

// PUT - Update staff member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id } = await params;
    const body = await request.json();
    const validated = staffSchema.parse(body);

    // Get existing staff member to check email change
    const existing = await prisma.freelanceCrew.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    // Check if email is being changed and if new email already exists
    if (validated.email !== existing.email) {
      const emailExists = await prisma.freelanceCrew.findFirst({
        where: { email: validated.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "A staff member with this email already exists" },
          { status: 400 }
        );
      }

      // Note: Email is stored in FreelanceCrew, not in assignments
      // Updating FreelanceCrew.email automatically updates it everywhere
      // because the brief system and all queries read from FreelanceCrew
      // No need to update assignments - they reference staffId which stays the same
    }

    // Update staff member
    // Note: professionalTitle, bio, and technicalSkills will be available after running the migration
    const staff = await prisma.freelanceCrew.update({
      where: { id },
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        roles: validated.roles || [],
        isActive: validated.isActive ?? true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ staff });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating staff:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update staff member" },
      { status: 500 }
    );
  }
}

// DELETE - Delete staff member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    // Extract ID from params (Next.js 15 uses async params)
    let id: string;
    try {
      const resolvedParams = await params;
      id = resolvedParams.id;
    } catch (error) {
      // Fallback: extract from URL if params fails
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      id = pathParts[pathParts.length - 1]?.split('?')[0] || '';
    }
    
    if (!id || id === 'undefined') {
      console.error("Failed to extract staff ID from params:", { params, url: request.url });
      return NextResponse.json(
        { error: "Staff member ID is required" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const forceDelete = searchParams.get("force") === "true";

    // Check if staff member has active assignments
    const assignments = await prisma.bookingStaffAssignment.findMany({
      where: {
        staffId: id,
        booking: {
          eventDate: {
            gte: new Date(), // Future bookings
          },
          status: {
            not: "cancelled",
          },
        },
      },
      include: {
        booking: {
          select: {
            id: true,
            name: true,
            eventDate: true,
            venueName: true,
            bookingReference: true,
          },
        },
      },
    });

    if (assignments.length > 0 && !forceDelete) {
      // Return detailed information about blocking bookings
      const bookingDetails = assignments.map((a) => ({
        bookingId: a.booking.id,
        bookingReference: a.booking.bookingReference,
        clientName: a.booking.name,
        eventDate: a.booking.eventDate,
        venueName: a.booking.venueName,
      }));

      return NextResponse.json(
        {
          error: "Cannot delete staff member with active future bookings",
          activeAssignments: assignments.length,
          bookings: bookingDetails,
        },
        { status: 400 }
      );
    }

    // If force delete, we still delete the staff member
    // The booking assignments will remain but the staff reference will be broken
    // This is intentional - the bookings keep their history
    await prisma.freelanceCrew.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true,
      message: forceDelete 
        ? "Staff member deleted (force delete - bookings remain but staff reference removed)"
        : "Staff member deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting staff:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete staff member" },
      { status: 500 }
    );
  }
}
