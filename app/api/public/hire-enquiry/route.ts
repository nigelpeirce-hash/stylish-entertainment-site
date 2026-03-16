import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";


/**
 * POST /api/public/hire-enquiry
 * Public visitor "Request Quote" – creates NewEnquiry with enquiryType 'hire_only',
 * validates stock, sends email to admin, links selected HireItems via selectedHireItems JSON.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      eventDate,
      venue,
      selectedItems,
      eventType,
    } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!eventDate) {
      return NextResponse.json({ error: "Event date is required" }, { status: 400 });
    }

    const parsedDate = new Date(eventDate);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Invalid event date" }, { status: 400 });
    }

    const venueTrimmed = typeof venue === "string" ? venue.trim() : "";
    const venueName = venueTrimmed || "TBC";
    const venuePostcode = "HIRE-ONLY";

    const items = Array.isArray(selectedItems) ? selectedItems : [];
    const validated: { hireItemId: string; quantity: number }[] = [];
    for (const x of items) {
      const id = typeof x.hireItemId === "string" ? x.hireItemId.trim() : "";
      const qty = typeof x.quantity === "number" ? Math.max(1, Math.floor(x.quantity)) : 1;
      if (id) validated.push({ hireItemId: id, quantity: qty });
    }

    let selectedHireItems: { hireItemId: string; quantity: number; name?: string; price?: number }[] = validated;
    if (validated.length > 0) {
      const ids = [...new Set(validated.map((v) => v.hireItemId))];
      const hireItems = await prisma.hireItem.findMany({
        where: { id: { in: ids } },
        select: { id: true, name: true, price: true, stockAvailable: true },
      });
      const byId = Object.fromEntries(hireItems.map((h) => [h.id, h]));

      // Stock check: reject if any requested quantity exceeds available
      for (const v of validated) {
        const item = byId[v.hireItemId];
        if (!item) {
          return NextResponse.json(
            { error: `Item not found or no longer available` },
            { status: 400 }
          );
        }
        if (item.stockAvailable >= 0 && v.quantity > item.stockAvailable) {
          return NextResponse.json(
            { error: `Only ${item.stockAvailable} available for "${item.name}". Please reduce quantity or remove.` },
            { status: 400 }
          );
        }
      }

      selectedHireItems = validated.map((v) => ({
        ...v,
        name: byId[v.hireItemId]?.name ?? v.hireItemId,
        price: byId[v.hireItemId]?.price ?? 0,
      }));
    }

    const enquiry = await prisma.newEnquiry.create({
      data: {
        id: randomUUID(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phoneAreaCode: null,
        phoneNumber: null,
        eventDate: parsedDate,
        venuePostcode,
        venueName,
        eventType: eventType || null,
        enquiryType: "hire_only",
        selectedHireItems: selectedHireItems.length ? (selectedHireItems as any) : null,
        isConflict: false,
        status: "new",
        updatedAt: new Date(),
      },
    });

    const dateLabel = parsedDate.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Email to admin (same shape as portal confirm-hire-request)
    const recipientEmail = process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk";
    const backupEmail = process.env.NOTIFICATION_EMAIL;
    const recipients = [recipientEmail, ...(backupEmail && backupEmail !== recipientEmail ? [backupEmail] : [])];

    if (selectedHireItems.length > 0) {
      const rows = selectedHireItems
        .map(
          (i) =>
            `• ${i.name} × ${i.quantity} — £${((i.price ?? 0) * i.quantity).toFixed(2)}`
        )
        .join("\n");
      const total = selectedHireItems.reduce(
        (sum, i) => sum + (i.price ?? 0) * i.quantity,
        0
      );
      const subject = `Hire quote request: ${name.trim()} @ ${venueName} — ${dateLabel}`;
      const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1A1A1A;">Hire Quote Request (Public)</h2>
        <p><strong>Client:</strong> ${name.trim()}</p>
        <p><strong>Email:</strong> ${email.trim()}</p>
        <p><strong>Event:</strong> ${dateLabel}</p>
        <p><strong>Venue:</strong> ${venueName}</p>
        <p><strong>Requested items:</strong></p>
        <pre style="background: #f5f5f5; padding: 12px; border-radius: 6px; white-space: pre-wrap;">${rows}</pre>
        <p><strong>Total:</strong> £${total.toFixed(2)}</p>
        <p style="color: #666; font-size: 14px;">Check stock and send a custom quote. Enquiry ID: ${enquiry.id}</p>
      </div>
    `;
      const text = `Hire Quote Request (Public)\n\nClient: ${name.trim()}\nEmail: ${email.trim()}\nEvent: ${dateLabel}\nVenue: ${venueName}\n\nRequested items:\n${rows}\n\nTotal: £${total.toFixed(2)}\n\nEnquiry ID: ${enquiry.id}`;
      await sendEmail({ to: recipients, subject, html, text }).catch((err) =>
        console.error("[hire-enquiry] Admin email failed:", err)
      );
    }

    return NextResponse.json({
      success: true,
      enquiryId: enquiry.id,
      message: `Thank you! Nigel will check availability for ${dateLabel} and send your custom quote shortly.`,
      dateLabel,
    });
  } catch (e: any) {
    console.error("[hire-enquiry]", e);
    return NextResponse.json(
      { error: e?.message || "Failed to submit hire enquiry" },
      { status: 500 }
    );
  }
}
