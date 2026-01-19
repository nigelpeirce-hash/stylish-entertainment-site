/**
 * Booking Integrity Utilities
 * Handles booking conflict detection and email threading
 */

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import Fuse from "fuse.js";

/**
 * Generate a unique booking reference
 * Format: SE-YYYY-ShortID (e.g., SE-2024-A1B2C3)
 */
export function generateBookingReference(): string {
  const year = new Date().getFullYear();
  // Generate 6-character alphanumeric short ID
  const shortId = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase()
    .substring(0, 6);

  return `SE-${year}-${shortId}`;
}

/**
 * Find existing booking by fingerprint (date + postcode)
 * This is the core fingerprint check
 */
export async function findExistingBooking(
  eventDate: Date | string,
  venuePostcode: string | null | undefined
): Promise<{
  id: string;
  bookingReference: string | null;
  email: string;
  name: string;
  eventDate: Date;
  venueName: string;
  venuePostcode: string | null;
  authorizedSenders: string[];
} | null> {
  try {
    const normalizedPostcode = venuePostcode
      ? venuePostcode.toUpperCase().replace(/\s+/g, "").trim()
      : null;

    if (!normalizedPostcode) {
      return null;
    }

    const eventDateObj =
      eventDate instanceof Date ? eventDate : new Date(eventDate);

    const startOfDay = new Date(eventDateObj);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(eventDateObj);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await prisma.booking.findMany({
      where: {
        eventDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        venuePostcode: {
          contains: normalizedPostcode,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        bookingReference: true,
        email: true,
        name: true,
        eventDate: true,
        venueName: true,
        venuePostcode: true,
        authorizedSenders: true,
      },
      take: 1,
    });

    // Find exact postcode match
    const match = existingBookings.find((booking) => {
      const bookingPostcode = booking.venuePostcode
        ? booking.venuePostcode.toUpperCase().replace(/\s+/g, "").trim()
        : null;
      return bookingPostcode === normalizedPostcode;
    });

    return match || null;
  } catch (error: any) {
    console.error("Error finding existing booking:", error);
    return null;
  }
}

/**
 * Fuzzy name matching using Fuse.js
 * Returns similarity score (0-1, where 1 is exact match)
 */
function fuzzyMatchNames(name1: string, name2: string): number {
  const fuse = new Fuse([name1], {
    threshold: 0.6, // 0 = exact match, 1 = match anything
    includeScore: true,
  });

  const results = fuse.search(name2);
  if (results.length === 0) {
    return 0;
  }

  // Convert threshold score to similarity (lower threshold = higher similarity)
  return 1 - (results[0].score || 0);
}

/**
 * Check for booking conflicts with enhanced detection
 * - Date + Postcode match but different Email → POTENTIAL_DUPLICATE
 * - Name similar (fuzzy match) but different Postcode → NAME_MATCH_WARNING
 */
export async function checkForBookingConflicts(
  incomingEmail: string,
  incomingName: string,
  eventDate: Date | string,
  venuePostcode: string | null | undefined
): Promise<{
  status: "OK" | "POTENTIAL_DUPLICATE" | "NAME_MATCH_WARNING" | "NO_MATCH";
  existingBooking?: {
    id: string;
    bookingReference: string | null;
    email: string;
    name: string;
    eventDate: Date;
    venueName: string;
    venuePostcode: string | null;
    authorizedSenders: string[];
  } | null;
  nameSimilarity?: number;
}> {
  try {
    // Normalize inputs
    const normalizedEmail = incomingEmail.toLowerCase().trim();
    const normalizedName = incomingName.trim();
    const normalizedPostcode = venuePostcode
      ? venuePostcode.toUpperCase().replace(/\s+/g, "").trim()
      : null;

    // Check 1: Find existing booking by fingerprint (date + postcode)
    const existingBooking = await findExistingBooking(eventDate, venuePostcode);

    if (existingBooking) {
      const existingEmail = existingBooking.email.toLowerCase().trim();
      const allAuthorizedEmails = [
        existingEmail,
        ...(existingBooking.authorizedSenders || []).map((e) => e.toLowerCase().trim()),
      ];

      // Check if incoming email is authorized
      if (allAuthorizedEmails.includes(normalizedEmail)) {
        return {
          status: "OK",
          existingBooking,
        };
      }

      // Different email but same date + postcode → POTENTIAL_DUPLICATE
      return {
        status: "POTENTIAL_DUPLICATE",
        existingBooking,
      };
    }

    // Check 2: Fuzzy name matching (if postcode is different)
    if (venuePostcode) {
      const eventDateObj =
        eventDate instanceof Date ? eventDate : new Date(eventDate);

      const startOfDay = new Date(eventDateObj);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(eventDateObj);
      endOfDay.setHours(23, 59, 59, 999);

      // Search for bookings on same date with different postcodes
      const sameDateBookings = await prisma.booking.findMany({
        where: {
          eventDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
          venuePostcode: {
            not: {
              contains: normalizedPostcode,
              mode: "insensitive",
            },
          },
        },
        select: {
          id: true,
          bookingReference: true,
          email: true,
          name: true,
          eventDate: true,
          venueName: true,
          venuePostcode: true,
          authorizedSenders: true,
        },
        take: 10,
      });

      // Check name similarity
      for (const booking of sameDateBookings) {
        const similarity = fuzzyMatchNames(normalizedName, booking.name);
        if (similarity > 0.7) {
          // 70% similarity threshold
          return {
            status: "NAME_MATCH_WARNING",
            existingBooking: {
              id: booking.id,
              bookingReference: booking.bookingReference || null,
              email: booking.email,
              name: booking.name,
              eventDate: booking.eventDate,
              venueName: booking.venueName,
              venuePostcode: booking.venuePostcode,
              authorizedSenders: booking.authorizedSenders || [],
            },
            nameSimilarity: similarity,
          };
        }
      }
    }

    // No conflicts found
    return {
      status: "NO_MATCH",
    };
  } catch (error: any) {
    console.error("Error checking booking conflicts:", error);
    // On error, allow booking (fail open)
    return {
      status: "NO_MATCH",
    };
  }
}

/**
 * Get count of unresolved conflicts
 */
export async function getUnresolvedConflictsCount(): Promise<number> {
  try {
    const count = await prisma.booking.count({
      where: {
        conflictStatus: "pending",
      },
    });
    return count;
  } catch (error: any) {
    console.error("Error getting unresolved conflicts count:", error);
    return 0;
  }
}

/**
 * Generate message ID for email threading
 * Format: <booking_reference@stylishentertainment.co.uk>
 */
export function generateMessageId(bookingReference: string): string {
  const domain =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "") ||
    "stylishentertainment.co.uk";
  return `<${bookingReference}@${domain}>`;
}

