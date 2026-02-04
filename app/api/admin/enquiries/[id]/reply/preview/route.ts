import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { buildEnquiryReplyEmail, type EnquiryLike } from "@/lib/email/enquiry-reply-template";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const bodySchema = z.object({
  customIntro: z.string().default(""),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
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

    const { id } = context.params instanceof Promise ? await context.params : context.params;
    if (!id) {
      return NextResponse.json({ error: "Enquiry ID is required" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const { customIntro } = bodySchema.parse(body);

    let enquiry: EnquiryLike | null = null;

    // Try NewEnquiry first
    const newEnquiry = await prisma.newEnquiry.findUnique({
      where: { id },
    });

    if (newEnquiry) {
      enquiry = {
        id: newEnquiry.id,
        name: newEnquiry.name,
        email: newEnquiry.email,
        eventDate: newEnquiry.eventDate,
        venueName: newEnquiry.venueName,
        venuePostcode: newEnquiry.venuePostcode,
        eventType: newEnquiry.eventType,
        message: newEnquiry.message,
      };
    } else {
      // Fallback: treat as Booking id (enquiry-like from converted booking)
      const booking = await prisma.booking.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          eventDate: true,
          venueName: true,
          venuePostcode: true,
          eventType: true,
          message: true,
        },
      });

      if (booking) {
        enquiry = {
          id: booking.id,
          name: booking.name,
          email: booking.email,
          eventDate: booking.eventDate,
          venueName: booking.venueName,
          venuePostcode: booking.venuePostcode,
          eventType: booking.eventType,
          message: booking.message,
        };
      }
    }

    if (!enquiry || !enquiry.email) {
      return NextResponse.json(
        { error: "Enquiry not found or missing email" },
        { status: 404 }
      );
    }

    const { subject, html } = buildEnquiryReplyEmail({
      enquiry,
      customIntro,
      meta: { source: "admin-enquiry-reply" },
    });

    return NextResponse.json({ subject, html });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Preview enquiry reply error:", error);
    return NextResponse.json(
      { error: "Failed to generate preview" },
      { status: 500 }
    );
  }
}
