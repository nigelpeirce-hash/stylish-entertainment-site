import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { sendDepositInvoiceForBooking } from "@/lib/send-deposit-invoice";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/bookings/[id]/send-deposit-invoice
 * Send the "please pay" deposit invoice email. Use before payment.
 * Distinct from send-deposit-email (confirmation after payment).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolved = params instanceof Promise ? await params : params;
    const bookingId = resolved.id;
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    const result = await sendDepositInvoiceForBooking(bookingId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? "Failed to send deposit invoice" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Deposit invoice sent",
      lastSentAt: result.lastSentAt,
    });
  } catch (e: unknown) {
    console.error("[send-deposit-invoice]", e);
    return NextResponse.json(
      { error: (e as Error)?.message ?? "Failed to send deposit invoice" },
      { status: 500 }
    );
  }
}
