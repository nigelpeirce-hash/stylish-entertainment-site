/**
 * HMAC-signed token for /book-dj?quote= flow.
 * Carries bookingId + artist names from the quote so the form can prefill and show "which artist to book".
 */

import { createHmac } from "crypto";

const ALG = "sha256";
const EXP_DAYS = 60;
const TOKEN_SECRET =
  process.env.QUOTE_TOKEN_SECRET || process.env.NEXTAUTH_SECRET || "book-dj-quote-fallback";

export interface BookDJQuotePayload {
  bookingId: string;
  artistNames: string[];
  exp: number;
}

function base64UrlEncode(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Buffer {
  let b = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b.length % 4;
  if (pad) b += "=".repeat(4 - pad);
  return Buffer.from(b, "base64");
}

function sign(payload: string): Buffer {
  return createHmac(ALG, TOKEN_SECRET).update(payload).digest();
}

export function createBookDJQuoteToken(payload: {
  bookingId: string;
  artistNames: string[];
}): string {
  const exp = Math.floor(Date.now() / 1000) + EXP_DAYS * 24 * 60 * 60;
  const data: BookDJQuotePayload = { ...payload, exp };
  const payloadStr = JSON.stringify(data);
  const payloadB64 = base64UrlEncode(Buffer.from(payloadStr, "utf8"));
  const sig = sign(payloadB64);
  const sigB64 = base64UrlEncode(sig);
  return `${payloadB64}.${sigB64}`;
}

export function verifyBookDJQuoteToken(token: string): BookDJQuotePayload | null {
  try {
    const [payloadB64, sigB64] = token.split(".");
    if (!payloadB64 || !sigB64) return null;
    const expected = sign(payloadB64);
    const actual = base64UrlDecode(sigB64);
    if (expected.length !== actual.length || !expected.equals(actual)) return null;
    const raw = base64UrlDecode(payloadB64).toString("utf8");
    const data = JSON.parse(raw) as BookDJQuotePayload;
    if (typeof data.exp !== "number" || data.exp < Math.floor(Date.now() / 1000)) return null;
    if (!data.bookingId || !Array.isArray(data.artistNames)) return null;
    return data;
  } catch {
    return null;
  }
}
