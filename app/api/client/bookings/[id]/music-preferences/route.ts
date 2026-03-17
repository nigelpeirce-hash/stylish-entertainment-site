import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { isPortalTokenValid } from "@/lib/portal-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * PATCH music preferences (must-plays, do-not-plays).
 * Available from day 1 – no date restriction. Auth: ?token= OR session.
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
      select: { id: true, userId: true, portalToken: true, portalTokenExpiresAt: true },
    });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    let allowed = false;
    if (token && isPortalTokenValid(booking, token)) {
      allowed = true;
    } else if (session?.user) {
      const u = session.user as { id?: string; role?: string };
      if (u.role === "admin" || (!!u.id && booking.userId === u.id)) allowed = true;
    }
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const str = (v: unknown) => (typeof v === "string" ? v.trim() || null : null);
    const musicRequests = body.musicRequests !== undefined ? str(body.musicRequests) : undefined;
    const musicDislikes = body.musicDislikes !== undefined ? str(body.musicDislikes) : undefined;
    const musicFileUrl = body.musicFileUrl !== undefined ? str(body.musicFileUrl) : undefined;
    const firstDance = body.firstDance !== undefined ? str(body.firstDance) : undefined;
    const lastSong = body.lastSong !== undefined ? str(body.lastSong) : undefined;
    const musicNotesToDJ = body.musicNotesToDJ !== undefined ? str(body.musicNotesToDJ) : undefined;

    const updateData: Record<string, string | null> = {};
    if (musicRequests !== undefined) updateData.musicRequests = musicRequests;
    if (musicDislikes !== undefined) updateData.musicDislikes = musicDislikes;
    if (musicFileUrl !== undefined) updateData.musicFileUrl = musicFileUrl;
    if (firstDance !== undefined) updateData.firstDance = firstDance;
    if (lastSong !== undefined) updateData.lastSong = lastSong;
    if (musicNotesToDJ !== undefined) updateData.musicNotesToDJ = musicNotesToDJ;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
    });

    const b = await prisma.booking.findUnique({ where: { id: bookingId }, select: { name: true, venueName: true } });
    await logActivity({
      bookingId,
      action: "playlist_updated",
      description: "Client updated music preferences / playlist",
      actor: "client",
      performedBy: b?.name ?? undefined,
      metadata: firstDance ? { firstDance: firstDance.slice(0, 80) } : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[music-preferences] PATCH error:", e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
