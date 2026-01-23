import ical from "node-ical";
import { prisma } from "@/lib/prisma";

interface ImportedEvent {
  summary: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  url?: string;
}

export async function importICalFromURL(url: string) {
  try {
    const response = await fetch(url);
    const icalData = await response.text();
    return parseICalData(icalData);
  } catch (error) {
    console.error("Error fetching iCal from URL:", error);
    throw error;
  }
}

export async function importICalFromFile(fileContent: string) {
  try {
    return parseICalData(fileContent);
  } catch (error) {
    console.error("Error parsing iCal file:", error);
    throw error;
  }
}

function parseICalData(icalData: string): ImportedEvent[] {
  try {
    const events = ical.parseICS(icalData);
    const importedEvents: ImportedEvent[] = [];

    for (const key in events) {
      const event = events[key];
      if (event.type === "VEVENT") {
        importedEvents.push({
          summary: event.summary || "Untitled Event",
          start: event.start ? new Date(event.start) : new Date(),
          end: event.end ? new Date(event.end) : new Date(),
          description: event.description || undefined,
          location: event.location || undefined,
          url: event.url || undefined,
        });
      }
    }

    return importedEvents;
  } catch (error) {
    console.error("Error parsing iCal data:", error);
    throw error;
  }
}

// Create bookings from imported iCal events (optional - for syncing external calendars)
export async function createBookingsFromICal(
  events: ImportedEvent[],
  defaultInboxEmail: string
) {
  const createdBookings = [];

  for (const event of events) {
    try {
      // Try to extract email from description or create a placeholder
      const emailMatch = event.description?.match(/[\w.-]+@[\w.-]+\.\w+/);
      const email = emailMatch ? emailMatch[0] : defaultInboxEmail;

      // Try to extract name from summary or description
      const nameMatch = event.summary.match(/^(.+?)\s*[-–]\s*(.+)$/);
      const name = nameMatch ? nameMatch[1].trim() : event.summary;

      // SAFEGUARD: Check if booking already exists (by email + event date)
      const eventDate = new Date(event.start);
      const startOfDay = new Date(eventDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(eventDate);
      endOfDay.setHours(23, 59, 59, 999);

      const existingBooking = await prisma.booking.findFirst({
        where: {
          email: email,
          eventDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      if (existingBooking) {
        console.log(`Skipping duplicate booking: ${name} on ${eventDate.toISOString()}`);
        continue; // Skip creating duplicate
      }

      const booking = await prisma.booking.create({
        data: {
          name: name,
          email: email,
          eventType: "Other", // Default, can be updated
          eventDate: event.start,
          venueName: event.location || "TBA",
          status: "pending",
          message: event.description || `Imported from calendar: ${event.summary}`,
        },
      });

      createdBookings.push(booking);
    } catch (error) {
      console.error(`Error creating booking from event "${event.summary}":`, error);
      continue;
    }
  }

  return createdBookings;
}
