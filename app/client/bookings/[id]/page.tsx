import { randomBytes } from "crypto";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import PortalView from '@/components/client/PortalView';
import { auth } from '@/auth';
import { isPortalTokenValid } from '@/lib/portal-token';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface PortalPageProps {
  params: Promise<{ id: string }> | { id: string };
  searchParams: Promise<{ token?: string }> | { token?: string };
}

export default async function PortalPage({ params, searchParams }: PortalPageProps) {
  const isDev = process.env.NODE_ENV === 'development';

  // Parallel: resolve params, searchParams, and auth (no dependency between them)
  const [resolvedParams, resolvedSearchParams, session] = await Promise.all([
    params instanceof Promise ? params : Promise.resolve(params),
    searchParams instanceof Promise ? searchParams : Promise.resolve(searchParams),
    auth(),
  ]);

  const bookingId = resolvedParams.id;
  const token = resolvedSearchParams.token;
  const isAdmin = session?.user && (session.user as any).role === "admin";

  // Fetch the booking (depends on bookingId from params)
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      userId: true,
      name: true,
      email: true,
      phoneAreaCode: true,
      phoneNumber: true,
      clientAddress: true,
      clientAddress2: true,
      clientTown: true,
      clientCounty: true,
      clientPostcode: true,
      eventDate: true,
      ceremonyTime: true,
      venueName: true,
      venuePostcode: true,
      status: true,
      depositReceived: true,
      depositReceivedManual: true,
      finalDetailsConfirmed: true,
      termsAccepted: true,
      termsAcceptedAt: true,
      message: true,
      eventType: true,
      firstDance: true,
      lastSong: true,
      musicRequests: true,
      musicDislikes: true,
      musicNotesToDJ: true,
      musicFileUrl: true,
      portalHeroImageUrl: true,
      venueWhat3Words: true,
      venueLoadInNotes: true,
      numberOfGuests: true,
      services: true,
      upsellItems: true,
      djStartTime: true,
      djFinishTime: true,
      portalToken: true,
      portalTokenExpiresAt: true,
      staffAssignments: {
        where: { cancelledAt: null },
        select: {
          id: true,
          role: true,
          status: true,
          staff: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      User: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      guestRequestToken: true,
      guestRequestsEnabled: true,
      guestRequests: {
        where: {
          status: { in: ["pending", "approved"] },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          trackName: true,
          artistName: true,
          albumArtUrl: true,
          spotifyUrl: true,
          guestName: true,
          note: true,
          status: true,
        },
      },
    }
  });

  if (!booking) {
    return notFound();
  }

  // Ensure guest request link exists so "What your guests want to hear" always shows link + email/Excel invite
  if (!booking.guestRequestToken) {
    const newToken = `gr_${randomBytes(12).toString("hex")}`;
    await prisma.booking.update({
      where: { id: bookingId },
      data: { guestRequestToken: newToken, updatedAt: new Date() },
    });
    booking = { ...booking, guestRequestToken: newToken };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylishentertainment.co.uk";
  const eventPassed = new Date(booking.eventDate) < new Date();

  // Fetch venue notes and generate Google Maps URL
  let venueNotes: string | null = null;
  let googleMapsUrl: string | null = null;
  if (booking.venueName) {
    try {
      const venue = await prisma.venue.findUnique({
        where: { venueName: booking.venueName },
        select: { venueNotes: true },
      });
      venueNotes = venue?.venueNotes || null;
    } catch (e) {
      console.log("Note: Venue lookup failed", e);
    }
    
    // Generate Google Maps URL from venue name and postcode
    const query = [booking.venueName, booking.venuePostcode].filter(Boolean).join(", ");
    if (query) {
      googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    }
  }

  // 2. Admin Preview Mode
  if (isAdmin) {
    console.log("👤 Admin Preview: Allowing admin to view client portal for preview");
    const { portalToken: _pt, portalTokenExpiresAt: _ptea, ...bookingSafe } = booking;
    return <PortalView booking={{ ...bookingSafe, venueNotes, googleMapsUrl }} isPreview={true} baseUrl={baseUrl} eventPassed={eventPassed} />;
  }

  // 3. Dev Bypass Logic
  if (isDev) {
    console.log("🛠️ Dev Mode: Bypassing strict portal authentication for testing");
    const { portalToken: _pt, portalTokenExpiresAt: _ptea, ...bookingSafe } = booking;
    return <PortalView booking={{ ...bookingSafe, venueNotes, googleMapsUrl }} isPreview={true} baseUrl={baseUrl} eventPassed={eventPassed} />;
  }

  // 4. Tokenized magic link: ?token=... grants immediate read/write access (no login)
  if (token) {
    const isValid = isPortalTokenValid(booking, token);
    if (!isValid) {
      return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
          <h1 className="text-xl font-semibold text-amber-500 mb-2">Invalid or expired link</h1>
          <p className="text-gray-400 text-center max-w-md">
            This portal link is invalid or has expired. Please use the latest link from your email, or contact us for a new one.
          </p>
          <Link href="/login" className="mt-6 text-amber-500 hover:underline">Go to login</Link>
        </div>
      );
    }
    const { portalToken: _pt, portalTokenExpiresAt: _ptea, ...bookingSafe } = booking;
    return <PortalView booking={{ ...bookingSafe, venueNotes, googleMapsUrl }} isPreview={false} baseUrl={baseUrl} eventPassed={eventPassed} />;
  }

  // 5. Session-based access: require ownership (middleware allows through only if logged in)
  const sessionUserId = (session?.user as any)?.id;
  const sessionEmail = (session?.user?.email ?? "").toString().toLowerCase().trim();
  const bookingEmail = (booking.email ?? "").toLowerCase().trim();
  const ownsByUserId = !!sessionUserId && booking.userId === sessionUserId;
  const ownsByEmail = !!sessionEmail && !!bookingEmail && sessionEmail === bookingEmail;
  if (!ownsByUserId && !ownsByEmail) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-xl font-semibold text-amber-500 mb-2">Access denied</h1>
        <p className="text-gray-400 text-center max-w-md">
          You don&apos;t have access to this booking. If you believe this is an error, please contact us.
        </p>
        <Link href="/client/dashboard" className="mt-6 text-amber-500 hover:underline">Go to your dashboard</Link>
      </div>
    );
  }
  const { portalToken: _pt, portalTokenExpiresAt: _ptea, ...bookingSafe } = booking;
  return <PortalView booking={{ ...bookingSafe, venueNotes, googleMapsUrl }} isPreview={false} baseUrl={baseUrl} eventPassed={eventPassed} />;
}
