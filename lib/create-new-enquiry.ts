/**
 * Unified NewEnquiry creation for all public enquiry forms.
 */

import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getBrochureLink } from "@/lib/venue-assets";
import { getJourneyEmail } from "@/lib/email-journey-templates";
import { getResendConfig } from "@/lib/email-config";
import { Resend } from "resend";
import sendEmail from "@/lib/email/send-email";
import { logActivity } from "@/lib/activity-log";
import { sendNewEnquiryNotification } from "@/lib/pushover-notifications";
import { parseEventDate, eventDateDayRange } from "@/lib/parse-event-date";

export type EnquiryType = "contact" | "quote_request" | "hire_only" | "general";

export type QuoteRequestData = {
  services?: string[];
  servicesRequested?: string[];
  preferredDJ?: string | null;
  upsells?: string[];
  upsellItems?: string[];
  contactPreference?: string;
  priority?: string;
  message?: string;
};

export type SelectedHireItem = {
  hireItemId: string;
  quantity: number;
  name?: string;
  price?: number;
};

export interface CreateNewEnquiryInput {
  name: string;
  email: string;
  phone?: string | null;
  phoneAreaCode?: string | null;
  phoneNumber?: string | null;
  eventDate: Date;
  venueName?: string | null;
  venuePostcode: string;
  eventType?: string | null;
  message?: string | null;
  enquiryType: EnquiryType;
  quoteRequestData?: QuoteRequestData;
  selectedHireItems?: SelectedHireItem[] | null;
  /** Optional rich HTML for admin notification (contact form) */
  adminEmailHtml?: string;
  adminEmailSubject?: string;
  /** Venue name for brochure lookup in autoresponder */
  brochureVenueName?: string | null;
}

export interface CreateNewEnquiryResult {
  enquiry: {
    id: string;
    name: string;
    email: string;
    eventDate: Date;
    venueName: string | null;
    venuePostcode: string;
    isConflict: boolean;
  };
  conflictDetected: boolean;
  existingBooking: { id: string; name: string } | null;
  autoresponderSent: boolean;
  adminEmailSent: boolean;
}

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx") return null;
  if (!apiKey.startsWith("re_") || apiKey.length < 35) return null;
  return new Resend(apiKey);
}

/** Parse UK phone into area code + number for NewEnquiry storage. */
export function parseUKPhone(phone: string): { phoneAreaCode: string | null; phoneNumber: string | null } {
  const cleaned = phone.replace(/\s+/g, "");
  if (!cleaned) return { phoneAreaCode: null, phoneNumber: null };
  if (cleaned.startsWith("0")) {
    if (cleaned.startsWith("07")) {
      return { phoneAreaCode: cleaned.substring(0, 4), phoneNumber: cleaned.substring(4) };
    }
    return { phoneAreaCode: cleaned.substring(0, 3), phoneNumber: cleaned.substring(3) };
  }
  return { phoneAreaCode: null, phoneNumber: phone };
}

async function detectBookingConflict(eventDate: Date, venuePostcode: string) {
  const normalized = venuePostcode.toUpperCase().replace(/\s+/g, "");
  if (!normalized || normalized === "CONTACT" || normalized === "QUOTE-REQUEST" || normalized === "HIRE-ONLY") {
    return null;
  }

  const { dayStart, dayEnd } = eventDateDayRange(eventDate);

  return prisma.booking.findFirst({
    where: {
      eventDate: { gte: dayStart, lte: dayEnd },
      OR: [
        { venuePostcode: { contains: normalized, mode: "insensitive" } },
        { venuePostcode: normalized },
      ],
      status: { not: "cancelled" },
    },
    select: { id: true, name: true, email: true, venueName: true, venuePostcode: true },
  });
}

