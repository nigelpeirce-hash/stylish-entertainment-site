/**
 * Email Template Utilities
 * Handles locked event data, venue formatting, and template population
 */

import { prisma } from "@/lib/prisma";
import Mustache from "mustache";
import { generateThreadIdFooter } from "@/lib/booking-integrity";

/**
 * Fetch locked event details for a booking
 * Joins booking data with venue information and contract data
 */
export async function fetchLockedEventData(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        staffAssignments: {
          include: {
            staff: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Check if event is locked (confirmed or locked status)
    const isLocked = booking.status === "confirmed" || booking.status === "locked";

    // Format venue address
    const formattedVenue = formatVenueAddress({
      venueName: booking.venueName,
      venueAddress: booking.venueAddress,
      venueAddress2: booking.venueAddress2,
      venueTown: booking.venueTown,
      venueCounty: booking.venueCounty,
      venuePostcode: booking.venuePostcode,
    });

    // Get talent type (DJ name or service type)
    const talentType = booking.assignedDJName || 
                       booking.preferredDJ || 
                       (booking.services.length > 0 ? booking.services.join(", ") : "TBC");

    // Get contract fee (finalBalance or staff fee)
    const contractFee = booking.finalBalance || 
                       (booking.staffAssignments && booking.staffAssignments.length > 0
                         ? booking.staffAssignments[0].agreedFee.toString()
                         : null);

    // Format event date
    const formattedEventDate = booking.eventDate
      ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

    // Format event timings
    const eventTimings = [
      booking.djArrivalTime && `Arrival: ${booking.djArrivalTime}`,
      booking.djStartTime && `Start: ${booking.djStartTime}`,
      booking.djFinishTime && `Finish: ${booking.djFinishTime}`,
    ]
      .filter(Boolean)
      .join(" | ");

    return {
      isLocked,
      status: booking.status,
      contractData: {
        date: formattedEventDate,
        formattedVenue,
        fee: contractFee ? `£${parseFloat(contractFee).toLocaleString("en-GB")}` : "TBC",
        talentType,
        eventTimings: eventTimings || "TBC",
      },
      booking: {
        id: booking.id,
        name: booking.name,
        email: booking.email,
        eventType: booking.eventType,
        eventDate: booking.eventDate,
        venueName: booking.venueName,
        termsAccepted: booking.termsAccepted,
        termsAcceptedAt: booking.termsAcceptedAt,
        finalBalance: booking.finalBalance,
        preferredDJ: booking.preferredDJ,
        assignedDJName: booking.assignedDJName,
      },
    };
  } catch (error: any) {
    console.error("Error fetching locked event data:", error);
    throw error;
  }
}

/**
 * Format venue address from booking venue data
 * Handles both selected venue IDs (from VenueAsset table) and custom entries
 */
export function formatVenueAddress(venue: {
  venueName: string;
  venueAddress?: string | null;
  venueAddress2?: string | null;
  venueTown?: string | null;
  venueCounty?: string | null;
  venuePostcode?: string | null;
}): string {
  const parts: string[] = [];

  // Always include venue name
  parts.push(venue.venueName);

  // Add address line 1 if present
  if (venue.venueAddress) {
    parts.push(venue.venueAddress);
  }

  // Add address line 2 if present
  if (venue.venueAddress2) {
    parts.push(venue.venueAddress2);
  }

  // Build town/county/postcode line
  const townParts: string[] = [];
  if (venue.venueTown) {
    townParts.push(venue.venueTown);
  }
  if (venue.venueCounty) {
    townParts.push(venue.venueCounty);
  }
  if (venue.venuePostcode) {
    townParts.push(venue.venuePostcode);
  }
  
  if (townParts.length > 0) {
    parts.push(townParts.join(", "));
  }

  // If only venue name and postcode (custom entry), format more simply
  if (!venue.venueAddress && !venue.venueTown && venue.venuePostcode) {
    return `${venue.venueName}, ${venue.venuePostcode}`;
  }

  // Join all parts with line breaks for multi-line format
  // For email, use comma-separated single line
  return parts.join(", ");
}

/**
 * Get T&C link if terms are accepted
 * Returns null if terms not accepted
 */
export function getTCLink(termsAccepted: boolean, termsAcceptedAt: Date | null): string | null {
  if (!termsAccepted || !termsAcceptedAt) {
    return null;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylishentertainment.co.uk";
  return `${siteUrl}/terms-and-conditions`;
}

/**
 * Populate email template with locked event data
 * Uses Mustache to replace tokens in template HTML
 */
export function populateEmailTemplate(
  templateHtml: string,
  templateSubject: string,
  eventData: {
    contractData: {
      date: string | null;
      formattedVenue: string;
      fee: string;
      talentType: string;
      eventTimings: string;
    };
    booking: {
      name: string;
      email: string;
      eventType: string;
      venueName: string;
      termsAccepted: boolean;
      termsAcceptedAt: Date | null;
      preferredDJ?: string | null;
      assignedDJName?: string | null;
    };
  }
): { subject: string; html: string } {
  // Build template variables
  const variables: Record<string, any> = {
    // Client info
    clientName: eventData.booking.name,
    clientEmail: eventData.booking.email,

    // Contract data (locked)
    contractDate: eventData.contractData.date || "TBC",
    formattedVenue: eventData.contractData.formattedVenue,
    contractFee: eventData.contractData.fee,
    talentType: eventData.contractData.talentType,
    eventTimings: eventData.contractData.eventTimings,

    // Event info
    eventDate: eventData.contractData.date || "TBC",
    eventType: eventData.booking.eventType,
    venueName: eventData.booking.venueName,

    // Talent info
    djName: eventData.booking.assignedDJName || eventData.booking.preferredDJ || "TBC",
    djFee: eventData.contractData.fee,

    // T&C link (conditional)
    tc_link: getTCLink(eventData.booking.termsAccepted, eventData.booking.termsAcceptedAt) || "",
    
    // Booking reference for Thread-ID
    bookingReference: eventData.bookingReference || "",
  };

  // Only include tc_link in template if terms are accepted
  // Use Mustache conditional rendering
  const tcLinkSection = variables.tc_link
    ? `<p><a href="{{tc_link}}" style="color: #D4AF37; text-decoration: none;">View Terms & Conditions</a></p>`
    : "";

  // Replace tokens in template using Mustache
  const populatedHtml = Mustache.render(templateHtml, variables);

  // Replace tc_link conditional section
  // Remove Mustache conditional blocks if tc_link is empty
  let finalHtml = populatedHtml;
  if (!variables.tc_link) {
    // Remove {{#tc_link}}...{{/tc_link}} blocks
    finalHtml = populatedHtml.replace(/{{#tc_link}}[\s\S]*?{{\/tc_link}}/g, "");
  } else {
    // Replace {{#tc_link}} with actual link HTML
    finalHtml = populatedHtml.replace(/{{#tc_link}}([\s\S]*?){{\/tc_link}}/g, tcLinkSection);
  }

  // Add Thread-ID footer for email threading (invisible in email clients)
  // Extract booking reference from contract data if available
  const bookingReferenceMatch = finalHtml.match(/Booking-Reference:\s*([A-Z0-9-]+)/i);
  if (!bookingReferenceMatch) {
    // Try to get booking reference from the booking data
    // We'll need to pass this separately if not in template
  }

  const populatedSubject = Mustache.render(templateSubject, variables);

  return {
    subject: populatedSubject,
    html: finalHtml,
  };
}

/**
 * Validate event status before sending email
 * Returns warning if event is not locked/confirmed
 */
export function validateEventStatus(status: string): {
  isValid: boolean;
  warning: string | null;
} {
  const lockedStatuses = ["locked", "confirmed"];
  const isValid = lockedStatuses.includes(status.toLowerCase());

  if (!isValid) {
    return {
      isValid: false,
      warning: `Event status is "${status}" (not "Locked" or "Confirmed"). This email may contain preliminary data that could change. Proceed anyway?`,
    };
  }

  return {
    isValid: true,
    warning: null,
  };
}
