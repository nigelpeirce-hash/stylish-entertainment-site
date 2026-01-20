import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * API route to fetch dynamic breadcrumb data
 * Used for routes like /admin/bookings/[id] to get the actual booking name
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "booking", "enquiry", "template", "thread", "order"
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json(
        { error: "Type and ID are required" },
        { status: 400 }
      );
    }

    let label: string | null = null;

    switch (type) {
      case "booking":
        const booking = await prisma.booking.findUnique({
          where: { id },
          select: {
            name: true,
            bookingReference: true,
            eventDate: true,
            venueName: true,
          },
        });
        if (booking) {
          // Format: "Client Name @ Venue Name" or "Booking Reference" if available
          if (booking.bookingReference) {
            label = booking.bookingReference;
          } else if (booking.name && booking.venueName) {
            label = `${booking.name} @ ${booking.venueName}`;
          } else if (booking.name) {
            label = booking.name;
          } else {
            label = `Booking ${id.substring(0, 8)}`;
          }
        }
        break;

      case "enquiry":
        const enquiry = await prisma.newEnquiry.findUnique({
          where: { id },
          select: {
            name: true,
            eventDate: true,
            venueName: true,
          },
        });
        if (enquiry) {
          label = enquiry.name || `Enquiry ${id.substring(0, 8)}`;
        }
        break;

      case "template":
        const template = await prisma.emailTemplate.findUnique({
          where: { id },
          select: { name: true },
        });
        if (template) {
          label = template.name;
        }
        break;

      case "thread":
        const thread = await prisma.emailThread.findUnique({
          where: { id },
          select: {
            subject: true,
            fromName: true,
            fromEmail: true,
          },
        });
        if (thread) {
          label = thread.subject || thread.fromName || thread.fromEmail || `Thread ${id.substring(0, 8)}`;
        }
        break;

      case "order":
        const order = await prisma.hireOrder.findUnique({
          where: { id },
          select: {
            orderNumber: true,
            customerName: true,
          },
        });
        if (order) {
          label = order.orderNumber || order.customerName || `Order ${id.substring(0, 8)}`;
        }
        break;

      default:
        return NextResponse.json(
          { error: "Invalid type" },
          { status: 400 }
        );
    }

    if (!label) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ label });
  } catch (error: any) {
    console.error("Breadcrumb data error:", error);
    return NextResponse.json(
      { error: "Failed to fetch breadcrumb data" },
      { status: 500 }
    );
  }
}
