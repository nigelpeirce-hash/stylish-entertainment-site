"use client";

import { useMemo } from "react";
import PortalView from "@/components/client/PortalView";

/** 2 months from now – always current, no manual updates needed */
function getDemoEventDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 2);
  return d;
}

/**
 * Portal preview – real portal layout with sample data.
 * Used on wedding-dj to show couples what their planning space looks like.
 * No real client data; generic placeholder for demo.
 */
function createMockBooking() {
  const demoDate = getDemoEventDate();
  return {
  id: "demo-portal-preview",
  name: "Alex & Sam",
  email: "couple@example.com",
  phoneAreaCode: null,
  phoneNumber: null,
  eventDate: demoDate,
  ceremonyTime: demoDate,
  venueName: "Your Venue",
  venuePostcode: null,
  venueNotes: null,
  googleMapsUrl: null,
  status: "confirmed",
  depositReceived: true,
  depositReceivedManual: true,
  finalDetailsConfirmed: false,
  message: null,
  eventType: "wedding",
  numberOfGuests: 100,
  services: ["DJ"],
  upsellItems: [],
  djStartTime: "19:00",
  djFinishTime: "00:00",
  musicRequests: "At Last – Etta James (first dance)",
  musicDislikes: "YMCA, Agadoo, Macarena",
  firstDance: "At Last",
  lastSong: "Don't Stop Believin'",
  musicNotesToDJ: null,
  musicFileUrl: null,
  portalHeroImageUrl: null,
  venueWhat3Words: null,
  venueLoadInNotes: null,
  clientAddress: null,
  clientAddress2: null,
  clientTown: null,
  clientCounty: null,
  clientPostcode: null,
  termsAccepted: true,
  termsAcceptedAt: new Date(),
  staffAssignments: [
    {
      id: "demo-staff-1",
      role: "DJ",
      status: "confirmed",
      staff: {
        id: "demo-dj",
        name: "Your DJ",
        email: null,
      },
    },
  ],
  guestRequestToken: null,
  guestRequestsEnabled: true,
  guestRequests: [
    { id: "g1", trackName: "Dancing Queen", artistName: "ABBA", guestName: "Aunt Sue", status: "approved" },
    { id: "g2", trackName: "Wonderwall", artistName: "Oasis", guestName: "Best Man", status: "pending" },
  ],
  User: null,
};
}

export default function PortalPreviewPage() {
  const mockBooking = useMemo(() => createMockBooking(), []);
  return (
    <div className="min-h-screen portal-ui">
      <div className="absolute top-0 left-0 right-0 z-50 py-2 px-4 bg-amber-500/20 border-b border-amber-500/40 text-center safe-area-x">
        <span className="text-amber-200 text-sm font-medium">Preview – This is what your planning space looks like when you book</span>
      </div>
      <div className="pt-12">
        <PortalView
          booking={mockBooking as any}
          isPreview={true}
          baseUrl={typeof window !== "undefined" ? window.location.origin : ""}
          eventPassed={false}
        />
      </div>
    </div>
  );
}
