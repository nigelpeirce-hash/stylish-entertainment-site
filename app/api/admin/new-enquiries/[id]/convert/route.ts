import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1") || process.env.NODE_ENV === "development";

    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const enquiryId = params.id;

    if (!enquiryId) {
      return NextResponse.json({ error: "Enquiry ID is required" }, { status: 400 });
    }

    // Fetch enquiry
    const enquiry = await prisma.newEnquiry.findUnique({
      where: { id: enquiryId },
    });

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: enquiry.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: enquiry.email,
          name: enquiry.name,
          phone: enquiry.phoneAreaCode && enquiry.phoneNumber 
            ? `${enquiry.phoneAreaCode}${enquiry.phoneNumber}` 
            : null,
          role: "client",
        },
      });
    }

    // Create booking from enquiry
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        name: enquiry.name,
        email: enquiry.email,
        phoneAreaCode: enquiry.phoneAreaCode,
        phoneNumber: enquiry.phoneNumber,
        eventType: "wedding",
        eventDate: enquiry.eventDate,
        venueName: enquiry.venueName || "TBD",
        venuePostcode: enquiry.venuePostcode,
        status: "pending",
        priority: "medium",
        conflictStatus: enquiry.isConflict ? "pending" : null,
      },
    });

    // Update enquiry status
    await prisma.newEnquiry.update({
      where: { id: enquiryId },
      data: {
        status: "converted",
        reviewedAt: new Date(),
        reviewedBy: admin?.id || null,
      },
    });

    return NextResponse.json({ 
      bookingId: booking.id,
      message: "Enquiry converted to booking successfully" 
    });
  } catch (error) {
    console.error("Error converting enquiry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
