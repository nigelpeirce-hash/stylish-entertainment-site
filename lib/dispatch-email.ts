/**
 * Shared dispatch email builder for artist/staff worksheet emails.
 * Used by both manual dispatch (admin) and auto-dispatch (on client final details).
 */

import { SIGNATURE_BLOCK_HTML } from "@/lib/email-signature";

export interface DispatchFinalDetails {
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  eventType?: string;
  numberOfGuests?: string | number;
  venueName?: string;
  venueAddress?: string;
  venueAddress2?: string;
  venueTown?: string;
  venueCounty?: string;
  venuePostcode?: string;
  venueContact?: string;
  venuePhone?: string;
  djArrivalTime?: string;
  djStartTime?: string;
  djFinishTime?: string;
  djSetupLocation?: string;
  djParking?: string;
  soundLimiter?: string;
  venueIsPrivateHouse?: boolean;
  venueWhat3Words?: string;
  venueLoadInNotes?: string;
  firstDance?: string;
  lastSong?: string;
  musicRequests?: string;
  musicDislikes?: string;
  musicNotesToDJ?: string;
  musicFileUrl?: string;
}

export interface DispatchEmailParams {
  booking: {
    name: string;
    email: string;
    phoneAreaCode?: string | null;
    phoneNumber?: string | null;
    eventType?: string | null;
    numberOfGuests?: number | null;
    venueName?: string | null;
    venueAddress?: string | null;
    venueAddress2?: string | null;
    venueTown?: string | null;
    venueCounty?: string | null;
    venuePostcode?: string | null;
    venueContact?: string | null;
    venuePhoneAreaCode?: string | null;
    venuePhoneNumber?: string | null;
    venueIsPrivateHouse?: boolean | null;
    venueWhat3Words?: string | null;
    venueLoadInNotes?: string | null;
    djArrivalTime?: string | null;
    djStartTime?: string | null;
    djFinishTime?: string | null;
    djSetupLocation?: string | null;
    djParking?: string | null;
    soundLimiter?: boolean | null;
    firstDance?: string | null;
    lastSong?: string | null;
    musicRequests?: string | null;
    musicDislikes?: string | null;
    musicNotesToDJ?: string | null;
    musicFileUrl?: string | null;
    services?: string[] | null;
    warehouseItems?: Array<{
      quantity: number;
      WarehouseItem: { name: string; category: string; size?: string | null; weight?: number | null };
    }>;
    guestRequests?: Array<{
      trackName?: string;
      songTitle?: string;
      artistName?: string;
      artist?: string;
      guestName?: string;
      spotifyUrl?: string;
      status?: string;
    }>;
  };
  fd: DispatchFinalDetails;
  eventDate: string;
  staffAssignment?: { role?: string | null } | null;
  briefToken?: string | null;
}

