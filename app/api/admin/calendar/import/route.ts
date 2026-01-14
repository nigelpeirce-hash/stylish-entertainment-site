import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import * as z from "zod";

// Force dynamic rendering to prevent BigInt issues during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const importSchema = z.object({
  url: z.string().url().optional(),
  fileContent: z.string().optional(),
  createBookings: z.boolean().optional().default(false),
  defaultEmail: z.string().email().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Dynamically import ical-import to avoid BigInt issues during build
    const { importICalFromURL, importICalFromFile, createBookingsFromICal } = await import("@/lib/ical-import");

    const body = await request.json();
    const validatedData = importSchema.parse(body);

    let events;

    if (validatedData.url) {
      events = await importICalFromURL(validatedData.url);
    } else if (validatedData.fileContent) {
      events = await importICalFromFile(validatedData.fileContent);
    } else {
      return NextResponse.json(
        { error: "Either url or fileContent must be provided" },
        { status: 400 }
      );
    }

    let createdBookings: any[] = [];
    if (validatedData.createBookings && validatedData.defaultEmail) {
      createdBookings = (await createBookingsFromICal(events, validatedData.defaultEmail)) || [];
    }

    return NextResponse.json({
      success: true,
      events: events,
      createdBookings: createdBookings.length,
      bookings: createdBookings,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error importing calendar:", error);
    return NextResponse.json(
      { error: "Failed to import calendar", details: error.message },
      { status: 500 }
    );
  }
}
