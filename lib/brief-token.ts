import { randomBytes } from "crypto";

/**
 * Generate a secure random token for brief confirmation links
 * Format: base64url encoded random bytes (32 bytes = 43 characters)
 */
export function generateBriefToken(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * Validate token format (basic check)
 */
export function isValidTokenFormat(token: string): boolean {
  // Base64url format: alphanumeric, -, _ characters, typically 32-43 chars
  return /^[A-Za-z0-9_-]{32,}$/.test(token);
}
