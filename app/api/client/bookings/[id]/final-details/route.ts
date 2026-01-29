import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStaffPushKeys, sendPushoverNotification } from "@/lib/pushover-notifications";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const WINDOW_DAYS = 21;
const MUSIC_REQUIRED_MSG =
  "We need your music details. Please add at least one of: first dance, must-plays, do-not-plays, notes for your DJ, or a playlist/link.";

/**
 * PATCH final details for the booking. Single package: music + notes + logistics.
 * Auth: ?token= (portalToken) OR session (user owns booking or admin).
 * Only allowed within 21 days of event. Music required before confirm.
 * On success: notifies admin (Pushover), ready to dispatch.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolved = params instanceof Promise ? await params : params;
    const bookingId = resolved.id;
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    const token = request.nextUrl.searchParams.get("token");
    const session = await auth();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        userId: true,
        eventDate: true,
        portalToken: true,
        name: true,
        venueName: true,
      },
    });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    let allowed = false;
    if (token && booking.portalToken && booking.portalToken === token) {
      allowed = true;
    } else if (session?.user) {
      const u = session.user as { id?: string; role?: string };
      if (u.role === "admin" || (!!u.id && booking.userId === u.id)) allowed = true;
    }
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const eventDate = new Date(booking.eventDate);
    const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil > WINDOW_DAYS || daysUntil < 0) {
      return NextResponse.json(
        { error: "Final details can only be updated within 21 days of your event" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const notes = body.notes !== undefined ? (typeof body.notes === "string" ? body.notes.trim() || null : null) : undefined;
    const musicRequests = body.musicRequests !== undefined ? (typeof body.musicRequests === "string" ? body.musicRequests.trim() || null : null) : undefined;
    const firstDance = body.firstDance !== undefined ? (typeof body.firstDance === "string" ? body.firstDance.trim() || null : null) : undefined;
    const lastSong = body.lastSong !== undefined ? (typeof body.lastSong === "string" ? body.lastSong.trim() || null : null) : undefined;
    const musicDislikes = body.musicDislikes !== undefined ? (typeof body.musicDislikes === "string" ? body.musicDislikes.trim() || null : null) : undefined;
    const musicNotesToDJ = body.musicNotesToDJ !== undefined ? (typeof body.musicNotesToDJ === "string" ? body.musicNotesToDJ.trim() || null : null) : undefined;
    const musicFileUrl = body.musicFileUrl !== undefined ? (typeof body.musicFileUrl === "string" ? body.musicFileUrl.trim() || null : null) : undefined;
    const phoneRaw = body.phone !== undefined ? (typeof body.phone === "string" ? body.phone.trim() || null : null) : undefined;
    const venueWhat3Words = body.venueWhat3Words !== undefined ? (typeof body.venueWhat3Words === "string" ? body.venueWhat3Words.trim() || null : null) : undefined;
    const venueLoadInNotes = body.venueLoadInNotes !== undefined ? (typeof body.venueLoadInNotes === "string" ? body.venueLoadInNotes.trim() || null : null) : undefined;
    const clientAddress = body.clientAddress !== undefined ? (typeof body.clientAddress === "string" ? body.clientAddress.trim() || null : null) : undefined;
    const clientAddress2 = body.clientAddress2 !== undefined ? (typeof body.clientAddress2 === "string" ? body.clientAddress2.trim() || null : null) : undefined;
    const clientTown = body.clientTown !== undefined ? (typeof body.clientTown === "string" ? body.clientTown.trim() || null : null) : undefined;
    const clientCounty = body.clientCounty !== undefined ? (typeof body.clientCounty === "string" ? body.clientCounty.trim() || null : null) : undefined;
    const clientPostcode = body.clientPostcode !== undefined ? (typeof body.clientPostcode === "string" ? body.clientPostcode.trim() || null : null) : undefined;
    const raw = body.numberOfGuests;
    let numberOfGuestsVal: number | undefined;
    if (raw !== undefined && raw !== null && raw !== "") {
      const n = typeof raw === "number" ? Math.floor(raw) : parseInt(String(raw).trim(), 10);
      if (!Number.isNaN(n) && n >= 0) numberOfGuestsVal = n;
    }

    const hasMusic = [firstDance, musicRequests, lastSong, musicDislikes, musicNotesToDJ, musicFileUrl].some(
      (v) => v != null && String(v).trim() !== ""
    );
    if (!hasMusic) {
      return NextResponse.json({ error: MUSIC_REQUIRED_MSG }, { status: 400 });
    }

    let phoneAreaCode: string | null = null;
    let phoneNumber: string | null = null;
    if (phoneRaw) {
      const cleaned = phoneRaw.replace(/\s+/g, "");
      if (cleaned.startsWith("07")) {
        phoneAreaCode = cleaned.slice(0, 4);
        phoneNumber = cleaned.slice(4) || null;
      } else if (cleaned.startsWith("0")) {
        phoneAreaCode = cleaned.slice(0, 3);
        phoneNumber = cleaned.slice(3) || null;
      } else {
        phoneNumber = cleaned;
      }
    }

    const updateData: {
      message?: string | null;
      musicRequests?: string | null;
      firstDance?: string | null;
      lastSong?: string | null;
      musicDislikes?: string | null;
      musicNotesToDJ?: string | null;
      musicFileUrl?: string | null;
      phoneAreaCode?: string | null;
      phoneNumber?: string | null;
      clientAddress?: string | null;
      clientAddress2?: string | null;
      clientTown?: string | null;
      clientCounty?: string | null;
      clientPostcode?: string | null;
      venueWhat3Words?: string | null;
      venueLoadInNotes?: string | null;
      numberOfGuests?: number | null;
      finalDetailsConfirmed?: boolean;
      updatedAt: Date;
    } = { updatedAt: new Date() };
    if (notes !== undefined) updateData.message = notes;
    if (musicRequests !== undefined) updateData.musicRequests = musicRequests;
    if (firstDance !== undefined) updateData.firstDance = firstDance;
    if (lastSong !== undefined) updateData.lastSong = lastSong;
    if (musicDislikes !== undefined) updateData.musicDislikes = musicDislikes;
    if (musicNotesToDJ !== undefined) updateData.musicNotesToDJ = musicNotesToDJ;
    if (musicFileUrl !== undefined) updateData.musicFileUrl = musicFileUrl;
    if (phoneRaw !== undefined) {
      updateData.phoneAreaCode = phoneAreaCode;
      updateData.phoneNumber = phoneNumber;
    }
    if (clientAddress !== undefined) updateData.clientAddress = clientAddress;
    if (clientAddress2 !== undefined) updateData.clientAddress2 = clientAddress2;
    if (clientTown !== undefined) updateData.clientTown = clientTown;
    if (clientCounty !== undefined) updateData.clientCounty = clientCounty;
    if (clientPostcode !== undefined) updateData.clientPostcode = clientPostcode;
    if (venueWhat3Words !== undefined) updateData.venueWhat3Words = venueWhat3Words;
    if (venueLoadInNotes !== undefined) updateData.venueLoadInNotes = venueLoadInNotes;
    if (numberOfGuestsVal !== undefined) updateData.numberOfGuests = numberOfGuestsVal;
    updateData.finalDetailsConfirmed = true;

    await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
    });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylishentertainment.co.uk";
    const bookingUrl = `${baseUrl}/admin/bookings/${bookingId}`;
    const formattedDate = new Date(booking.eventDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const title = "Final details confirmed";
    const message = `${booking.name} @ ${booking.venueName || "TBC"} (${formattedDate}). Ready to dispatch.`;
    try {
      const { ali, nigel } = await getStaffPushKeys();
      const notifications: Promise<unknown>[] = [];
      if (ali) {
        notifications.push(
          sendPushoverNotification({
            title,
            message,
            userKey: ali,
            priority: 1,
            url: bookingUrl,
            urlTitle: "View booking",
          })
        );
      }
      if (nigel) {
        notifications.push(
          sendPushoverNotification({
            title,
            message,
            userKey: nigel,
            priority: 1,
            url: bookingUrl,
            urlTitle: "View booking",
          })
        );
      }
      await Promise.allSettled(notifications);
    } catch (e) {
      console.error("[final-details] Pushover notify error:", e);
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error("[final-details]", e);
    return NextResponse.json(
      { error: "Failed to update final details" },
      { status: 500 }
    );
  }
}
