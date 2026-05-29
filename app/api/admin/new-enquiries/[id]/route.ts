import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  NEW_ENQUIRY_BOOKING_SELECT,
  serializeNewEnquiry,
} from "@/lib/serialize-new-enquiry";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
    const enquiryId = resolvedParams.id;

    if (!enquiryId) {
      return NextResponse.json({ error: "Enquiry ID is required" }, { status: 400 });
    }

    const enquiry = await prisma.newEnquiry.findUnique({
      where: { id: enquiryId },
      include: {
        Booking: {
          select: NEW_ENQUIRY_BOOKING_SELECT,
        },
      },
    });

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ enquiry: serializeNewEnquiry(enquiry) });
  } catch (error) {
    console.error("Error fetching enquiry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost =
      hostname.includes("localhost") ||
      hostname.includes("127.0.0.1") ||
      process.env.NODE_ENV === "development";

    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const enquiryId = resolvedParams.id;

    if (!enquiryId) {
      return NextResponse.json({ error: "Enquiry ID is required" }, { status: 400 });
    }

    const existing = await prisma.newEnquiry.findUnique({
      where: { id: enquiryId },
      select: { id: true, status: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    if (existing.status === "converted") {
      return NextResponse.json(
        { error: "Cannot delete an enquiry that has already been converted to a booking." },
        { status: 400 }
      );
    }

    await prisma.newEnquiry.delete({ where: { id: enquiryId } });

    return NextResponse.json({ success: true, id: enquiryId });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