export function buildDispatchEmailHtml(params: DispatchEmailParams): string {
  const { booking, fd, eventDate, staffAssignment, briefToken } = params;
  const staffRole = staffAssignment?.role || "";
  const isMusicianDispatch =
    staffRole?.toLowerCase().includes("musician") || staffRole?.toLowerCase().includes("band");

  const clientPhoneDisplay =
    fd.clientPhone ||
    (booking.phoneAreaCode != null || booking.phoneNumber != null
      ? [booking.phoneAreaCode, booking.phoneNumber].filter(Boolean).join(" ").trim()
      : "") ||
    "To be confirmed";
  const venuePhoneDisplay =
    fd.venuePhone ||
    (booking.venuePhoneAreaCode && booking.venuePhoneNumber
      ? [booking.venuePhoneAreaCode, booking.venuePhoneNumber].filter(Boolean).join(" ").trim()
      : "") ||
    "To be confirmed";

  const venueIsPrivateHouse = !!fd.venueIsPrivateHouse || !!booking.venueIsPrivateHouse;
  const venueWhat3Words = (fd.venueWhat3Words || booking.venueWhat3Words || "").trim();
  const venueLoadInNotes = (fd.venueLoadInNotes || booking.venueLoadInNotes || "").trim();
  const w3wSlug = venueWhat3Words ? venueWhat3Words.replace(/\s+/g, ".").replace(/\.+/g, ".") : "";

  const bookingServices = Array.isArray(booking.services) ? booking.services : [];
  const bookingWarehouseItems = Array.isArray(booking.warehouseItems) ? booking.warehouseItems : [];
  const bookingGuestRequests = Array.isArray(booking.guestRequests) ? booking.guestRequests : [];

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #ffffff; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { text-align: center; padding: 30px 20px; border-bottom: 1px solid #D4AF37; }
    .logo { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 600; color: #1a1a1a; letter-spacing: 1px; }
    .content { padding: 30px 20px; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 18px; font-weight: 600; color: #1a1a1a; margin-bottom: 10px; border-bottom: 1px solid #D4AF37; padding-bottom: 5px; }
    .detail-row { margin-bottom: 8px; }
    .detail-label { font-weight: 600; color: #666; display: inline-block; min-width: 120px; }
    .detail-value { color: #1a1a1a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><div class="logo">S</div></div>
    <div class="content">
      <h1 style="font-size: 24px; margin-bottom: 20px; color: #1a1a1a;">Event Details</h1>
      
      <div class="section">
        <div class="section-title">Client Information</div>
        <div class="detail-row"><span class="detail-label">Client Name:</span><span class="detail-value">${fd.clientName || booking.name}</span></div>
        ${fd.clientEmail || booking.email ? `<div class="detail-row"><span class="detail-label">Email:</span><span class="detail-value">${fd.clientEmail || booking.email}</span></div>` : ""}
        <div class="detail-row"><span class="detail-label">Client phone (in case of emergency on the day):</span><span class="detail-value">${clientPhoneDisplay}</span></div>
        ${fd.eventType || booking.eventType ? `<div class="detail-row"><span class="detail-label">Event Type:</span><span class="detail-value">${fd.eventType || booking.eventType}</span></div>` : ""}
        ${fd.numberOfGuests ?? booking.numberOfGuests ? `<div class="detail-row"><span class="detail-label">Number of Guests:</span><span class="detail-value">${fd.numberOfGuests ?? booking.numberOfGuests}</span></div>` : ""}
      </div>

      <div class="section">
        <div class="section-title">Venue Information</div>
        <div class="detail-row"><span class="detail-label">Venue Name:</span><span class="detail-value">${fd.venueName || booking.venueName || "To be confirmed"}</span></div>
        ${(fd.venueAddress || booking.venueAddress) ? `<div class="detail-row"><span class="detail-label">Address Line 1:</span><span class="detail-value">${fd.venueAddress || booking.venueAddress}</span></div>` : ""}
        ${fd.venueAddress2 ? `<div class="detail-row"><span class="detail-label">Address Line 2:</span><span class="detail-value">${fd.venueAddress2}</span></div>` : ""}
        ${(fd.venueTown || booking.venueTown) ? `<div class="detail-row"><span class="detail-label">Town:</span><span class="detail-value">${fd.venueTown || booking.venueTown}</span></div>` : ""}
        ${(fd.venueCounty || booking.venueCounty) ? `<div class="detail-row"><span class="detail-label">County:</span><span class="detail-value">${fd.venueCounty || booking.venueCounty}</span></div>` : ""}
        ${(fd.venuePostcode || booking.venuePostcode) ? `<div class="detail-row"><span class="detail-label">Postcode:</span><span class="detail-value">${fd.venuePostcode || booking.venuePostcode}</span></div>` : ""}
        <div class="detail-row"><span class="detail-label">Venue Contact:</span><span class="detail-value">${fd.venueContact || booking.venueContact || "To be confirmed"}</span></div>
        <div class="detail-row"><span class="detail-label">Venue Phone:</span><span class="detail-value">${venuePhoneDisplay}</span></div>
      </div>

      <div class="section" style="border-left: 4px solid #D4AF37;">
        <div class="section-title">Finding the venue / Load-in</div>
        ${venueIsPrivateHouse ? `<div class="detail-row"><span class="detail-label">Private house:</span><span class="detail-value">Yes – use full address above, What3words, and/or load-in notes below to find the exact location.</span></div>` : ""}
        ${venueWhat3Words ? `<div class="detail-row"><span class="detail-label">What3words:</span><span class="detail-value"><a href="https://what3words.com/${w3wSlug}" target="_blank" rel="noopener noreferrer" style="color: #D4AF37;">${venueWhat3Words}</a></span></div>` : ""}
        <div class="detail-row"><span class="detail-label">Load-in / access:</span><span class="detail-value" style="white-space: pre-wrap;">${venueLoadInNotes || "To be confirmed"}</span></div>
      </div>

      <div class="section">
        <div class="section-title">Event Timings</div>
        <div class="detail-row"><span class="detail-label">Event Date:</span><span class="detail-value">${eventDate}</span></div>
        <div class="detail-row"><span class="detail-label">Arrival Time:</span><span class="detail-value">${fd.djArrivalTime || booking.djArrivalTime || "To be confirmed"}</span></div>
        <div class="detail-row"><span class="detail-label">Start Time:</span><span class="detail-value">${fd.djStartTime || booking.djStartTime || "To be confirmed"}</span></div>
        <div class="detail-row"><span class="detail-label">Finish Time:</span><span class="detail-value">${fd.djFinishTime || booking.djFinishTime || "To be confirmed"}</span></div>
      </div>

      <div class="section">
        <div class="section-title">Technical Setup</div>
        <div class="detail-row"><span class="detail-label">Setup Location:</span><span class="detail-value" style="white-space: pre-wrap;">${fd.djSetupLocation || booking.djSetupLocation || "To be confirmed"}</span></div>
        <div class="detail-row"><span class="detail-label">Parking Information:</span><span class="detail-value" style="white-space: pre-wrap;">${fd.djParking || booking.djParking || "To be confirmed"}</span></div>
        <div class="detail-row"><span class="detail-label">Sound Limiter:</span><span class="detail-value">${fd.soundLimiter !== undefined ? fd.soundLimiter : booking.soundLimiter !== null && booking.soundLimiter !== undefined ? (booking.soundLimiter ? "Yes" : "No") : "To be confirmed"}</span></div>
      </div>

      ${isMusicianDispatch ? `<div class="section"><div class="section-title" style="color: #D4AF37; font-weight: 600;">🎷 Live Performance Technical Requirements</div>
        <div class="detail-row"><span class="detail-label">PA System:</span><span class="detail-value">${bookingServices.includes("DJ") || bookingServices.includes("Sound System") ? "Provided by DJ/Sound System" : "Please confirm if PA system is required"}</span></div>
        <div class="detail-row"><span class="detail-label">Staging Area:</span><span class="detail-value">${fd.djSetupLocation || booking.djSetupLocation || "To be confirmed with venue"}</span></div>
        <div class="detail-row"><span class="detail-label">Power Requirements:</span><span class="detail-value">Standard power outlet required near performance area. Please confirm if additional power is needed.</span></div>
        <div class="detail-row"><span class="detail-label">Audio Connection:</span><span class="detail-value">${bookingServices.includes("DJ") ? "Can connect to DJ mixer if needed" : "Standalone performance"}</span></div>
        ${booking.musicNotesToDJ ? `<div class="detail-row"><span class="detail-label">Performance Notes:</span><span class="detail-value" style="white-space: pre-wrap;">${booking.musicNotesToDJ}</span></div>` : ""}
      </div>` : ""}

      ${booking.firstDance || booking.lastSong || booking.musicRequests || booking.musicDislikes || booking.musicNotesToDJ || booking.musicFileUrl ? `<div class="section">
        <div class="section-title">${isMusicianDispatch ? "🎵 Ceremony Music Choices (For Live Performance)" : "🎵 Music Preferences (from client portal)"}</div>
        ${booking.firstDance ? `<div class="detail-row"><span class="detail-label">${isMusicianDispatch ? "First Dance (Live Performance):" : "First Dance:"}</span><span class="detail-value">${booking.firstDance}</span></div>` : ""}
        ${booking.lastSong ? `<div class="detail-row"><span class="detail-label">${isMusicianDispatch ? "Processional/Recessional (Live Performance):" : "Last Song:"}</span><span class="detail-value">${booking.lastSong}</span></div>` : ""}
        ${booking.musicRequests ? `<div class="detail-row"><span class="detail-label">Must-Plays / Requests:</span><span class="detail-value" style="white-space: pre-wrap;">${booking.musicRequests}</span></div>` : ""}
        ${booking.musicDislikes ? `<div class="detail-row"><span class="detail-label">Do-Not-Plays:</span><span class="detail-value" style="white-space: pre-wrap;">${booking.musicDislikes}</span></div>` : ""}
        ${booking.musicNotesToDJ && !isMusicianDispatch ? `<div class="detail-row"><span class="detail-label">Additional Notes to DJ/Musician:</span><span class="detail-value" style="white-space: pre-wrap;">${booking.musicNotesToDJ}</span></div>` : ""}
        ${booking.musicFileUrl ? `<div class="detail-row"><span class="detail-label">Spotify / PDF music list:</span><span class="detail-value"><a href="${booking.musicFileUrl}" target="_blank" rel="noopener noreferrer" style="color: #D4AF37; text-decoration: underline;">${booking.musicFileUrl}</a></span></div>` : ""}
        ${isMusicianDispatch && bookingServices.includes("DJ") ? `<div class="detail-row" style="background-color: #f9f9f9; padding: 10px; border-left: 3px solid #D4AF37; margin-top: 10px;"><span class="detail-label" style="font-weight: 600;">Note:</span><span class="detail-value">DJ will handle reception music. Your live performance is for the ceremony (First Dance, Processional, etc.).</span></div>` : ""}
      </div>` : ""}

      ${bookingGuestRequests.length > 0 ? `<div class="section"><div class="section-title" style="color: #D4AF37; font-weight: 600;">🎵 Guest Song Requests</div>
        <p style="margin-bottom: 15px; color: #666; font-size: 14px;">Songs requested by your guests. These are crowd favorites to consider.</p>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${bookingGuestRequests.map((req: any) => {
            const title = req.trackName || req.songTitle || "Unknown";
            const artist = req.artistName || req.artist;
            return `<li style="padding: 8px 0; border-bottom: 1px solid #e5e5e5;">
              <span style="font-weight: 500; color: #1a1a1a;">${title}</span>
              ${artist ? `<span style="color: #666; margin-left: 8px;">by ${artist}</span>` : ""}
              ${req.guestName ? `<span style="color: #999; font-size: 12px; margin-left: 8px;">— ${req.guestName}</span>` : ""}
              ${req.spotifyUrl ? ` <a href="${req.spotifyUrl}" target="_blank" rel="noopener noreferrer" style="color: #D4AF37; font-size: 12px; margin-left: 8px;">Spotify</a>` : ""}
              ${req.status === "moved_to_official" ? `<span style="background-color: #D4AF37; color: #1a1a1a; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600; margin-left: 8px; text-transform: uppercase;">Added to Official List</span>` : ""}
            </li>`;
          }).join("")}
        </ul>
      </div>` : ""}

      ${bookingWarehouseItems.length > 0 ? `<div class="section"><div class="section-title" style="color: #D4AF37; font-weight: 600;">📦 Kit Provided by Stylish</div>
        ${Object.entries(
          bookingWarehouseItems.reduce((acc: Record<string, typeof bookingWarehouseItems>, item) => {
            const cat = item.WarehouseItem.category;
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
          }, {})
        )
          .map(
            ([category, items]) => `
          <div style="margin-bottom: 15px;">
            <div style="font-weight: 600; color: #1a1a1a; margin-bottom: 8px; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;">${category}</div>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${items
                .map(
                  (item: any) => `
                <li style="padding: 6px 0; border-bottom: 1px solid #e5e5e5;">
                  <span style="font-weight: 500; color: #1a1a1a;">${item.quantity}x ${item.WarehouseItem.name}</span>
                  ${item.WarehouseItem.size ? `<span style="color: #666; font-size: 12px; margin-left: 8px;">(${item.WarehouseItem.size})</span>` : ""}
                  ${item.WarehouseItem.weight ? `<span style="color: #666; font-size: 12px; margin-left: 8px;">${item.WarehouseItem.weight}kg</span>` : ""}
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        `
          )
          .join("")}
      </div>` : ""}
    </div>
    ${briefToken ? `
    <div style="text-align: center; padding: 30px 20px; margin-top: 30px; border-top: 1px solid #D4AF37;">
      <p style="margin-bottom: 8px; color: #666; font-size: 14px;">This Artist Worksheet includes details from the client portal (music preferences, final details) and the booking.</p>
      <p style="margin-bottom: 20px; color: #1a1a1a; font-weight: 500;">Please confirm you accept this booking:</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://stylishentertainment.co.uk"}/api/confirm-brief/${briefToken}" 
         style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%); color: #1a1a1a; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);">
        Yes, I accept the booking
      </a>
    </div>
    ` : ""}
    ${SIGNATURE_BLOCK_HTML}
  </div>
</body>
</html>
  `.trim();
}