function defaultAdminEmail(input: CreateNewEnquiryInput, enquiryId: string, dateLabel: string, isConflict: boolean) {
  const typeLabels: Record<EnquiryType, string> = {
    contact: "Contact form enquiry",
    quote_request: "Quote request",
    hire_only: "Hire quote request",
    general: "New enquiry",
  };
  const title = isConflict ? `${typeLabels[input.enquiryType]} (conflict flagged)` : typeLabels[input.enquiryType];
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://www.stylishentertainment.co.uk";
  const enquiryUrl = `${baseUrl}/admin/new-enquiries/${enquiryId}`;
  const phone =
    input.phone ||
    (input.phoneAreaCode && input.phoneNumber ? `${input.phoneAreaCode}${input.phoneNumber}` : null);

  const qrd = input.quoteRequestData;
  const servicesLine =
    qrd?.services?.length || qrd?.servicesRequested?.length
      ? [...(qrd.services ?? []), ...(qrd.servicesRequested ?? [])].join(", ")
      : null;

  return {
    subject: `[Stylish] ${title}: ${input.name.trim()} — ${dateLabel}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;">${title}</h2>
        <p><strong>Name:</strong> ${input.name.trim()}</p>
        <p><strong>Email:</strong> ${input.email.trim()}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Event date:</strong> ${dateLabel}</p>
        <p><strong>Venue:</strong> ${input.venueName || input.venuePostcode}</p>
        ${input.eventType ? `<p><strong>Event type:</strong> ${input.eventType}</p>` : ""}
        ${qrd?.preferredDJ ? `<p><strong>Preferred DJ:</strong> ${qrd.preferredDJ}</p>` : ""}
        ${servicesLine ? `<p><strong>Services:</strong> ${servicesLine}</p>` : ""}
        ${input.message ? `<p><strong>Message:</strong></p><p>${input.message.replace(/\n/g, "<br>")}</p>` : ""}
        ${isConflict ? `<p style="color: #b45309;"><strong>⚠ Potential conflict with an existing booking on this date/postcode.</strong></p>` : ""}
        <p style="margin-top: 20px;"><a href="${enquiryUrl}" style="color: #D4AF37; font-weight: bold;">View enquiry →</a></p>
      </div>
    `,
  };
}

