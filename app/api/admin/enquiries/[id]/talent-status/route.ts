import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface TalentStatus {
  [key: string]: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1") || process.env.NODE_ENV === "development";

    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // Fetch talent status from booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        talentStatus: true,
      },
    });

    // Return talent status or empty object
    const talentStatus: TalentStatus = (booking?.talentStatus as TalentStatus) || {};

    return NextResponse.json({ talentStatus });
  } catch (error) {
    console.error("Error fetching talent status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1") || process.env.NODE_ENV === "development";

    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;
    const { talentId, contacted } = await request.json();

    if (!bookingId || !talentId || typeof contacted !== "boolean") {
      return NextResponse.json(
        { error: "Booking ID, talent ID, and contacted status are required" },
        { status: 400 }
      );
    }

    // Fetch current talent status (safe select: omit columns that may not exist in DB)
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, talentStatus: true },
    });

    // Store talent status in metadata or separate field
    // For now, we'll store in a JSON field (you may need to add this to schema)
    const currentStatus: TalentStatus = (booking as any)?.talentStatus || {};
    currentStatus[talentId] = contacted;

    // Update booking with talent status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        talentStatus: currentStatus,
      },
    });

    return NextResponse.json({ 
      talentStatus: currentStatus,
      success: true 
    });
  } catch (error) {
    console.error("Error updating talent status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
