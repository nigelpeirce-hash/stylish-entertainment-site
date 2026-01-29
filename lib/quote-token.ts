/**
 * HMAC-signed quote tokens for Book-from-Quote flow.
 * Used by sandbox (test tokens) and, when enabled, by DJ/artist quote emails.
 * No JWT dependency – uses Node crypto.
 */

import { createHmac } from "crypto";

const ALG = "sha256";
const EXP_DAYS = 60;
const TOKEN_SECRET = process.env.QUOTE_TOKEN_SECRET || process.env.NEXTAUTH_SECRET || "quote-token-fallback";

export interface QuoteTokenPayload {
  bookingId: string;
  clientEmail: string;
  artistType: "dj" | "musician";
  staffId?: string;
  fee?: number;
  artistName?: string;
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

function sign(payload: string): string {
  return createHmac(ALG, TOKEN_SECRET).update(payload).digest();
}

export function createQuoteToken(payload: Omit<QuoteTokenPayload, "exp">): string {
  const exp = Math.floor(Date.now() / 1000) + EXP_DAYS * 24 * 60 * 60;
  const data: QuoteTokenPayload = { ...payload, exp };
  const payloadStr = JSON.stringify(data);
  const payloadB64 = base64UrlEncode(Buffer.from(payloadStr, "utf8"));
  const sig = sign(payloadB64);
  const sigB64 = base64UrlEncode(sig);
  return `${payloadB64}.${sigB64}`;
}

export function verifyQuoteToken(token: string): QuoteTokenPayload | null {
  try {
    const [payloadB64, sigB64] = token.split(".");
    if (!payloadB64 || !sigB64) return null;
    const expected = sign(payloadB64);
    const actual = base64UrlDecode(sigB64);
    if (expected.length !== actual.length || !expected.equals(actual)) return null;
    const raw = base64UrlDecode(payloadB64).toString("utf8");
    const data = JSON.parse(raw) as QuoteTokenPayload;
    if (typeof data.exp !== "number" || data.exp < Math.floor(Date.now() / 1000)) return null;
    if (!data.bookingId || !data.clientEmail || !data.artistType) return null;
    return data;
  } catch {
    return null;
  }
}
