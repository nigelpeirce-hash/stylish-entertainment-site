/**
 * Email Journey Templates
 * Customer Lifecycle Email Templates with Luxe Gatsby Branding
 * British English spelling throughout
 */

export type JourneyStage =
  | "inquiry-autoresponder"
  | "booking-confirmation"
  | "4-week-checkin"
  | "week-of-excitement"
  | "post-wedding-magic";

export interface JourneyEmailData {
  clientName: string;
  eventType?: string;
  eventDate?: string;
  venueName?: string;
  clientAdminUrl?: string;
  brochureUrl?: string;
}

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
    
    .link {
      color: #D4AF37;
      text-decoration: none;
    }
    
    .link:hover {
      text-decoration: underline;
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
    
    .highlight {
      color: #D4AF37;
      font-weight: 500;
    }
  </style>
`;

function buildEmailTemplate(
  subject: string,
  contentHtml: string,
  data: JourneyEmailData
): { subject: string; html: string } {
  const processedSubject = subject.replace(/\{\{clientName\}\}/g, data.clientName || "there");
  const processedHtml = contentHtml
    .replace(/\{\{clientName\}\}/g, data.clientName || "there")
    .replace(/\{\{eventType\}\}/g, data.eventType || "your event")
    .replace(/\{\{eventDate\}\}/g, data.eventDate || "your event date")
    .replace(/\{\{venueName\}\}/g, data.venueName || "your venue")
    .replace(/\{\{clientAdminUrl\}\}/g, data.clientAdminUrl || "#")
    .replace(/\{\{brochureUrl\}\}/g, data.brochureUrl || "#");

  const html = `
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
            ${processedHtml}
          </div>
          <div class="footer">
            <p>Stylish Entertainment</p>
            <p>West Country | London | Nationwide</p>
            <p style="margin-top: 15px;">
              <a href="https://stylishentertainment.co.uk" class="link" style="color: #D4AF37;">Visit our website</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return { subject: processedSubject, html };
}

/**
 * 1. Inquiry Auto-Responder
 * Immediate 'Thank you' with PDF brochure link
 */
export function inquiryAutoresponder(data: JourneyEmailData) {
  const contentHtml = `
    <h1>Thank You for Your Inquiry</h1>
    <p>Dear {{clientName}},</p>
    <p>Thank you for reaching out to Stylish Entertainment. We're delighted that you're considering us for {{eventType}} on {{eventDate}}.</p>
    <p>We're excited to learn more about your vision and help bring it to life. We specialise in creating unforgettable celebrations with our expert DJ services, elegant lighting design, and sophisticated venue styling.</p>
    <p>To give you a better sense of what we do, we'd love to share our brochure with you:</p>
    <p style="text-align: center;">
      <a href="{{brochureUrl}}" class="button">Download Our Brochure</a>
    </p>
    <p>We'll be in touch within 24 hours to discuss your requirements in detail. In the meantime, if you have any questions, please don't hesitate to get in touch.</p>
    <div class="signature">
      <p>Warm regards,</p>
      <p><strong>Ali & Nige</strong><br>
      Stylish Entertainment</p>
    </div>
  `;

  return buildEmailTemplate(
    "Thank You for Your Inquiry - Stylish Entertainment",
    contentHtml,
    data
  );
}

/**
 * 2. Booking Confirmation
 * Sent after deposit, includes link to Client Admin
 */
export function bookingConfirmation(data: JourneyEmailData) {
  const contentHtml = `
    <h1>Booking Confirmed</h1>
    <p>Dear {{clientName}},</p>
    <p>Wonderful news! Your booking for {{eventType}} on {{eventDate}} at {{venueName}} has been confirmed.</p>
    <p>We're absolutely thrilled to be part of your special day and look forward to creating a magical atmosphere that reflects your unique vision.</p>
    <h2>What's Next?</h2>
    <p>We've created your personal Client Admin area where you can manage all aspects of your booking:</p>
    <ul style="margin: 20px 0; padding-left: 25px;">
      <li>View and update your event details</li>
      <li>Share your music preferences and playlist</li>
      <li>Track your payment schedule</li>
      <li>Communicate with our team</li>
    </ul>
    <p style="text-align: center;">
      <a href="{{clientAdminUrl}}" class="button">Access Your Client Admin</a>
    </p>
    <p>If you have any questions or need to discuss any changes, please don't hesitate to reach out. We're here to ensure everything runs smoothly.</p>
    <div class="signature">
      <p>Best regards,</p>
      <p><strong>Ali & Nige</strong><br>
      Stylish Entertainment</p>
    </div>
  `;

  return buildEmailTemplate(
    "Booking Confirmed - {{clientName}}",
    contentHtml,
    data
  );
}

/**
 * 3. The 4-Week Check-in
 * Automation to ask for final song choices/logistics
 */
