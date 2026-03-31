import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getResendConfig } from "@/lib/email-config";
import {
  checkPublicFormRateLimit,
  getClientIp,
  isSafeReplyToEmail,
  rejectIfTooLong,
  sanitizeSubjectUserPart,
} from "@/lib/public-form-security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXT = [".pdf", ".doc", ".docx", ".txt"] as const;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/octet-stream", // common when browsers omit a specific MIME for .pdf/.docx
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

/** http(s) URLs only — turns Spotify etc. into clickable links in the HTML email */
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
            const href = u.href;
            parts.push(
              `<a href="${escapeHtmlAttr(href)}" style="color:#0f6cbf;text-decoration:underline;word-break:break-all;">${escapeHtml(raw)}</a>`
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

/**
 * POST multipart/form — Babington wedding clients: DJ final details to info@.
 * Honeypot: companyWebsite (must be empty).
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkPublicFormRateLimit("babington-dj-final-details", ip).ok) {
    console.warn("[babington-dj-final-details] rate limit", { route: "babington-dj-final-details", ip });
    return NextResponse.json(
      { error: "Too many submissions from this network. Please wait and try again." },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const honeypot = formData.get("companyWebsite");
    if (honeypot != null && String(honeypot).trim() !== "") {
      return NextResponse.json({ success: true, message: "Thank you." });
    }

    const happyCouple = String(formData.get("happyCouple") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const weddingDate = String(formData.get("weddingDate") ?? "").trim();
    const numberOfGuestsRaw = formData.get("numberOfGuests");
    const ceremonyTime = String(formData.get("ceremonyTime") ?? "").trim();
    const firstDance = String(formData.get("firstDance") ?? "").trim();
    const lastSong = String(formData.get("lastSong") ?? "").trim();
    const musicRequests = String(formData.get("musicRequests") ?? "").trim();
    const dislikes = String(formData.get("dislikes") ?? "").trim();
    const notesToDJ = String(formData.get("notesToDJ") ?? "").trim();
    const otherItemsBooked = String(formData.get("otherItemsBooked") ?? "").trim();
    const file = formData.get("musicAttachment");

    if (!happyCouple || happyCouple.length < 2) {
      return NextResponse.json(
        { error: "Please enter the happy couple's names (at least 2 characters)." },
        { status: 400 }
      );
    }
    if (!email || !isSafeReplyToEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const babingtonLengthChecks: [string, string, number][] = [
      [happyCouple, "Happy couple", 200],
      [weddingDate, "Wedding date", 32],
      [ceremonyTime, "Ceremony time", 80],
      [firstDance, "First dance", 300],
      [lastSong, "Last song", 300],
      [musicRequests, "Music requests", 8000],
      [dislikes, "Dislikes", 8000],
      [notesToDJ, "Notes for the DJ", 8000],
      [otherItemsBooked, "Other items booked", 8000],
    ];
    for (const [val, label, max] of babingtonLengthChecks) {
      const lenErr = rejectIfTooLong(val, max, label);
      if (lenErr) {
        return NextResponse.json({ error: lenErr }, { status: 400 });
      }
    }
    if (!weddingDate) {
      return NextResponse.json({ error: "Please choose your wedding date." }, { status: 400 });
    }
    const parsedWedding = new Date(weddingDate);
    if (Number.isNaN(parsedWedding.getTime())) {
      return NextResponse.json({ error: "Please enter a valid wedding date." }, { status: 400 });
    }

    const numberOfGuestsStr = String(numberOfGuestsRaw ?? "").trim();
    const numberOfGuests = parseInt(numberOfGuestsStr, 10);
    if (
      !numberOfGuestsStr ||
      Number.isNaN(numberOfGuests) ||
      numberOfGuests < 1 ||
      numberOfGuests > 2000
    ) {
      return NextResponse.json(
        { error: "Please enter a number of guests between 1 and 2000." },
        { status: 400 }
      );
    }

    if (!ceremonyTime) {
      return NextResponse.json({ error: "Please enter the ceremony time." }, { status: 400 });
    }
    if (!firstDance) {
      return NextResponse.json({ error: "Please enter your first dance (song or plan)." }, { status: 400 });
    }
    if (!lastSong) {
      return NextResponse.json({ error: "Please enter your last song." }, { status: 400 });
    }

    const hasFile = file instanceof File && file.size > 0;
    if (!musicRequests && !hasFile) {
      return NextResponse.json(
        {
          error:
            "Please add music requests in the text box and/or attach a file (e.g. playlist notes, PDF, or Word doc).",
        },
        { status: 400 }
      );
    }

    let attachment: { filename: string; contentBase64: string; byteLength: number } | undefined;

    if (hasFile && file instanceof File) {
      if (file.name.length > 240) {
        return NextResponse.json({ error: "Attachment filename is too long." }, { status: 400 });
      }
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { error: "The attachment is too large. Maximum size is 10MB." },
          { status: 400 }
        );
      }
      const e = fileExt(file.name);
      if (!(ALLOWED_EXT as readonly string[]).includes(e)) {
        return NextResponse.json(
          {
            error: "Please upload a PDF, Word document (.doc, .docx), or plain text (.txt).",
          },
          { status: 400 }
        );
      }
      const mime = file.type || "";
      if (mime && !ALLOWED_TYPES.has(mime)) {
        return NextResponse.json(
          { error: "That file type is not allowed. Please use PDF, Word, or .txt." },
          { status: 400 }
        );
      }
      const arrayBuffer = await file.arrayBuffer();
      const buf = Buffer.from(arrayBuffer);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
      const filename = safeName || `attachment${e}`;
      const contentBase64 = buf.toString("base64");
      attachment = {
        filename,
        contentBase64,
        byteLength: buf.length,
      };
    }

    const resend = getResend();
    const recipientEmail = process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk";
    const backupEmail = process.env.NOTIFICATION_EMAIL;
    const toList = [recipientEmail, ...(backupEmail && backupEmail !== recipientEmail ? [backupEmail] : [])];

    const emailConfig = getResendConfig("booking");

    const weddingDateLabel = parsedWedding.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const rowDefs: { label: string; value: string; linkify: boolean }[] = [
      { label: "Happy couple", value: happyCouple, linkify: false },
      { label: "Email", value: email, linkify: false },
      { label: "Wedding date", value: weddingDateLabel, linkify: false },
      { label: "Number of guests", value: String(numberOfGuests), linkify: false },
      { label: "Ceremony time", value: ceremonyTime, linkify: false },
      { label: "First dance", value: firstDance, linkify: false },
      { label: "Last song", value: lastSong, linkify: false },
      {
        label: "Music requests",
        value: musicRequests || "— (see attachment if provided)",
        linkify: Boolean(musicRequests),
      },
      { label: "Dislikes", value: dislikes || "—", linkify: Boolean(dislikes) },
      { label: "Other notes for the DJ", value: notesToDJ || "—", linkify: Boolean(notesToDJ) },
      {
        label: "Confirm any other items booked",
        value: otherItemsBooked || "—",
        linkify: Boolean(otherItemsBooked),
      },
    ];

    const fieldHtml = rowDefs
      .map(
        ({ label, value, linkify }) => `
          <div style="margin-bottom:14px;">
            <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#666;margin-bottom:4px;">${escapeHtml(label)}</div>
            <div style="font-size:15px;color:#1a1a1a;line-height:1.5;">${fieldValueToHtml(value, linkify)}</div>
          </div>
        `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html><head><meta charset="utf-8"/></head>
      <body style="font-family:Georgia,'Times New Roman',serif;background:#f5f5f5;margin:0;padding:24px;">
        <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:8px;padding:32px;border:1px solid #e8e0d0;">
          <h1 style="font-size:22px;color:#1a1a1a;margin:0 0 8px;border-bottom:2px solid #D4AF37;padding-bottom:12px;">
            Babington — DJ final details
          </h1>
          <p style="color:#555;font-size:14px;margin:0 0 24px;">Submitted via the client form on stylishentertainment.co.uk</p>
          ${fieldHtml}
          ${
            attachment
              ? `<p style="margin-top:20px;font-size:14px;color:#333;line-height:1.5;"><strong>Attachment:</strong> ${escapeHtml(attachment.filename)}<br/><span style="font-size:13px;color:#555;">The file should appear as an attachment on this email (look for the paperclip in your inbox). If you do not see it, check spam or ask the sender to resubmit.</span></p>`
              : ""
          }
        </div>
      </body></html>
    `;

    const textBody =
      rowDefs.map(({ label, value }) => `${label}: ${value.replace(/\n/g, " ")}`).join("\n") +
      (attachment ? `\n\nAttachment (see email attachments): ${attachment.filename}` : "");

    if (!resend) {
      console.error("[babington-dj-final-details] Resend not configured");
      return NextResponse.json(
        {
          error:
            "We're sorry — email could not be sent right now. Please try again later or email info@stylishentertainment.co.uk.",
        },
        { status: 503 }
      );
    }

    /**
     * Resend Node SDK: parseEmailToApiOptions → JSON.stringify → POST /emails.
     * Attachments must be serializable; use base64 string for `content` only (docs:
     * https://resend.com/docs/dashboard/emails/attachments — filename + content).
     * Omit contentType so MIME is derived from filename (conservative / known-good).
     */
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
      subject: `Babington DJ final details — ${sanitizeSubjectUserPart(happyCouple)} — ${sanitizeSubjectUserPart(weddingDateLabel)}`,
      html,
      text: textBody,
    };

    if (attachment) {
      sendPayload.attachments = [{ filename: attachment.filename, content: attachment.contentBase64 }];
    }

    const result = await resend.emails.send(sendPayload);

    if (result.error) {
      console.error("[babington-dj-final-details] Resend error:", JSON.stringify(result.error));
      return NextResponse.json(
        {
          error:
            "We couldn't send your details. Please try again or email info@stylishentertainment.co.uk directly.",
        },
        { status: 502 }
      );
    }

    const messageId = result.data?.id;
    if (!messageId) {
      console.error("[babington-dj-final-details] Resend success without message id");
      return NextResponse.json(
        {
          error:
            "We could not confirm the email was sent. Please try again or email info@stylishentertainment.co.uk.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, messageId });
  } catch (err) {
    console.error("[babington-dj-final-details] unhandled", err instanceof Error ? err.message : "error");
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
