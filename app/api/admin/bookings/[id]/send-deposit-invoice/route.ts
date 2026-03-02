import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getDepositInvoiceDraft,
  sendDepositInvoiceForBooking,
  type SendDepositInvoiceOverrides,
} from "@/lib/send-deposit-invoice";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/admin/bookings/[id]/send-deposit-invoice
 * Return draft for admin review (amount, reference, subject, html). Does not send.
 */
export async function GET(
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

    const draft = await getDepositInvoiceDraft(bookingId);
    if (!draft) {
      return NextResponse.json(
        { error: "Booking not found or has no email" },
        { status: 404 }
      );
    }

    return NextResponse.json(draft);
  } catch (e: unknown) {
    console.error("[send-deposit-invoice] GET", e);
    return NextResponse.json(
      { error: (e as Error)?.message ?? "Failed to get draft" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/bookings/[id]/send-deposit-invoice
 * Send the "please pay" deposit invoice email. Use before payment.
 * Body (optional): { amount?: number, reference?: string } to override draft values.
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

    let overrides: SendDepositInvoiceOverrides | undefined;
    try {
      const body = await request.json().catch(() => ({}));
      if (typeof body.amount === "number" && !Number.isNaN(body.amount)) {
        overrides = { ...overrides, amount: body.amount };
      } else if (body.amount === null || body.amount === "") {
        overrides = { ...overrides, amount: null };
      }
      if (typeof body.reference === "string" && body.reference.trim()) {
        overrides = { ...overrides, reference: body.reference.trim() };
      }
    } catch {
      // no body or invalid JSON: send with default draft values
    }

    const result = await sendDepositInvoiceForBooking(bookingId, overrides);

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