export function fourWeekCheckin(data: JourneyEmailData) {
  const contentHtml = `
    <h1>Let's Finalise Your Details</h1>
    <p>Dear {{clientName}},</p>
    <p>With your {{eventType}} at {{venueName}} just four weeks away ({{eventDate}}), we'd like to make sure everything is perfectly organised.</p>
    <h2>Music Preferences</h2>
    <p>Now's the perfect time to share your music preferences, including:</p>
    <ul style="margin: 20px 0; padding-left: 25px;">
      <li>Your must-play songs</li>
      <li>Any songs you'd prefer to avoid</li>
      <li>Special requests (first dance, ceremony music, etc.)</li>
    </ul>
    <p style="text-align: center;">
      <a href="{{clientAdminUrl}}" class="button">Update Your Music Preferences</a>
    </p>
    <h2>Final Logistics</h2>
    <p>We also want to confirm a few final details to ensure everything runs smoothly on the day. Please review your booking in the Client Admin area and let us know if anything has changed.</p>
    <p>If you have any questions or want to discuss anything, just reply to this email or give us a call. We're here to help!</p>
    <div class="signature">
      <p>Warm regards,</p>
      <p><strong>Ali & Nige</strong><br>
      Stylish Entertainment</p>
    </div>
  `;

  return buildEmailTemplate(
    "4-Week Check-in - Finalising Your {{eventType}} Details",
    contentHtml,
    data
  );
}

/**
 * 4. The 'Week-of' Excitement
 * A short 'We are ready for you' note
 */
export function weekOfExcitement(data: JourneyEmailData) {
  const contentHtml = `
    <h1>We're Ready for You</h1>
    <p>Dear {{clientName}},</p>
    <p>Your {{eventType}} at {{venueName}} is almost here! We can't wait to celebrate with you this coming weekend.</p>
    <p>Everything is in place, and we're ready to create a truly special atmosphere for you and your guests. We've reviewed all your preferences and are excited to bring your vision to life.</p>
    <h2>See You Soon</h2>
    <p>If you need to reach us in the days leading up to your event, we're always just an email or phone call away. Otherwise, we'll see you on {{eventDate}}!</p>
    <p>Relax, enjoy, and let us take care of the entertainment. We've got everything under control.</p>
    <div class="signature">
      <p>Looking forward to celebrating with you,</p>
      <p><strong>Ali & Nige</strong><br>
      Stylish Entertainment</p>
    </div>
  `;

  return buildEmailTemplate(
    "We're Ready for Your {{eventType}} - This Weekend!",
    contentHtml,
    data
  );
}

/**
 * 5. Post-Wedding Magic
 * Sent 3 days after the event, asking for feedback/testimonials
 */
export function postWeddingMagic(data: JourneyEmailData) {
  const contentHtml = `
    <h1>Thank You for Choosing Us</h1>
    <p>Dear {{clientName}},</p>
    <p>We hope your {{eventType}} at {{venueName}} was everything you dreamed of. It was an absolute pleasure to be part of your special day.</p>
    <p>We'd love to hear about your experience. Your feedback helps us continue to create magical moments for couples like you, and it means the world to us.</p>
    <h2>Share Your Experience</h2>
    <p>If you have a moment, we'd be incredibly grateful if you could share your thoughts:</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK" class="button" style="margin-right: 10px; margin-bottom: 10px;">Leave a Google Review</a>
      <a href="https://www.instagram.com/stylishentertainment/" class="button" style="background-color: #E1306C;">Share on Instagram</a>
    </p>
    <p>We'd also love to see any photos from your day if you'd like to share them with us. Tag us <a href="https://www.instagram.com/stylishentertainment/" class="link">@stylishentertainment</a> on Instagram or send them directly to us.</p>
    <p>Thank you again for choosing Stylish Entertainment. It was an honour to be part of your celebration.</p>
    <div class="signature">
      <p>With warmest regards,</p>
      <p><strong>Ali & Nige</strong><br>
      Stylish Entertainment</p>
    </div>
  `;

  return buildEmailTemplate(
    "Thank You - How Was Your {{eventType}}?",
    contentHtml,
    data
  );
}

/**
 * Get email template by journey stage
 */
export function getJourneyEmail(
  stage: JourneyStage,
  data: JourneyEmailData
): { subject: string; html: string } {
  switch (stage) {
    case "inquiry-autoresponder":
      return inquiryAutoresponder(data);
    case "booking-confirmation":
      return bookingConfirmation(data);
    case "4-week-checkin":
      return fourWeekCheckin(data);
    case "week-of-excitement":
      return weekOfExcitement(data);
    case "post-wedding-magic":
      return postWeddingMagic(data);
    default:
      throw new Error(`Unknown journey stage: ${stage}`);
  }
}
