import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to prevent database connection during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * PATCH /api/client/bookings/[id]/tasks
 * Toggle task completed. Auth: session (user owns booking or admin) OR ?token= matching portalToken.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolved = params instanceof Promise ? await params : params;
    const id = resolved.id;
    const token = request.nextUrl.searchParams.get("token");
    const session = await auth();

    const body = await request.json();
    const { taskId, completed } = body;

    if (!taskId || typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      select: { id: true, userId: true, email: true, portalToken: true, completedTasks: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    let allowed = false;
    if (token && booking.portalToken && booking.portalToken === token) {
      allowed = true;
    } else if (session?.user) {
      const u = session.user as { id?: string; role?: string };
      if (u.role === "admin") allowed = true;
      else if (u.id && booking.userId === u.id) allowed = true;
      else if (session.user.email && booking.email === session.user.email) allowed = true;
    }
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update completed tasks array
    const currentTasks = booking.completedTasks || [];
    let updatedTasks: string[];

    if (completed) {
      // Add task if not already present
      updatedTasks = currentTasks.includes(taskId)
        ? currentTasks
        : [...currentTasks, taskId];
    } else {
      // Remove task
      updatedTasks = currentTasks.filter((id) => id !== taskId);
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        completedTasks: updatedTasks,
      },
    });

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
