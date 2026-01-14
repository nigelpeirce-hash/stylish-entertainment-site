import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { taskId, completed } = body;

    if (!taskId || typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify ownership
    if (booking.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
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