/**
 * Get threading headers for email
 * Returns In-Reply-To and References headers for proper email threading
 */
export function getThreadingHeaders(bookingReference: string, parentMessageId?: string): {
  "In-Reply-To"?: string;
  "References"?: string;
  "Thread-ID"?: string;
} {
  const messageId = generateMessageId(bookingReference);

  const headers: {
    "In-Reply-To"?: string;
    "References"?: string;
    "Thread-ID"?: string;
  } = {
    "Thread-ID": bookingReference, // Add Thread-ID header
  };

  if (parentMessageId) {
    // Replying to an existing email
    headers["In-Reply-To"] = parentMessageId;
    headers["References"] = parentMessageId;
  } else {
    // New conversation - use booking reference as thread starter
    headers["References"] = messageId;
  }

  return headers;
}

/**
 * Generate Thread-ID footer for email
 */
export function generateThreadIdFooter(bookingReference: string): string {
  return `
    <div style="display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; font-size: 0; line-height: 0; overflow: hidden;">
      Thread-ID: ${bookingReference}
      Booking-Reference: ${bookingReference}
    </div>
  `;
}

/**
 * Update booking with generated reference if missing
 */
export async function ensureBookingReference(bookingId: string): Promise<string | null> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, bookingReference: true },
    });

    if (!booking) {
      return null;
    }

    // If reference exists, return it
    if (booking.bookingReference) {
      return booking.bookingReference;
    }

    // Generate and save new reference
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const reference = generateBookingReference();

      try {
        const updated = await prisma.booking.update({
          where: { id: bookingId },
          data: { bookingReference: reference },
          select: { bookingReference: true },
        });

        return updated.bookingReference;
      } catch (error: any) {
        // If unique constraint violation, try again
        if (error.code === "P2002" && attempts < maxAttempts - 1) {
          attempts++;
          continue;
        }
        throw error;
      }
    }

    return null;
  } catch (error: any) {
    console.error("Error ensuring booking reference:", error);
    return null;
  }
}
