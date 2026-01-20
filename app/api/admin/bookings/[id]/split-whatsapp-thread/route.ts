import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(
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
    const { newBookingId } = await request.json();

    if (!bookingId || !newBookingId) {
      return NextResponse.json(
        { error: "Both booking IDs are required" },
        { status: 400 }
      );
    }

    // Verify new booking exists
    const newBooking = await prisma.booking.findUnique({
      where: { id: newBookingId },
    });

    if (!newBooking) {
      return NextResponse.json(
        { error: "Target booking not found" },
        { status: 404 }
      );
    }

    // Move all WhatsApp messages from old booking to new booking
    const result = await prisma.commsLog.updateMany({
      where: {
        bookingId,
        platform: "whatsapp",
      },
      data: {
        bookingId: newBookingId,
      },
    });

    return NextResponse.json({
      success: true,
      messagesMoved: result.count,
    });
  } catch (error) {
    console.error("Error splitting WhatsApp thread:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
