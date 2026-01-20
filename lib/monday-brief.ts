import { prisma } from "@/lib/prisma";
import { getEmailUrl } from "@/lib/get-base-url";

export interface BriefAction {
  id: string;
  bookingId: string;
  clientName: string;
  venueName: string;
  eventDate: string;
  daysRemaining: number;
  reason: string;
  type: "red" | "gold" | "blue";
  staffName?: string;
  directLink: string;
}

export interface MondayBrief {
  weekOf: string;
  redActions: BriefAction[];
  goldActions: BriefAction[];
  blueActions: BriefAction[];
  totalActions: number;
}

/**
 * Generate Monday Morning Brief data
 * Scans all bookings and identifies actions needed
 */
export async function generateMondayBrief(baseUrl?: string): Promise<MondayBrief> {
  const now = new Date();
  const ninetyDaysFromNow = new Date();
  ninetyDaysFromNow.setDate(now.getDate() + 90);

  // Get the Monday of the current week
  const monday = new Date(now);
  const dayOfWeek = monday.getDay();
  const diff = monday.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  const weekOf = monday.toLocaleDateString("en-GB", { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

  // Fetch all bookings within next 90 days
  const bookings = await prisma.booking.findMany({
    where: {
      eventDate: {
        gte: now,
        lte: ninetyDaysFromNow,
      },
      status: {
        not: "cancelled",
      },
    },
    select: {
      id: true,
      name: true,
      venueName: true,
      eventDate: true,
      depositReceived: true,
      djWorksheetApproved: true,
      finalDetailsConfirmed: true,
      services: true,
      staffAssignments: {
        select: {
          id: true,
          role: true,
          status: true,
          briefStatus: true,
          staff: {
            select: {
              name: true,
            },
          },
        },
      },
      emailThreads: {
        where: {
          source: "portal",
          isRead: false,
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      eventDate: "asc",
    },
  });

  const redActions: BriefAction[] = [];
  const goldActions: BriefAction[] = [];
  const blueActions: BriefAction[] = [];

  bookings.forEach((booking) => {
    const eventDate = new Date(booking.eventDate);
    const daysRemaining = Math.ceil(
      (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const directLink = baseUrl 
      ? `${baseUrl}/admin/bookings/${booking.id}`
      : `/admin/bookings/${booking.id}`;

    // RED ACTIONS: Urgent items
    // 1. Events < 14 days out without final details confirmed
    if (daysRemaining < 14 && !booking.finalDetailsConfirmed) {
      redActions.push({
        id: `red-${booking.id}-final-details`,
        bookingId: booking.id,
        clientName: booking.name,
        venueName: booking.venueName,
        eventDate: eventDate.toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        daysRemaining,
        reason: "Final details not confirmed",
        type: "red",
        directLink,
      });
    }

    // 2. Deposits not received for events < 30 days out
    if (daysRemaining < 30 && !booking.depositReceived) {
      redActions.push({
        id: `red-${booking.id}-deposit`,
        bookingId: booking.id,
        clientName: booking.name,
        venueName: booking.venueName,
        eventDate: eventDate.toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        daysRemaining,
        reason: "Deposit not received",
        type: "red",
        directLink,
      });
    }

    // 3. DJ Worksheet not approved for events < 14 days out with DJ service
    if (
      daysRemaining < 14 &&
      booking.services?.includes("DJs") &&
      !booking.djWorksheetApproved
    ) {
      redActions.push({
        id: `red-${booking.id}-worksheet`,
        bookingId: booking.id,
        clientName: booking.name,
        venueName: booking.venueName,
        eventDate: eventDate.toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        daysRemaining,
        reason: "DJ Worksheet not approved",
        type: "red",
        directLink,
      });
    }

    // GOLD ACTIONS: Unread Portal Messages
    if (booking.emailThreads && booking.emailThreads.length > 0) {
      goldActions.push({
        id: `gold-${booking.id}-messages`,
        bookingId: booking.id,
        clientName: booking.name,
        venueName: booking.venueName,
        eventDate: eventDate.toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        daysRemaining,
        reason: `${booking.emailThreads.length} unread portal message${booking.emailThreads.length > 1 ? "s" : ""}`,
        type: "gold",
        directLink: baseUrl 
          ? `${baseUrl}/admin/bookings/${booking.id}#communications`
          : `/admin/bookings/${booking.id}#communications`,
      });
    }

    // BLUE ACTIONS: Staff members who have responded to holds but aren't confirmed
    booking.staffAssignments?.forEach((assignment) => {
      if (
        (assignment.status === "held" || assignment.status === "dispatched") &&
        assignment.status !== "confirmed" &&
        assignment.status !== "cancelled"
      ) {
        blueActions.push({
          id: `blue-${booking.id}-${assignment.id}`,
          bookingId: booking.id,
          clientName: booking.name,
          venueName: booking.venueName,
          eventDate: eventDate.toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          daysRemaining,
          reason: `${assignment.staff.name} (${assignment.role}) - Availability confirmed, awaiting confirmation`,
          type: "blue",
          staffName: assignment.staff.name,
          directLink,
        });
      }
    });
  });

  return {
    weekOf,
    redActions,
    goldActions,
    blueActions,
    totalActions: redActions.length + goldActions.length + blueActions.length,
  };
}
