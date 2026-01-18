import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getResendConfig } from "@/lib/email-config";
import { getResourceById } from "@/lib/master-resources";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    
    p {
      margin: 0 0 16px;
      color: #333333;
    }
    
    .button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #1a1a1a;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 2px;
      font-weight: 500;
      margin: 20px 0;
      transition: background-color 0.3s;
    }
    
    .button:hover {
      background-color: #333333;
    }
    
    .footer {
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #666666;
      border-top: 1px solid #e5e5e5;
      margin-top: 30px;
    }
    
    .signature {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
    }
  </style>
`;

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, clientEmail, clientName, resourceId } = body;

    if (!bookingId || !clientEmail || !clientName || !resourceId) {
      return NextResponse.json(
        { error: "Missing required fields: bookingId, clientEmail, clientName, resourceId" },
        { status: 400 }
      );
    }

    // Get the resource details
    const resource = getResourceById(resourceId);
    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    // Generate tracking URL for the PDF
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylishentertainment.co.uk";
    const trackingUrl = `${baseUrl}/api/track-download?id=${bookingId}&file=${resourceId}`;

    // Generate email HTML
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
              <h1>A Resource for You</h1>
              <p>Dear ${clientName},</p>
              <p>We thought you might find this resource helpful as you plan your celebration. Please find below a link to download <strong>${resource.name}</strong>.</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${trackingUrl}" class="button">Download ${resource.name}</a>
              </p>
              <p>If you have any questions about this resource or would like to discuss your event in more detail, please don't hesitate to get in touch.</p>
              <div class="signature">
                <p>Best regards,</p>
                <p><strong>Nigel & Ali</strong><br>
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

    // Use centralised email config with dynamic sender name for booking emails
    const emailConfig = getResendConfig("booking");

    // Send email via Resend
    const result = await resend.emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: [clientEmail],
      subject: `${resource.name} - Stylish Entertainment`,
      html: emailHtml,
    });

    // Log the resource send to booking metadata
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { emailsSent: true },
      });

      if (booking) {
        const existingMetadata = (booking.emailsSent as any) || {};
        const resourceSends = existingMetadata.resourceSends || [];

        resourceSends.push({
          resourceId,
          resourceName: resource.name,
          sentAt: new Date().toISOString(),
          sentBy: admin.name || admin.email,
        });

        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            emailsSent: {
              ...existingMetadata,
              resourceSends,
            } as any,
          },
        });
      }
    } catch (dbError) {
      console.error("Error logging resource send to database:", dbError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      messageId: result.data?.id,
      message: "Resource sent successfully",
    });
  } catch (error: any) {
    console.error("Error sending resource email:", error);
    return NextResponse.json(
      {
        error: "Failed to send resource email",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
