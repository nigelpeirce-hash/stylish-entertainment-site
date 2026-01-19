import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getResendConfig } from "@/lib/email-config";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

// Lazy initialization
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
};

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const LUXE_STYLES = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500&display=swap');
    
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
    
    .logo {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 700;
      color: #1a1a1a;
      letter-spacing: 2px;
      margin-bottom: 10px;
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
      font-size: 22px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 25px 0 15px;
    }
    
    p {
      margin: 0 0 16px;
      color: #333333;
    }
    
    .details-box {
      background-color: #f8f9fa;
      border-left: 4px solid #D4AF37;
      padding: 20px;
      margin: 20px 0;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e5e5;
    }
    
    .detail-row:last-child {
      border-bottom: none;
    }
    
    .detail-label {
      font-weight: 600;
      color: #1a1a1a;
    }
    
    .detail-value {
      color: #333333;
    }
    
    .rider-section {
      margin: 20px 0;
      padding: 15px;
      background-color: #fff9e6;
      border: 1px solid #D4AF37;
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
  </style>
`;

export async function POST(request: NextRequest) {
  try {
    // Check if request is from localhost (development only)
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    // In development/localhost, allow access even if admin check fails (for dev bypass)
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
      djName,
      customIntro,
      djFee,
      accommodation,
      food,
      drink,
      mileage,
      mileageCost,
    } = body;

    if (!bookingId || !clientEmail || !clientName || !djFee) {
      return NextResponse.json(
        { error: "Missing required fields: bookingId, clientEmail, clientName, djFee" },
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

    // Build rider requirements section
    let riderSection = "";
    const riderItems: string[] = [];

    if (accommodation) {
      riderItems.push(`<li><strong>Accommodation:</strong> ${accommodation === "Required" ? "Required" : accommodation}</li>`);
    }
    if (food) {
      riderItems.push(`<li><strong>Food:</strong> ${food === "Required" ? "Required" : food}</li>`);
    }
    if (drink) {
      riderItems.push(`<li><strong>Drink:</strong> ${drink === "Required" ? "Required" : drink}</li>`);
    }

    if (riderItems.length > 0) {
      riderSection = `
        <div class="rider-section">
          <h2 style="margin-top: 0;">Rider Requirements</h2>
          <ul style="margin: 10px 0; padding-left: 20px;">
            ${riderItems.join("")}
          </ul>
        </div>
      `;
    }

    // Build mileage section if provided
    let mileageSection = "";
    if (mileage) {
      mileageSection = `
        <div class="detail-row">
          <span class="detail-label">Travel Distance:</span>
          <span class="detail-value">${mileage} miles (return journey)</span>
        </div>
      `;
      if (mileageCost) {
        mileageSection += `
          <div class="detail-row">
            <span class="detail-label">Mileage Cost:</span>
            <span class="detail-value">£${parseFloat(mileageCost).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        `;
      }
    }

    // Format DJ fee
    const formattedFee = parseFloat(djFee).toLocaleString("en-GB", {
      style: "currency",
      currency: "GBP",
    });

    // Build email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${LUXE_STYLES}
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="logo">S</div>
              <div class="divider"></div>
            </div>
            <div class="content">
              <h1>Your DJ Inquiry - Details & Quote</h1>
              <p>Dear ${clientName},</p>
              ${customIntro ? `<p>${customIntro}</p>` : ""}
              <p>Thank you for your interest in our DJ services for your event at <strong>${venueName}</strong> on <strong>${formattedDate}</strong>.</p>
              
              <div class="details-box">
                <h2 style="margin-top: 0;">Booking Details</h2>
                <div class="detail-row">
                  <span class="detail-label">DJ:</span>
                  <span class="detail-value">${djName || "TBC"}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Event Date:</span>
                  <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Venue:</span>
                  <span class="detail-value">${venueName}${venueAddress ? `<br>${venueAddress}` : ""}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">DJ Fee:</span>
                  <span class="detail-value" style="font-size: 18px; font-weight: 600; color: #D4AF37;">${formattedFee}</span>
                </div>
                ${mileageSection}
              </div>

              ${riderSection}

              <p>If you have any questions or would like to discuss any of these details further, please don't hesitate to get in touch.</p>
              
              <div class="signature">
                <p>Best regards,</p>
                <p><strong>Ali & Nige</strong><br>
                Stylish Entertainment</p>
              </div>
            </div>
            <div class="footer">
              <p>Stylish Entertainment</p>
              <p>West Country | London | Nationwide</p>
              <p style="margin-top: 15px;">
                <a href="https://stylishentertainment.co.uk" style="color: #D4AF37; text-decoration: none;">Visit our website</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    const emailConfig = getResendConfig("booking");
    const result = await getResend().emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: [clientEmail],
      subject: `Your DJ Inquiry - ${venueName} on ${formattedDate}`,
      html: emailHtml,
    });

    // Log email send to booking metadata
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { emailsSent: true },
      });

      if (booking) {
        const existingMetadata = (booking.emailsSent as any) || {};
        const djReplies = existingMetadata.djReplies || [];

        djReplies.push({
          sentAt: new Date().toISOString(),
          sentBy: admin?.name || admin?.email || "System",
          djName: djName || "TBC",
          djFee: parseFloat(djFee),
        });

        // Mark as action taken by setting lastEmailSentAt
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            emailsSent: {
              ...existingMetadata,
              djReplies,
            } as any,
            lastEmailSentAt: new Date(), // Mark that admin has taken action
          },
        });
      }
    } catch (dbError) {
      console.error("Error logging DJ reply to database:", dbError);
    }

    return NextResponse.json({
      success: true,
      messageId: result.data?.id,
      message: "DJ inquiry reply sent successfully",
    });
  } catch (error: any) {
    console.error("Error sending DJ inquiry reply:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send DJ inquiry reply" },
      { status: 500 }
    );
  }
}
