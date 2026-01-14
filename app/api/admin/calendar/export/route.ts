import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { exportBookingsToICal, exportSingleBookingToICal } from "@/lib/ical-export";

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");

    let icalContent: string;

    if (bookingId) {
      icalContent = await exportSingleBookingToICal(bookingId);
    } else {
      icalContent = await exportBookingsToICal();
    }

    return new NextResponse(icalContent, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="bookings-${new Date().toISOString().split("T")[0]}.ics"`,
      },
    });
  } catch (error: any) {
    console.error("Error exporting calendar:", error);
    return NextResponse.json(
      { error: "Failed to export calendar", details: error.message },
      { status: 500 }
    );
  }
}
