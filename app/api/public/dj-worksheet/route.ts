import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getResendConfig } from "@/lib/email-config";
import {
  checkPublicFormRateLimit,
  getClientIp,
  isReasonableTimeField,
  isSafeReplyToEmail,
  rejectIfTooLong,
  sanitizeSubjectUserPart,
} from "@/lib/public-form-security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXT = [".pdf", ".doc", ".docx", ".txt", ".xls", ".xlsx"] as const;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/octet-stream",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx") return null;
  if (!apiKey.startsWith("re_") || apiKey.length < 35) return null;
  return new Resend(apiKey);
}

function fileExt(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeHtmlAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const URL_IN_TEXT_RE = /https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/gi;

function linkifyMultilineToHtml(text: string): string {
  const lines = text.split("\n");
  return lines
    .map((line) => {
      const parts: string[] = [];
      let last = 0;
      const re = new RegExp(URL_IN_TEXT_RE.source, URL_IN_TEXT_RE.flags);
      let m: RegExpExecArray | null;
      while ((m = re.exec(line)) !== null) {
        parts.push(escapeHtml(line.slice(last, m.index)));
        const raw = m[0];
        try {
          const u = new URL(raw);
          if (u.protocol === "http:" || u.protocol === "https:") {
            parts.push(
              `<a href="${escapeHtmlAttr(u.href)}" style="color:#0f6cbf;text-decoration:underline;word-break:break-all;">${escapeHtml(raw)}</a>`
            );
          } else {
            parts.push(escapeHtml(raw));
          }
        } catch {
          parts.push(escapeHtml(raw));
        }
        last = m.index + raw.length;
      }
      parts.push(escapeHtml(line.slice(last)));
      return parts.join("");
    })
    .join("<br>");
}

function fieldValueToHtml(value: string, linkify: boolean): string {
  const v = value || "—";
  if (!linkify) return escapeHtml(v).replace(/\n/g, "<br>");
  return linkifyMultilineToHtml(v);
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/**
 * POST multipart/form — DJ worksheet → info@ (honeypot: wsHp — must stay empty; avoid "website" naming or autofill fires and skips send).
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkPublicFormRateLimit("dj-worksheet", ip).ok) {
    console.warn("[dj-worksheet] rate limit", { route: "dj-worksheet", ip });
    return NextResponse.json(
      { error: "Too many submissions from this network. Please wait and try again." },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    if (str(formData, "wsHp") !== "") {
      return NextResponse.json({ success: true, message: "Thank you." });
    }

    const happyCouple1 = str(formData, "happyCouple1");
    const happyCouple2 = str(formData, "happyCouple2");
    const email = str(formData, "email");
    const weddingDate = str(formData, "weddingDate");
    const clientPhone = str(formData, "clientPhone");
    const venueName = str(formData, "venueName");
    const venueContact = str(formData, "venueContact");
    const venueAddress = str(formData, "venueAddress");
    const venueAddress2 = str(formData, "venueAddress2");
    const venueTown = str(formData, "venueTown");
    const venueCounty = str(formData, "venueCounty");
    const venuePostcode = str(formData, "venuePostcode");
    const djSectionPhone = str(formData, "djSectionPhone");
    const djArrivalTime = str(formData, "djArrivalTime");
    const djStartFinishTime = str(formData, "djStartFinishTime");
    const djSetupLocation = str(formData, "djSetupLocation");
    const djParking = str(formData, "djParking");
    const soundLimiter = str(formData, "soundLimiter");
    const numberOfGuests = str(formData, "numberOfGuests");
    const finalBalance = str(formData, "finalBalance");
    const musicNotesToDJ = str(formData, "musicNotesToDJ");
    const musicNotesToStylish = str(formData, "musicNotesToStylish");
    const firstDance = str(formData, "firstDance");
    const lastSong = str(formData, "lastSong");
    const musicDislikes = str(formData, "musicDislikes");
    const musicRequests = str(formData, "musicRequests");
    const file = formData.get("musicAttachment");

    if (!happyCouple1 || !happyCouple2) {
      return NextResponse.json({ error: "Please complete both Happy Couple name fields." }, { status: 400 });
    }
    if (!email || !isSafeReplyToEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const lengthChecks: [string, string, number][] = [
      [happyCouple1, "Happy couple (first name)", 120],
      [happyCouple2, "Happy couple (second name)", 120],
      [weddingDate, "Wedding date", 32],
      [clientPhone, "Phone number", 48],
      [venueName, "Venue name", 200],
      [venueContact, "Venue contact", 200],
      [venueAddress, "Venue address", 500],
      [venueAddress2, "Venue address", 500],
      [venueTown, "Town", 120],
      [venueCounty, "County", 120],
      [venuePostcode, "Post code", 24],
      [djSectionPhone, "Phone number", 48],
      [djArrivalTime, "DJ arrival time", 16],
      [djStartFinishTime, "DJ start and finish time", 120],
      [djSetupLocation, "DJ setup location", 500],
      [djParking, "DJ parking", 500],
      [soundLimiter, "Sound limiter", 8],
      [numberOfGuests, "Number of guests", 12],
      [finalBalance, "Final balance", 200],
      [musicNotesToDJ, "Notes to the DJ", 8000],
      [musicNotesToStylish, "Notes to STYLISH Entertainment", 8000],
      [firstDance, "First dance", 300],
      [lastSong, "Last song", 300],
      [musicDislikes, "Dislikes", 8000],
      [musicRequests, "Music requests", 8000],
    ];
    for (const [val, label, max] of lengthChecks) {
      const lenErr = rejectIfTooLong(val, max, label);
      if (lenErr) {
        return NextResponse.json({ error: lenErr }, { status: 400 });
      }
    }

    if (soundLimiter && soundLimiter !== "Yes" && soundLimiter !== "No") {
      return NextResponse.json({ error: "Invalid sound limiter selection." }, { status: 400 });
    }
    if (!isReasonableTimeField(djArrivalTime, 16)) {
      return NextResponse.json({ error: "Please enter a valid DJ arrival time." }, { status: 400 });
    }
    if (!weddingDate) {
      return NextResponse.json({ error: "Please enter your wedding date." }, { status: 400 });
    }
    const parsedWedding = new Date(weddingDate);
    if (Number.isNaN(parsedWedding.getTime())) {
      return NextResponse.json({ error: "Please enter a valid wedding date." }, { status: 400 });
    }
    if (!venueName) {
      return NextResponse.json({ error: "Please enter the venue name." }, { status: 400 });
    }
    if (!venueAddress) {
      return NextResponse.json({ error: "Please enter the venue address." }, { status: 400 });
    }
    if (!venuePostcode) {
      return NextResponse.json({ error: "Please enter the venue post code." }, { status: 400 });
    }
    if (!djArrivalTime) {
      return NextResponse.json({ error: "Please enter DJ arrival time." }, { status: 400 });
    }
    if (!djStartFinishTime) {
      return NextResponse.json({ error: "Please enter DJ start and finish time." }, { status: 400 });
    }
    if (!finalBalance) {
      return NextResponse.json({ error: "Please enter the final balance." }, { status: 400 });
    }

    const hasFile = file instanceof File && file.size > 0;
    let attachment: { filename: string; contentBase64: string; byteLength: number } | undefined;

    if (hasFile && file instanceof File) {
      if (file.name.length > 240) {
        return NextResponse.json({ error: "Attachment filename is too long." }, { status: 400 });
      }
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: "Attachment too large. Maximum size is 10MB." }, { status: 400 });
      }
      const e = fileExt(file.name);
      if (!(ALLOWED_EXT as readonly string[]).includes(e)) {
        return NextResponse.json(
          { error: "Please upload Excel (.xls, .xlsx), Word (.doc, .docx), PDF, or .txt." },
          { status: 400 }
        );
      }
      const mime = file.type || "";
      if (mime && !ALLOWED_TYPES.has(mime)) {
        return NextResponse.json({ error: "That file type is not allowed." }, { status: 400 });
      }
      const buf = Buffer.from(await file.arrayBuffer());
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
      const filename = safeName || `attachment${e}`;
      attachment = { filename, contentBase64: buf.toString("base64"), byteLength: buf.length };
    }

    const weddingDateLabel = parsedWedding.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const happyCoupleLabel = `${happyCouple1} & ${happyCouple2}`;

    const rowDefs: { label: string; value: string; linkify: boolean }[] = [
      { label: "Happy couple", value: happyCoupleLabel, linkify: false },
      { label: "Email", value: email, linkify: false },
      { label: "Wedding date", value: weddingDateLabel, linkify: false },
      { label: "Your phone number", value: clientPhone || "—", linkify: false },
      { label: "Venue name", value: venueName, linkify: false },
      { label: "Venue contact", value: venueContact || "—", linkify: false },
      { label: "Venue address", value: venueAddress, linkify: false },
      { label: "Venue address 2", value: venueAddress2 || "—", linkify: false },
      { label: "Town", value: venueTown || "—", linkify: false },
      { label: "County", value: venueCounty || "—", linkify: false },
      { label: "Post code", value: venuePostcode, linkify: false },
      { label: "Phone number (DJ section)", value: djSectionPhone || "—", linkify: false },
      { label: "DJ arrival time", value: djArrivalTime, linkify: false },
      { label: "DJ start and finish time", value: djStartFinishTime, linkify: false },
      { label: "DJ setup location", value: djSetupLocation || "—", linkify: Boolean(djSetupLocation) },
      { label: "DJ parking", value: djParking || "—", linkify: Boolean(djParking) },
      { label: "Sound limiter", value: soundLimiter || "—", linkify: false },
      { label: "Number of guests", value: numberOfGuests || "—", linkify: false },
      { label: "Final balance", value: finalBalance, linkify: false },
      { label: "First dance", value: firstDance || "—", linkify: false },
      { label: "Last song", value: lastSong || "—", linkify: false },
      {
        label: "Dislikes (genres or tracks)",
        value: musicDislikes || "—",
        linkify: Boolean(musicDislikes),
      },
      { label: "Music requests", value: musicRequests || "—", linkify: Boolean(musicRequests) },
      { label: "Notes to the DJ", value: musicNotesToDJ || "—", linkify: Boolean(musicNotesToDJ) },
      {
        label: "Notes to STYLISH Entertainment",
        value: musicNotesToStylish || "—",
        linkify: Boolean(musicNotesToStylish),
      },
    ];

    const fieldHtml = rowDefs
      .map(
        ({ label, value, linkify }) => `
          <div style="margin-bottom:12px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#666;margin-bottom:4px;">${escapeHtml(label)}</div>
            <div style="font-size:15px;color:#1a1a1a;line-height:1.5;">${fieldValueToHtml(value, linkify)}</div>
          </div>
        `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html><head><meta charset="utf-8"/></head>
      <body style="font-family:Georgia,'Times New Roman',serif;background:#f5f5f5;margin:0;padding:24px;">
        <div style="max-width:720px;margin:0 auto;background:#fff;border-radius:8px;padding:28px;border:1px solid #e8e0d0;">
          <h1 style="font-size:22px;color:#1a1a1a;margin:0 0 8px;border-bottom:2px solid #D4AF37;padding-bottom:12px;">
            DJ worksheet
          </h1>
          <p style="color:#555;font-size:14px;margin:0 0 20px;">Submitted via stylishentertainment.co.uk/dj-worksheet</p>
          ${fieldHtml}
          ${
            attachment
              ? `<p style="margin-top:16px;font-size:14px;color:#333;"><strong>Attachment:</strong> ${escapeHtml(attachment.filename)}</p>`
              : ""
          }
        </div>
      </body></html>
    `;

    const textBody =
      rowDefs.map(({ label, value }) => `${label}: ${value.replace(/\n/g, " ")}`).join("\n") +
      (attachment ? `\n\nAttachment: ${attachment.filename}` : "");

    const resend = getResend();
    if (!resend) {
      return NextResponse.json(
        {
          error:
            "Email could not be sent right now. Please try again later or email info@stylishentertainment.co.uk.",
        },
        { status: 503 }
      );
    }

    const recipientEmail = process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk";
    const backupEmail = process.env.NOTIFICATION_EMAIL;
    const toList = [recipientEmail, ...(backupEmail && backupEmail !== recipientEmail ? [backupEmail] : [])];
    const emailConfig = getResendConfig("dj_worksheet");

    const sendPayload: {
      from: string;
      replyTo: string;
      to: string[];
      subject: string;
      html: string;
      text: string;
      attachments?: Array<{ filename: string; content: string }>;
    } = {
      from: emailConfig.from,
      replyTo: email,
      to: toList,
      subject: `DJ worksheet — ${sanitizeSubjectUserPart(happyCoupleLabel)} — ${sanitizeSubjectUserPart(weddingDateLabel)}`,
      html,
      text: textBody,
    };

    if (attachment) {
      sendPayload.attachments = [{ filename: attachment.filename, content: attachment.contentBase64 }];
    }

    const result = await resend.emails.send(sendPayload);
    if (result.error) {
      console.error("[dj-worksheet] Resend error:", JSON.stringify(result.error));
      return NextResponse.json(
        { error: "We could not send your worksheet. Please try again or email us directly." },
        { status: 502 }
      );
    }

    const messageId = result.data?.id;
    if (!messageId) {
      console.error("[dj-worksheet] Resend returned success but no message id", JSON.stringify(result.data));
      return NextResponse.json(
        { error: "We could not confirm the email was sent. Please try again or email info@stylishentertainment.co.uk." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, messageId });
  } catch (err) {
    console.error("[dj-worksheet] unhandled", err instanceof Error ? err.message : "error");
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
