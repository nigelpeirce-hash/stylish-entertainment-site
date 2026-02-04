"use client";

import { toSafeReactChild } from "@/lib/transformers/booking-transformer";

/**
 * Wraps any value and guarantees it is safe for React children.
 * Use for ANY value that might be an object (e.g. booking.fee, { fee: 150 }).
 * Prevents "Objects are not valid as a React child" errors.
 */
export function SafeText({ children }: { children: unknown }) {
  return <>{toSafeReactChild(children)}</>;
}
