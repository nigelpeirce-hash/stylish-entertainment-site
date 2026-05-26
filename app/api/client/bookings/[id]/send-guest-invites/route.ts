import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { isPortalTokenValid } from "@/lib/portal-token";
import { getResendConfig } from "@/lib/email-config";
import { getDisplayName } from "@/lib/utils/name-helpers";
import { getEmailBaseUrl } from "@/lib/get-base-url";
import { guestRequestPath, joinBaseUrl } from "@/lib/portal-paths";
import { EMAIL_LOGO_HTML_DARK } from "@/lib/email-signature";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_EMAILS = 200;
const BATCH_SIZE = 100;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseCsvEmails(text: string): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];
  const seen = new Set<string>();
  let emailColIndex = -1;

  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return { valid, invalid };

  const header = lines[0].toLowerCase();
  const cols = header.split(/[,;\t]/).map((c) => c.trim().toLowerCase());
  const emailColNames = ["email", "e-mail", "guest_email", "guest email"];
  if (cols.some((c) => emailColNames.includes(c))) {
    emailColIndex = cols.findIndex((c) => emailColNames.includes(c));
  }

  const extractEmails = (line: string): string[] => {
    const parts = line.split(/[,;\t]/).map((p) => p.trim());
    if (emailColIndex >= 0 && parts[emailColIndex]) {
      return [parts[emailColIndex]];
    }
    return parts.filter((p) => EMAIL_REGEX.test(p));
  };

  const startRow = emailColIndex >= 0 ? 1 : 0;
  for (let i = startRow; i < lines.length && valid.length < MAX_EMAILS; i++) {
    const emails = extractEmails(lines[i]);
    for (const e of emails) {
      const lower = e.toLowerCase();
      if (EMAIL_REGEX.test(e) && !seen.has(lower)) {
        seen.add(lower);
        valid.push(e);
      } else if (e && !EMAIL_REGEX.test(e)) {
        invalid.push(e);
      }
    }
  }
  return { valid, invalid };
}

function parseExcelEmails(buffer: Buffer): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];
  const seen = new Set<string>();
  const wb = XLSX.read(buffer, { type: "buffer" });
  const firstSheet = wb.SheetNames[0];
  if (!firstSheet) return { valid, invalid };
  const ws = wb.Sheets[firstSheet];
  const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, defval: "" }) as string[][];
  if (rows.length === 0) return { valid, invalid };

  const header = (rows[0] || []).map((c) => String(c || "").trim().toLowerCase());
  const emailColNames = ["email", "e-mail", "guest_email", "guest email"];
  let emailColIndex = header.findIndex((c) => emailColNames.includes(c));
  if (emailColIndex < 0) emailColIndex = 0;

  for (let i = emailColIndex >= 0 ? 1 : 0; i < rows.length && valid.length < MAX_EMAILS; i++) {
    const row = rows[i] || [];
    const cells = row.map((c) => String(c ?? "").trim());
    const toCheck = emailColIndex >= 0 && cells[emailColIndex] ? [cells[emailColIndex]] : cells;
    for (const e of toCheck) {
      if (!e) continue;
      const lower = e.toLowerCase();
      if (EMAIL_REGEX.test(e) && !seen.has(lower)) {
        seen.add(lower);
        valid.push(e);
      } else if (e && !EMAIL_REGEX.test(e)) {
        invalid.push(e);
      }
    }
  }
  return { valid, invalid };
}

