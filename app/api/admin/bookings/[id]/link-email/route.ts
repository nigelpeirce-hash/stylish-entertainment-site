import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Check admin authentication
    const admin = await requireAdmin(request);
    
    // Check if request is from localhost (development only)
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    if (!admin && !isLocalhost) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const existingBookingId = resolvedParams.id;
    const body = await request.json();
    const { newEmail, newBookingId } = body;

    if (!newEmail) {
      return NextResponse.json(
        { error: "newEmail is required" },
        { status: 400 }
      );
    }

    // Get existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: { id: existingBookingId },
      select: {
        id: true,
        email: true,
        authorizedSenders: true,
      },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Existing booking not found" },
        { status: 404 }
      );
    }

    // Add new email to authorized senders (avoid duplicates)
    const currentSenders = existingBooking.authorizedSenders || [];
    const normalizedNewEmail = newEmail.toLowerCase().trim();
    const normalizedExistingEmail = existingBooking.email.toLowerCase().trim();

    // Don't add if it's already the primary email or already in authorized list
    if (
      normalizedNewEmail !== normalizedExistingEmail &&
      !currentSenders.map((e) => e.toLowerCase().trim()).includes(normalizedNewEmail)
    ) {
      currentSenders.push(newEmail); // Keep original case for display
    }

    // Update existing booking with new authorized sender
    await prisma.booking.update({
      where: { id: existingBookingId },
      data: {
        authorizedSenders: currentSenders,
        conflictStatus: "resolved",
        conflictResolvedAt: new Date(),
      },
    });

    // If there's a new booking ID, mark it as merged and optionally delete/archive it
    if (newBookingId) {
      try {
        await prisma.booking.update({
          where: { id: newBookingId },
          data: {
            conflictStatus: "merged",
            conflictResolvedAt: new Date(),
            // Optionally mark as cancelled or merged
            status: "cancelled",
          },
        });
      } catch (error) {
        // New booking might not exist, that's okay
        console.warn("Could not update new booking:", error);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Email linked successfully",
      authorizedSenders: currentSenders,
    });
  } catch (error: any) {
    console.error("Error linking email:", error);
    return NextResponse.json(
      {
        error: "Failed to link email",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
