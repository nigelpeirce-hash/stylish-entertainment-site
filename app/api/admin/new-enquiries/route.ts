import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  NEW_ENQUIRY_BOOKING_SELECT,
  serializeNewEnquiry,
} from "@/lib/serialize-new-enquiry";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1") || process.env.NODE_ENV === "development";

    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all new enquiries, ordered by creation date (newest first)
    const enquiries = await prisma.newEnquiry.findMany({
      where: {
        status: {
          in: ["new", "reviewed"],
        },
      },
      include: {
        Booking: {
          select: NEW_ENQUIRY_BOOKING_SELECT,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const serialized = enquiries.map(serializeNewEnquiry);

    return NextResponse.json({
      enquiries: serialized,
      hireEnquiries: serialized.filter((e) => e.enquiryType === "hire_only"),
      quoteRequestEnquiries: serialized.filter((e) => e.enquiryType === "quote_request"),
    });
  } catch (error) {
    console.error("Error fetching new enquiries:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
