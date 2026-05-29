import type { NewEnquiry, Booking } from "@prisma/client";

type EnquiryWithBooking = NewEnquiry & {
  Booking?: Pick<Booking, "id" | "name" | "eventDate" | "venueName" | "venuePostcode"> | null;
};

/** Prisma relation is `Booking`; admin UI expects `originalBooking`. */
export function serializeNewEnquiry(enquiry: EnquiryWithBooking) {
  const { Booking: linkedBooking, ...rest } = enquiry;
  return {
    ...rest,
    originalBooking: linkedBooking ?? null,
  };
}

export const NEW_ENQUIRY_BOOKING_SELECT = {
  id: true,
  name: true,
  eventDate: true,
  venueName: true,
  venuePostcode: true,
} as const;
