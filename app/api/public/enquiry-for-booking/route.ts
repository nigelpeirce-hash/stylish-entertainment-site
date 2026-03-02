import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Booking Request Form service labels (exact values for setValue("services", ...)) */
const BOOKING_SERVICES = [
  "DJs",
  "Musicians",
  "Lighting Design",
  "Kit Hire",
  "Fire-Pits",
  "Venue Styling",
  "Party Planning",
] as const;

/**
 * Map enquiry/quote service keys (quoteRequestData.services) and enquiryType to Booking Request Form service labels.
 * Quote request uses: lighting, dj_kit, production, hire_only, combination.
 */
function enquiryServicesToBookingServices(
  quoteRequestData: { services?: string[] } | null,
  enquiryType: string | null
): string[] {
  const out = new Set<string>();
  const raw = quoteRequestData?.services;
  const arr = Array.isArray(raw) ? raw : [];

  for (const s of arr) {
    const v = String(s).toLowerCase().trim();
    if (v === "dj_kit") out.add("DJs");
    else if (v === "musicians") out.add("Musicians");
    else if (v === "lighting") out.add("Lighting Design");
    else if (v === "production") out.add("Lighting Design");
    else if (v === "hire_only") out.add("Kit Hire");
    else if (v === "combination") {
      out.add("DJs");
      out.add("Lighting Design");
      out.add("Kit Hire");
    }
  }

  if (enquiryType === "hire_only") out.add("Kit Hire");

  return [...out].filter((label) => BOOKING_SERVICES.includes(label as (typeof BOOKING_SERVICES)[number]));
}

/**
 * GET /api/public/enquiry-for-booking?enquiryId=xxx
 * Returns enquiry details for pre-filling the Booking Request Form.
 * Used when client follows a link from their initial enquiry or after a quote (e.g. /client/bookings/new?enquiryId=xxx).
 * Includes services (DJs, Musicians, Lighting Design, etc.) from quote_request and hire_only enquiries.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const enquiryId = searchParams.get("enquiryId");

    if (!enquiryId || !enquiryId.trim()) {
      return NextResponse.json(
        { error: "enquiryId is required" },
        { status: 400 }
      );
    }

    const enquiry = await prisma.newEnquiry.findUnique({
      where: { id: enquiryId.trim() },
      select: {
        name: true,
        email: true,
        phoneAreaCode: true,
        phoneNumber: true,
        eventDate: true,
        venueName: true,
        venuePostcode: true,
        eventType: true,
        message: true,
        quoteRequestData: true,
      },
    });

    if (!enquiry) {
      return NextResponse.json(
        { error: "Enquiry not found" },
        { status: 404 }
      );
    }

    const ac = enquiry.phoneAreaCode || "";
    const num = enquiry.phoneNumber || "";
    const phone = [ac, num].filter(Boolean).join(" ").trim() || undefined;

    const quoteData = enquiry.quoteRequestData as { services?: string[] } | null;
    const services = enquiryServicesToBookingServices(quoteData, enquiry.enquiryType);

    return NextResponse.json({
      name: enquiry.name ?? "",
      email: enquiry.email ?? "",
      phone: phone ?? undefined,
      eventDate: enquiry.eventDate ? new Date(enquiry.eventDate).toISOString().slice(0, 10) : undefined,
      venueName: enquiry.venueName ?? undefined,
      venuePostcode: enquiry.venuePostcode ?? undefined,
      eventType: enquiry.eventType ?? undefined,
      message: enquiry.message ?? undefined,
      services: services.length > 0 ? services : undefined,
    });
  } catch (error) {
    console.error("Error fetching enquiry for booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
