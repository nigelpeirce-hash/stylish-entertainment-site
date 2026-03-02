import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { notifyAdminSignificantEvent } from "@/lib/admin-notifications";
import { sendEmail } from "@/lib/email";
import { DEPOSIT_CONFIRMED } from "@/lib/email-templates";
import { getEmailBaseUrl } from "@/lib/get-base-url";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Check admin authentication
    const admin = await requireAdmin(request);
    
    // Check if request is from localhost (development only)
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    if (!admin && !isLocalhost) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;
    const body = await request.json();

    // Fetch current booking state to detect changes (include fee/balance for deposit confirmation email)
    const currentBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        name: true,
        email: true,
        eventDate: true,
        eventType: true,
        venueName: true,
        depositReceivedManual: true,
        bookingFee: true,
        finalBalance: true,
        preferredDJ: true,
        portalToken: true,
        status: true,
      },
    });

    if (!currentBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const {
      finalBalance,
      bookingFee,
      adminNotes,
      taxInclusive,
      taxRate,
      feeBreakdown,
      overrideMode,
      overrideReason,
      selectedTemplate,
      eventDate,
      venueName,
      venuePostcode,
      venueAddress,
      venueAddress2,
      venueTown,
      venueCounty,
      ceremonyTime,
      djStartTime,
      djFinishTime,
      depositReceivedManual,
      message,
      status,
    } = body;

    // Validate override mode
    if (overrideMode && !overrideReason?.trim()) {
      return NextResponse.json(
        { error: "Override reason is required when override mode is enabled" },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};

    // Update flexible operator fields
    if (finalBalance !== undefined) {
      updateData.finalBalance = finalBalance;
    }
    if (bookingFee !== undefined) {
      updateData.bookingFee = bookingFee === "" ? null : bookingFee;
    }
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    if (taxInclusive !== undefined) {
      updateData.taxInclusive = taxInclusive;
    }
    if (taxRate !== undefined) {
      updateData.taxRate = taxRate;
    }
    if (feeBreakdown !== undefined) {
      updateData.feeBreakdown = feeBreakdown;
    }
    if (overrideReason !== undefined) {
      updateData.overrideReason = overrideReason;
    }
    if (selectedTemplate !== undefined) {
      updateData.selectedTemplate = selectedTemplate;
    }
    if (ceremonyTime !== undefined) {
      updateData.ceremonyTime = ceremonyTime ? new Date(ceremonyTime) : null;
    }
    if (djStartTime !== undefined) {
      updateData.djStartTime = djStartTime === null || djStartTime === "" ? null : String(djStartTime);
    }
    if (djFinishTime !== undefined) {
      updateData.djFinishTime = djFinishTime === null || djFinishTime === "" ? null : String(djFinishTime);
    }
    if (depositReceivedManual !== undefined) {
      updateData.depositReceivedManual = depositReceivedManual;
      // When deposit first confirmed: set portalToken if missing, status=confirmed if pending, depositReceived
      const wasDepositReceived = currentBooking.depositReceivedManual === true;
      const isNowDepositReceived = depositReceivedManual === true;
      if (!wasDepositReceived && isNowDepositReceived) {
        updateData.depositReceived = true;
        if (currentBooking.status === "pending") {
          updateData.status = "confirmed";
        }
        if (!currentBooking.portalToken) {
          updateData.portalToken = randomBytes(32).toString("hex");
        }
      }
    }
    // Venue Name, Postcode and Address: always allow updates (no override required)
    if (venueName !== undefined) {
      updateData.venueName = venueName;
    }
    if (venuePostcode !== undefined) {
      updateData.venuePostcode = venuePostcode === null || venuePostcode === "" ? null : String(venuePostcode);
    }
    if (venueAddress !== undefined) {
      updateData.venueAddress = venueAddress === null || venueAddress === "" ? null : String(venueAddress);
    }
    if (venueAddress2 !== undefined) {
      updateData.venueAddress2 = venueAddress2 === null || venueAddress2 === "" ? null : String(venueAddress2);
    }
    if (venueTown !== undefined) {
      updateData.venueTown = venueTown === null || venueTown === "" ? null : String(venueTown);
    }
    if (venueCounty !== undefined) {
      updateData.venueCounty = venueCounty === null || venueCounty === "" ? null : String(venueCounty);
    }
    if (message !== undefined) {
      updateData.message = message === null || message === "" ? null : String(message);
    }
    if (status !== undefined) {
      updateData.status = String(status);
    }

    // Only update locked fields (eventDate) if override mode is enabled
    if (overrideMode) {
      if (eventDate) {
        updateData.eventDate = new Date(eventDate);
      }
      if (overrideReason) {
        updateData.overrideReason = overrideReason;
      }
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      select: {
        id: true,
        finalBalance: true,
        adminNotes: true,
        taxInclusive: true,
        taxRate: true,
        feeBreakdown: true,
        overrideReason: true,
        selectedTemplate: true,
        eventDate: true,
        venueName: true,
        venuePostcode: true,
        ceremonyTime: true,
        djFinishTime: true,
        depositReceivedManual: true,
        message: true,
        status: true,
        updatedAt: true,
      },
    });

    // Check if depositReceivedManual is being set to true (and wasn't already true)
    // This ensures the email only sends once when the deposit is first confirmed
    const wasDepositReceived = currentBooking.depositReceivedManual === true;
    const isNowDepositReceived = depositReceivedManual === true;
    const shouldSendEmail = !wasDepositReceived && isNowDepositReceived;

    if (shouldSendEmail) {
      try {
        // Use magic link (works without password) — portalToken set above when deposit confirmed
        const baseUrl = getEmailBaseUrl().replace(/\/$/, "");
        const portalToken = updateData.portalToken ?? (currentBooking.portalToken as string | null);
        const portalUrl = portalToken
          ? `${baseUrl}/client/bookings/${bookingId}?token=${encodeURIComponent(portalToken)}`
          : `${baseUrl}/login?callbackUrl=${encodeURIComponent(`/client/bookings/${bookingId}`)}`;

        // Use updated booking data for email (eventDate/venueName may have changed this request; fee/balance from DB)
        const emailContent = DEPOSIT_CONFIRMED({
          booking: {
            name: currentBooking.name,
            eventDate: updatedBooking.eventDate,
            eventType: currentBooking.eventType || undefined,
            venueName: updatedBooking.venueName || undefined,
            bookingId: bookingId,
            bookingFee: currentBooking.bookingFee,
            finalBalance: currentBooking.finalBalance,
            preferredDJ: currentBooking.preferredDJ,
          },
          portalUrl,
        });

        // Send email
        await sendEmail({
          to: currentBooking.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });

        console.log(`✅ Deposit confirmation email sent to ${currentBooking.email} for booking ${bookingId}`);

        const eventDateStr = updatedBooking.eventDate
          ? new Date(updatedBooking.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
          : undefined;
        await logActivity({
          bookingId,
          action: "deposit_confirmation_sent",
          description: `Deposit confirmation email sent to ${currentBooking.email}`,
          actor: "admin",
          performedBy: admin?.name ?? admin?.email ?? undefined,
        });
        await notifyAdminSignificantEvent({
          type: "deposit_confirmation_sent",
          bookingId,
          title: "Deposit confirmation sent",
          description: `Deposit confirmation sent to ${currentBooking.name ?? "client"}`,
          actor: "admin",
          performedBy: admin?.name ?? admin?.email ?? undefined,
          bookingName: currentBooking.name ?? undefined,
          venueName: updatedBooking.venueName ?? currentBooking.venueName ?? undefined,
          eventDate: eventDateStr,
        });
      } catch (emailError) {
        // Log error but don't fail the request
        console.error("Error sending deposit confirmation email:", emailError);
        // Continue with the response even if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error: any) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      {
        error: "Failed to update booking",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
