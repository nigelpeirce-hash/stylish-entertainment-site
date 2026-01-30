import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getResendConfig } from "@/lib/email-config";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null; // Return null instead of throwing
  }
  return new Resend(apiKey);
};

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface ArtistOption {
  name: string;
  tagline: string;
  bio: string;
  photoUrl: string;
  fee: number;
  recommended: boolean;
  artistType?: "dj" | "musician";
}

const EMAIL_STYLES = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500&display=swap');
    
    /* Prevent dark mode from inverting colors */
    @media (prefers-color-scheme: dark) {
      .email-container { background-color: #ffffff !important; }
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #ffffff;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    
    .header {
      padding: 40px 30px 20px;
      text-align: center;
    }
    
    .divider {
      height: 1px;
      background-color: #D4AF37;
      margin: 20px 30px;
    }
    
    .content {
      padding: 30px;
    }
    
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 20px;
      line-height: 1.3;
    }
    
    h2 {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 25px 0 15px;
    }
    
    p {
      margin: 0 0 16px;
      color: #333333;
    }
    
    .event-box {
      background-color: #f8f9fa;
      border-left: 4px solid #D4AF37;
      padding: 20px;
      margin: 20px 0;
    }
    
    .event-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e5e5;
    }
    
    .event-row:last-child {
      border-bottom: none;
    }
    
    .event-label {
      font-weight: 600;
      color: #1a1a1a;
    }
    
    .event-value {
      color: #333333;
      text-align: right;
    }
    
    .artist-card {
      border: 2px solid #e5e5e5;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .artist-card.recommended {
      border-color: #D4AF37;
      background: linear-gradient(to bottom, #fffef5, #ffffff);
    }
    
    .recommended-badge {
      display: inline-block;
      background: #D4AF37;
      color: #000;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 15px;
    }
    
    .artist-header {
      margin-bottom: 15px;
    }
    
    .artist-photo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #D4AF37;
      float: left;
      margin-right: 15px;
    }
    
    .artist-name {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 5px;
    }
    
    .artist-tagline {
      font-size: 14px;
      color: #666;
      margin: 0;
      font-style: italic;
    }
    
    .artist-bio {
      font-size: 14px;
      color: #444;
      line-height: 1.6;
      margin: 15px 0;
      padding: 15px;
      background: #f9f9f9;
      border-radius: 6px;
      clear: both;
    }
    
    .artist-fee-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 15px;
      border-top: 1px solid #e5e5e5;
      margin-top: 15px;
    }
    
    .artist-fee-label {
      font-weight: 600;
      color: #1a1a1a;
    }
    
    .artist-fee-note {
      font-size: 12px;
      color: #888;
      margin-top: 2px;
    }
    
    .artist-fee {
      font-size: 24px;
      font-weight: 700;
      color: #D4AF37;
    }
    
    .signature {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
    }
    
    .footer {
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #666666;
      border-top: 1px solid #e5e5e5;
      margin-top: 30px;
    }
    
    .footer a {
      color: #D4AF37;
      text-decoration: none;
    }
    
    .cta-section {
      text-align: center;
      margin: 30px 0;
    }
    
    .cta-text {
      color: #1a1a1a !important;
      font-size: 18px;
      margin: 0 0 20px;
      font-family: 'Playfair Display', serif;
    }
    
    .cta-subtext {
      color: #1a1a1a !important;
    }
    
    .cta-button {
      display: inline-block;
      background: #D4AF37;
      color: #000000;
      padding: 16px 40px;
      border-radius: 6px;
      font-weight: 700;
      text-decoration: none;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .cta-subtext {
      color: #1a1a1a !important;
      font-size: 13px;
      margin: 15px 0 0;
    }
  </style>
`;

function buildArtistCard(artist: ArtistOption, type: string): string {
  const formattedFee = artist.fee.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Add Cloudinary transformations for email-safe image
  const photoUrl = artist.photoUrl.includes("cloudinary.com")
    ? artist.photoUrl.replace("/upload/", "/upload/f_auto,q_auto,w_160,h_160,c_fill,g_face/")
    : artist.photoUrl;

  return `
    <div class="artist-card ${artist.recommended ? 'recommended' : ''}">
      ${artist.recommended ? '<span class="recommended-badge">Recommended</span>' : ''}
      <div class="artist-header">
        <img src="${photoUrl}" alt="${artist.name}" class="artist-photo" />
        <h3 class="artist-name">${artist.name}</h3>
        <p class="artist-tagline">${artist.tagline}</p>
      </div>
      <div class="artist-bio">
        ${artist.bio}
      </div>
      <div class="artist-fee-row">
        <div>
          <div class="artist-fee-label">All-inclusive fee</div>
          <div class="artist-fee-note">Includes travel, setup & all equipment</div>
        </div>
        <div class="artist-fee">${formattedFee}</div>
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    const admin = await requireAdmin(request);
    
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      bookingId,
      clientEmail,
      clientName,
      venueName,
      venueAddress,
      eventDate,
      customIntro,
      options,
    } = body;

    if (!bookingId || !clientEmail || !clientName || !options || options.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const formattedDate = eventDate
      ? new Date(eventDate).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

    const djOptions = (options as ArtistOption[]).filter((o) => (o.artistType || "dj") === "dj");
    const musicianOptions = (options as ArtistOption[]).filter((o) => (o.artistType || "dj") === "musician");
    const hasDJ = djOptions.length > 0;
    const hasMusician = musicianOptions.length > 0;
    if (!hasDJ && !hasMusician) {
      return NextResponse.json(
        { error: "No valid options: include at least one DJ or musician" },
        { status: 400 }
      );
    }

    const sortRec = (arr: ArtistOption[]) =>
      [...arr].sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));
    const djCards = sortRec(djOptions).map((o) => buildArtistCard(o, "dj")).join("");
    const musicianCards = sortRec(musicianOptions).map((o) => buildArtistCard(o, "musician")).join("");

    let subjectLabel: string;
    if (hasDJ && hasMusician) subjectLabel = "DJ & Musician";
    else if (hasDJ) subjectLabel = "DJ";
    else subjectLabel = "Musician";

    const introBlurb = customIntro
      ? `<p>${customIntro}</p>`
      : `<p>Thank you for getting in touch about your event at <strong>${venueName}</strong>!</p>`;
    const optionsIntro =
      hasDJ && hasMusician
        ? `<p>Based on your requirements, we've put together <strong>${djOptions.length} DJ option${djOptions.length !== 1 ? "s" : ""}</strong> and <strong>${musicianOptions.length} musician option${musicianOptions.length !== 1 ? "s" : ""}</strong> for you to consider:</p>`
        : hasDJ
          ? `<p>Based on your requirements, we've put together ${djOptions.length > 1 ? `${djOptions.length} fantastic DJ options` : "a fantastic DJ option"} for you to consider:</p>`
          : `<p>Based on your requirements, we've put together ${musicianOptions.length > 1 ? `${musicianOptions.length} fantastic musician options` : "a fantastic musician option"} for you to consider:</p>`;

    const djSection =
      hasDJ &&
      `<h2>Your DJ Option${djOptions.length > 1 ? "s" : ""}</h2>${djCards}`;
    const musicianSection =
      hasMusician &&
      `<h2>Your Musician Option${musicianOptions.length > 1 ? "s" : ""}</h2>${musicianCards}`;
    const allSections = [djSection, musicianSection].filter(Boolean).join("");

    const ctaLabel = hasDJ && hasMusician ? "your entertainment" : hasDJ ? "your DJ" : "your musician";
    const ctaButton = hasDJ && hasMusician ? "Book Your DJ & Musician" : hasDJ ? "Book Your DJ" : "Book Your Musician";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://stylishentertainment.co.uk";
    const bookingFormUrl = `${baseUrl}/book-dj`;
    const followUp =
      hasDJ && hasMusician
        ? "<p>All our DJs and musicians are available on your date. If you'd like to discuss further or arrange a quick call, just let us know!</p>"
        : hasDJ
          ? "<p>All our DJs are available on your date. If you'd like to discuss further or arrange a quick call, just let us know!</p>"
          : "<p>All our musicians are available on your date. If you'd like to discuss further or arrange a quick call, just let us know!</p>";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${EMAIL_STYLES}
        </head>
        <body style="background-color: #ffffff;">
          <div class="email-container" style="background-color: #ffffff !important;">
            <div class="header">
              <img src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png" alt="STYLISH ENTERTAINMENT" style="max-width: 200px; height: auto; margin-bottom: 8px; display: block; margin-left: auto; margin-right: auto;" />
              <p style="font-size: 11px; color: #D4AF37; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin: 0; font-family: Arial, sans-serif;">Stylish Entertainment</p>
              <div class="divider"></div>
            </div>
            <div class="content">
              <h1>Your ${subjectLabel} Enquiry - Options & Quote</h1>
              
              <p>Dear ${clientName},</p>
              
              ${introBlurb}
              
              ${optionsIntro}
              
              <div class="event-box">
                <div class="event-row">
                  <span class="event-label">Event Date:</span>
                  <span class="event-value">${formattedDate}</span>
                </div>
                <div class="event-row">
                  <span class="event-label">Venue:</span>
                  <span class="event-value">${venueName}${venueAddress ? `<br>${venueAddress}` : ""}</span>
                </div>
              </div>
              
              ${allSections}

              <div class="cta-section">
                <p class="cta-text">Ready to secure ${ctaLabel}?</p>
                <a href="${bookingFormUrl}" class="cta-button">${ctaButton}</a>
                <p class="cta-subtext" style="color: #1a1a1a !important;">Click above to complete your booking online — no password needed.</p>
              </div>

              ${followUp}
              
              <div class="signature">
                <p>Kind Regards,<br><strong>Ali & Nige</strong></p>
                <div style="background: #f8f9fa; padding: 15px 20px; border-radius: 6px; font-size: 14px;">
                  <p style="margin: 0 0 8px; color: #333;"><strong>📞 Call us:</strong> <a href="tel:+447970793177" style="color: #D4AF37; text-decoration: none;">+44 7970 793177</a></p>
                  <p style="margin: 0 0 8px; color: #333;"><strong>✉️ Email:</strong> <a href="mailto:info@stylishentertainment.co.uk" style="color: #D4AF37; text-decoration: none;">info@stylishentertainment.co.uk</a></p>
                  <p style="margin: 0; color: #333;"><strong>🌐 Website:</strong> <a href="https://stylishentertainment.co.uk" style="color: #D4AF37; text-decoration: none;">stylishentertainment.co.uk</a></p>
                </div>
              </div>
            </div>
            <div class="footer">
              <p>Stylish Entertainment Ltd</p>
              <p>West Country | London | Nationwide</p>
              <p style="margin-top: 15px;">
                <a href="https://stylishentertainment.co.uk">Visit our website</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    const emailConfig = getResendConfig("booking");
    const resend = getResend();
    
    let messageId = `dev-mock-${Date.now()}`;
    
    const emailSubject = `Your ${subjectLabel} Enquiry - ${venueName} on ${formattedDate}`;
    if (resend) {
      const sendResult = await resend.emails.send({
        from: emailConfig.from,
        replyTo: emailConfig.replyTo,
        to: [clientEmail],
        subject: emailSubject,
        html: emailHtml,
      });
      messageId = sendResult.data?.id || messageId;
    } else {
      console.log("[DEV MODE] Would send artist quote email to:", clientEmail);
      console.log("[DEV MODE] Subject:", emailSubject);
      console.log("[DEV MODE] Options:", options.map((o: ArtistOption) => `${o.name} (${o.artistType || "dj"}): £${o.fee}`).join(", "));
    }

    // Log to booking metadata
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { emailsSent: true },
      });

      if (booking) {
        const existingMetadata = (booking.emailsSent as any) || {};
        const artistQuotes = existingMetadata.artistQuotes || [];

        artistQuotes.push({
          sentAt: new Date().toISOString(),
          sentBy: admin?.name || admin?.email || "System",
          subjectLabel,
          options: (options as ArtistOption[]).map((o) => ({
            name: o.name,
            fee: o.fee,
            recommended: o.recommended,
            artistType: o.artistType || "dj",
          })),
        });

        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            emailsSent: {
              ...existingMetadata,
              artistQuotes,
            } as any,
            lastEmailSentAt: new Date(),
          },
        });
      }
    } catch (dbError) {
      console.error("Error logging artist quote to database:", dbError);
    }

    const isDevelopment = !getResend();
    return NextResponse.json({
      success: true,
      messageId,
      message: isDevelopment
        ? `[DEV MODE] ${subjectLabel} quote would be sent to ${clientEmail}`
        : `${subjectLabel} quote sent successfully`,
      devMode: isDevelopment,
    });
  } catch (error: any) {
    console.error("Error sending artist quote:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send artist quote" },
      { status: 500 }
    );
  }
}