/**
 * POST: send guest invite emails from CSV or Excel upload.
 * Auth: ?token= (portalToken) or session. Parses CSV/Excel, validates emails, sends via Resend batch.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolved = params instanceof Promise ? await params : params;
    const bookingId = resolved.id;
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    const token = request.nextUrl.searchParams.get("token");
    const session = await auth();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        userId: true,
        name: true,
        eventDate: true,
        venueName: true,
        eventType: true,
        portalToken: true,
        portalTokenExpiresAt: true,
        guestRequestToken: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    let allowed = false;
    if (token && isPortalTokenValid(booking, token)) {
      allowed = true;
    } else if (session?.user) {
      const u = session.user as { id?: string; role?: string };
      if (u.role === "admin" || (!!u.id && booking.userId === u.id)) allowed = true;
    }
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Email service is not configured. Please contact support." },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const name = file.name.toLowerCase();
    const isCsv = name.endsWith(".csv");
    const isExcel = name.endsWith(".xlsx") || name.endsWith(".xls");
    if (!isCsv && !isExcel) {
      return NextResponse.json(
        { error: "File must be a CSV or Excel (.xlsx, .xls)" },
        { status: 400 }
      );
    }

    let valid: string[];
    if (isCsv) {
      const text = await file.text();
      valid = parseCsvEmails(text).valid;
    } else {
      const buf = Buffer.from(await file.arrayBuffer());
      valid = parseExcelEmails(buf).valid;
    }
    if (valid.length === 0) {
      return NextResponse.json(
        { error: "No valid email addresses found. Use an 'email' column (or emails in the first column)." },
        { status: 400 }
      );
    }

    const emailsToSend = valid.slice(0, MAX_EMAILS);
    let guestRequestToken = booking.guestRequestToken;
    if (!guestRequestToken) {
      guestRequestToken = `gr_${randomBytes(12).toString("hex")}`;
      await prisma.booking.update({
        where: { id: bookingId },
        data: { guestRequestToken, updatedAt: new Date() },
      });
    }

    const baseUrl = getEmailBaseUrl().replace(/\/$/, "");
    const inviteUrl = joinBaseUrl(baseUrl, guestRequestPath(guestRequestToken));
    const displayName = getDisplayName(booking.name) || booking.name;
    const isWedding = (booking.eventType || "").toLowerCase() === "wedding";
    const formattedDate = new Date(booking.eventDate).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const subject = isWedding
      ? `Add your song requests for ${displayName}'s wedding!`
      : `Add your song requests for ${displayName}'s event`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin: 0; padding: 0; background-color: #f8f8f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; padding: 40px 20px;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <tr>
                <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px 40px; text-align: center;">
                  ${EMAIL_LOGO_HTML_DARK}
                </td>
              </tr>
              <tr><td style="background: linear-gradient(90deg, #D4AF37 0%, #F4D03F 50%, #D4AF37 100%); height: 4px;"></td></tr>
              <tr>
                <td style="padding: 40px;">
                  <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin: 0 0 24px 0; text-align: center;">
                    Add your song requests!
                  </h1>
                  <p style="font-size: 16px; color: #333333; line-height: 1.8; margin: 0 0 16px 0;">
                    ${displayName} would love your input on the music for their ${isWedding ? "wedding" : "event"}.
                  </p>
                  <p style="font-size: 16px; color: #333333; line-height: 1.8; margin: 0 0 24px 0;">
                    ${booking.venueName ? `${formattedDate} at ${booking.venueName}` : formattedDate}
                  </p>
                  <p style="font-size: 16px; color: #333333; line-height: 1.8; margin: 0 0 24px 0;">
                    Add up to 3 song ideas — nothing plays without their approval.
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                    <tr><td align="center">
                      <a href="${inviteUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #D4AF37 0%, #B8960C 100%); color: #1a1a1a; text-decoration: none; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 4px;">
                        Add your song requests
                      </a>
                    </td></tr>
                  </table>
                  <p style="font-size: 12px; color: #888888; margin: 24px 0 0 0;">
                    This link closes automatically after the event.
                  </p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `;

    const config = getResendConfig("booking");
    const resend = new Resend(apiKey);

    const batches: string[][] = [];
    for (let i = 0; i < emailsToSend.length; i += BATCH_SIZE) {
      batches.push(emailsToSend.slice(i, i + BATCH_SIZE));
    }

    let sent = 0;
    for (let i = 0; i < batches.length; i++) {
      const batchEmails = batches[i].map((email) => ({
        from: config.from,
        to: [email],
        subject,
        html,
      }));

      const result = await resend.batch.send(batchEmails);
      if (result.error) {
        console.error("[send-guest-invites] Resend batch error:", result.error);
        return NextResponse.json(
          { error: result.error.message || "Failed to send some emails", sent },
          { status: 500 }
        );
      }
      sent += batchEmails.length;

      if (i < batches.length - 1) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }

    return NextResponse.json({ sent });
  } catch (e) {
    console.error("[send-guest-invites]", e);
    return NextResponse.json(
      { error: (e as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