export async function createNewEnquiry(input: CreateNewEnquiryInput): Promise<CreateNewEnquiryResult> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();

  let phoneAreaCode = input.phoneAreaCode ?? null;
  let phoneNumber = input.phoneNumber ?? null;
  if (input.phone && !phoneAreaCode && !phoneNumber) {
    const parsed = parseUKPhone(input.phone);
    phoneAreaCode = parsed.phoneAreaCode;
    phoneNumber = parsed.phoneNumber;
  }

  const venuePostcode = (input.venuePostcode || "TBC").trim();
  const venueName = input.venueName?.trim() || null;

  const eventDate = parseEventDate(input.eventDate);

  const existingBooking = await detectBookingConflict(eventDate, venuePostcode);

  const enquiry = await prisma.newEnquiry.create({
    data: {
      id: randomUUID(),
      name,
      email,
      phoneAreaCode,
      phoneNumber,
      message: input.message?.trim() || null,
      eventDate,
      venuePostcode,
      venueName,
      eventType: input.eventType || null,
      enquiryType: input.enquiryType,
      quoteRequestData: input.quoteRequestData ? (input.quoteRequestData as object) : undefined,
      selectedHireItems: input.selectedHireItems?.length ? (input.selectedHireItems as object) : undefined,
      isConflict: !!existingBooking,
      originalBookingId: existingBooking?.id || null,
      conflictDetectedAt: existingBooking ? new Date() : null,
      status: "new",
      updatedAt: new Date(),
    },
  });

  const dateLabel = input.eventDate.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const eventDateLabel = input.eventDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  await logActivity({
    enquiryId: enquiry.id,
    action: "enquiry_received",
    description: `${name} – ${venueName || venuePostcode} – ${eventDateLabel}`,
    actor: "client",
    metadata: { enquiryType: input.enquiryType },
  });

  let autoresponderSent = false;
  try {
    const resend = getResend();
    const emailConfig = getResendConfig("booking");
    let brochureUrl = "https://res.cloudinary.com/stylish/brochures/general-stylish-brochure.pdf";
    try {
      const link = await getBrochureLink(input.brochureVenueName ?? venueName);
      if (link?.startsWith("http")) brochureUrl = link;
    } catch {
      /* use default brochure */
    }

    const { subject, html } = getJourneyEmail("enquiry-autoresponder", {
      clientName: name,
      eventType: input.eventType || "event",
      eventDate: dateLabel,
      venueName: venueName || undefined,
      brochureUrl,
    });

    if (resend) {
      const result = await resend.emails.send({
        from: emailConfig.from,
        replyTo: emailConfig.replyTo,
        to: [email],
        subject,
        html,
      });
      if (result.data?.id && !result.error) {
        autoresponderSent = true;
        await prisma.newEnquiry.update({
          where: { id: enquiry.id },
          data: { firstTouchEmailSent: true, firstTouchEmailSentAt: new Date() },
        });
      }
    }
  } catch (err) {
    console.error("[create-new-enquiry] Autoresponder failed:", err);
  }

  let adminEmailSent = false;
  try {
    const recipientEmail = process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk";
    const backupEmail = process.env.NOTIFICATION_EMAIL;
    const recipients = [recipientEmail, ...(backupEmail && backupEmail !== recipientEmail ? [backupEmail] : [])];

    const adminMail =
      input.adminEmailHtml && input.adminEmailSubject
        ? { subject: input.adminEmailSubject, html: input.adminEmailHtml }
        : defaultAdminEmail(input, enquiry.id, dateLabel, !!existingBooking);

    const resend = getResend();
    if (resend) {
      const emailConfig = getResendConfig("booking");
      for (const to of recipients) {
        const result = await resend.emails.send({
          from: emailConfig.from,
          replyTo: emailConfig.replyTo,
          to: [to],
          subject: adminMail.subject,
          html: adminMail.html,
        });
        if (result.data?.id && !result.error) adminEmailSent = true;
      }
    } else {
      await sendEmail({ to: recipientEmail, subject: adminMail.subject, html: adminMail.html }).catch(() => {});
    }
  } catch (err) {
    console.error("[create-new-enquiry] Admin email failed:", err);
  }

  try {
    await sendNewEnquiryNotification({
      id: enquiry.id,
      name: enquiry.name,
      eventDate: enquiry.eventDate,
      venueName: enquiry.venueName || enquiry.venuePostcode,
      isConflict: !!existingBooking,
    });
    await prisma.newEnquiry.update({
      where: { id: enquiry.id },
      data: { notificationSent: true, notificationSentAt: new Date() },
    });
  } catch (err) {
    console.error("[create-new-enquiry] Push notification failed:", err);
  }

  return {
    enquiry: {
      id: enquiry.id,
      name: enquiry.name,
      email: enquiry.email,
      eventDate: enquiry.eventDate,
      venueName: enquiry.venueName,
      venuePostcode: enquiry.venuePostcode,
      isConflict: enquiry.isConflict,
    },
    conflictDetected: !!existingBooking,
    existingBooking: existingBooking ? { id: existingBooking.id, name: existingBooking.name } : null,
    autoresponderSent,
    adminEmailSent,
  };
}

/** Map quote_request service keys to booking services array. */
export function servicesFromQuoteRequestData(qrd: QuoteRequestData | null | undefined): string[] {
  const out: string[] = [];
  const map: Record<string, string> = {
    lighting: "lighting",
    dj_kit: "DJs",
    production: "production",
    hire_only: "hire",
    combination: "combination",
  };
  for (const s of qrd?.services ?? []) {
    const mapped = map[s] ?? s;
    if (!out.includes(mapped)) out.push(mapped);
  }
  for (const s of qrd?.servicesRequested ?? []) {
    if (s && !out.includes(s)) out.push(s);
  }
  if (qrd?.upsells?.length) {
    for (const u of qrd.upsells) {
      if (u === "lighting" && !out.includes("lighting")) out.push("lighting");
      if (u === "musicians" && !out.includes("musicians")) out.push("musicians");
      if (u === "fire-pits" && !out.includes("fire-pits")) out.push("fire-pits");
      if (u === "venue-styling" && !out.includes("venue-styling")) out.push("venue-styling");
    }
  }
  if (!out.includes("DJs") && qrd?.preferredDJ) out.push("DJs");
  return out;
}
