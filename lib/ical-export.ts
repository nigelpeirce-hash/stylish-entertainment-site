import ical from "ical-generator";
import { prisma } from "@/lib/prisma";

export async function exportBookingsToICal(userId?: string) {
  try {
    const where: any = {
      status: { in: ["pending", "confirmed"] },
    };

    if (userId) {
      where.userId = userId;
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { eventDate: "asc" },
    });

    const calendar = ical({ name: "Stylish Entertainment - Bookings" });

    bookings.forEach((booking) => {
      const startDate = new Date(booking.eventDate);
      // Assume events are typically 6-8 hours
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 7);

      calendar.createEvent({
        start: startDate,
        end: endDate,
        summary: `${booking.eventType} - ${booking.venueName}`,
        description: `
Event Type: ${booking.eventType}
Client: ${booking.name}
Email: ${booking.email}
Venue: ${booking.venueName}
${booking.venueAddress ? `Address: ${booking.venueAddress}` : ""}
${booking.numberOfGuests ? `Guests: ${booking.numberOfGuests}` : ""}
${booking.services.length > 0 ? `Services: ${booking.services.join(", ")}` : ""}
${booking.message ? `Notes: ${booking.message}` : ""}
        `.trim(),
        location: booking.venueName + (booking.venueAddress ? `, ${booking.venueAddress}` : ""),
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://stylishentertainment.co.uk"}/admin/bookings/${booking.id}`,
        organizer: {
          name: "Stylish Entertainment",
          email: "info@stylishentertainment.co.uk",
        },
        status: "CONFIRMED",
        busystatus: "BUSY",
      });
    });

    return calendar.toString();
  } catch (error) {
    console.error("Error exporting to iCal:", error);
    throw error;
  }
}

export async function exportSingleBookingToICal(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    const calendar = ical({ name: `${booking.eventType} - ${booking.venueName}` });

    const startDate = new Date(booking.eventDate);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 7);

    calendar.createEvent({
      start: startDate,
      end: endDate,
      summary: `${booking.eventType} - ${booking.venueName}`,
      description: `
Event Type: ${booking.eventType}
Client: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phoneAreaCode || ""} ${booking.phoneNumber || ""}
Venue: ${booking.venueName}
${booking.venueAddress ? `Address: ${booking.venueAddress}` : ""}
${booking.venueTown ? `Town: ${booking.venueTown}` : ""}
${booking.venuePostcode ? `Postcode: ${booking.venuePostcode}` : ""}
${booking.numberOfGuests ? `Guests: ${booking.numberOfGuests}` : ""}
${booking.services.length > 0 ? `Services: ${booking.services.join(", ")}` : ""}
${booking.djStartTime ? `DJ Start: ${booking.djStartTime}` : ""}
${booking.djFinishTime ? `DJ Finish: ${booking.djFinishTime}` : ""}
${booking.message ? `Notes: ${booking.message}` : ""}
      `.trim(),
      location: [
        booking.venueName,
        booking.venueAddress,
        booking.venueTown,
        booking.venuePostcode,
      ]
        .filter(Boolean)
        .join(", "),
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://stylishentertainment.co.uk"}/admin/bookings/${booking.id}`,
      organizer: {
        name: "Stylish Entertainment",
        email: "info@stylishentertainment.co.uk",
      },
      status: "CONFIRMED",
      busystatus: "BUSY",
    });

    return calendar.toString();
  } catch (error) {
    console.error("Error exporting booking to iCal:", error);
    throw error;
  }
}
