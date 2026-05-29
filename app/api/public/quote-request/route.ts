import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNewEnquiry } from "@/lib/create-new-enquiry";
import { parseEventDate } from "@/lib/parse-event-date";
import {
  getEmailValidationError,
  getEventDateValidationError,
  getPhoneValidationError,
  PUBLIC_FORM_MESSAGES,
  toPublicFormError,
} from "@/lib/public-form-errors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_SERVICES = ["lighting", "dj_kit", "production", "hire_only", "combination"] as const;

/**
 * POST /api/public/quote-request
 * Single "Request a quote" – creates NewEnquiry with enquiryType 'quote_request',
 * quoteRequestData { services, message }, optional selectedHireItems.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      eventDate,
      venue,
      eventType,
      services,
      message,
      selectedItems,
    } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: PUBLIC_FORM_MESSAGES.nameRequired, field: "name" },
        { status: 400 }
      );
    }

    const emailError = getEmailValidationError(typeof email === "string" ? email : "");
    if (emailError) {
      return NextResponse.json({ error: emailError, field: "email" }, { status: 400 });
    }

    const phoneError = getPhoneValidationError(typeof phone === "string" ? phone : "");
    if (phoneError) {
      return NextResponse.json({ error: phoneError, field: "phone" }, { status: 400 });
    }

    const dateError = getEventDateValidationError(
      typeof eventDate === "string" ? eventDate : String(eventDate ?? "")
    );
    if (dateError) {
      return NextResponse.json({ error: dateError, field: "eventDate" }, { status: 400 });
    }

    let parsedDate: Date;
    try {
      parsedDate = parseEventDate(eventDate);
    } catch {
      return NextResponse.json(
        { error: PUBLIC_FORM_MESSAGES.eventDateInvalid, field: "eventDate" },
        { status: 400 }
      );
    }

    const venueTrimmed = typeof venue === "string" ? venue.trim() : "";
    const venueName = venueTrimmed || "TBC";
    const venuePostcode = "QUOTE-REQUEST";

    const rawServices = Array.isArray(services) ? services : [];
    const selectedServices = rawServices
      .filter((s: unknown) => typeof s === "string" && VALID_SERVICES.includes(s as (typeof VALID_SERVICES)[number]))
      .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i) as string[];

    if (selectedServices.length === 0) {
      return NextResponse.json(
        { error: PUBLIC_FORM_MESSAGES.servicesRequired, field: "services" },
        { status: 400 }
      );
    }

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

    const quoteRequestData =
      selectedServices.length > 0 || typeof message === "string"
        ? {
            services: selectedServices,
            message: typeof message === "string" ? message.trim() || undefined : undefined,
          }
        : undefined;

    const dateLabel = parsedDate.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const serviceLabels: Record<string, string> = {
      lighting: "Lighting",
      dj_kit: "DJ & kit",
      production: "Production",
      hire_only: "Hire only",
      combination: "Combination",
    };
    const servicesLine =
      selectedServices.length > 0
        ? selectedServices.map((s) => serviceLabels[s] ?? s).join(", ")
        : "—";
    const rows =
      selectedHireItems.length > 0
        ? selectedHireItems
            .map(
              (i) =>
                `• ${i.name} × ${i.quantity} — £${((i.price ?? 0) * i.quantity).toFixed(2)}`
            )
            .join("\n")
        : "—";
    const total =
      selectedHireItems.length > 0
        ? selectedHireItems.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0)
        : 0;

    const adminHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1A1A1A;">Quote Request</h2>
        <p><strong>Client:</strong> ${name.trim()}</p>
        <p><strong>Email:</strong> ${email.trim()}</p>
        <p><strong>Phone:</strong> ${phone.trim()}</p>
        <p><strong>Event:</strong> ${dateLabel}</p>
        <p><strong>Venue:</strong> ${venueName}</p>
        <p><strong>Services requested:</strong> ${servicesLine}</p>
        ${typeof message === "string" && message.trim() ? `<p><strong>Message:</strong></p><p>${message.trim().replace(/\n/g, "<br>")}</p>` : ""}
        <p><strong>Hire items:</strong></p>
        <pre style="background: #f5f5f5; padding: 12px; border-radius: 6px; white-space: pre-wrap;">${rows}</pre>
        ${total > 0 ? `<p><strong>Hire total:</strong> £${total.toFixed(2)}</p>` : ""}
      </div>
    `;

    const result = await createNewEnquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      eventDate: parsedDate,
      venueName,
      venuePostcode,
      eventType: eventType || null,
      message: typeof message === "string" ? message.trim() || null : null,
      enquiryType: "quote_request",
      quoteRequestData,
      selectedHireItems: selectedHireItems.length ? selectedHireItems : null,
      adminEmailHtml: adminHtml,
      adminEmailSubject: `Quote request: ${name.trim()} @ ${venueName} — ${dateLabel}`,
    });

    return NextResponse.json({
      success: true,
      enquiryId: result.enquiry.id,
      message: `Thank you! We'll check availability for ${dateLabel} and send your quote shortly.`,
      dateLabel,
    });
  } catch (e: unknown) {
    console.error("[quote-request]", e);
    return NextResponse.json(
      { error: toPublicFormError(e) },
      { status: 500 }
    );
  }
}
