/**
 * Email Journey Templates
 * Customer Lifecycle Email Templates with Luxury Brand Aesthetic
 * British English spelling throughout
 * Updated: Luxury brand styling - Charcoal typography, black buttons, gold links
 */

import { SIGNATURE_BLOCK_HTML } from "@/lib/email-signature";

export type JourneyStage =
  | "enquiry-autoresponder"
  | "gentle-reminder"
  | "booking-confirmation"
  | "4-week-checkin"
  | "week-of-excitement"
  | "final-chase"
  | "post-wedding-magic";

export interface JourneyEmailData {
  clientName: string;
  eventType?: string;
  eventDate?: string;
  venueName?: string;
  clientAdminUrl?: string;
  /** Magic-link URL for FINAL_CHASE: /client/bookings/[id]?token=... (no login required) */
  portalMagicUrl?: string;
  brochureUrl?: string;
  /** Artist/DJ name for booking confirmation (e.g. "James") */
  artistName?: string;
  /** Booking fee amount (e.g. "£150") */
  bookingFee?: string;
  /** Balance amount (e.g. "£475") */
  balance?: string;
  /** Booking reference for invoice (e.g. "SE-12345678") – client quotes when paying */
  invoiceReference?: string;
  /** Signed URL for "I've paid" button – triggers notification and flashes Paid in booking */
  markedPaidUrl?: string;
}

const LUXE_STYLES = `
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #1A1A1A;
      background: linear-gradient(180deg, #fdf8f0 0%, #f5f0e8 100%);
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(212, 175, 55, 0.15);
      border: 1px solid rgba(212, 175, 55, 0.25);
    }
    
    .header {
      padding: 0 0 20px;
      text-align: center;
    }
    
    .divider {
      height: 1px;
      background-color: #D4AF37;
      margin: 20px 0;
    }
    
    .content {
      padding: 0;
    }
    
    h1 {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 28px;
      font-weight: 600;
      color: #1A1A1A;
      margin: 0 0 20px;
      line-height: 1.3;
    }
    
    h2 {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 22px;
      font-weight: 600;
      color: #1A1A1A;
      margin: 25px 0 15px;
    }
    
    p {
      margin: 0 0 16px;
      color: #1A1A1A;
    }
    
    .button, .button-luxe {
      display: inline-block;
      padding: 14px 28px;
      background-color: #D4AF37;
      color: #1A1A1A !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      letter-spacing: 0.02em;
      margin: 20px 0;
      box-shadow: 0 4px 14px rgba(212, 175, 55, 0.4);
    }
    
    .button:hover, .button-luxe:hover {
      background-color: #E6C84A;
    }
    
    .link {
      color: #D4AF37;
      text-decoration: underline;
    }
    
    .link:hover {
      text-decoration: underline;
    }
    
    .footer {
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #1A1A1A;
      border-top: 1px solid #e5e5e5;
      margin-top: 30px;
    }
    
    .footer a {
      color: #D4AF37;
      text-decoration: underline;
    }
    
    .signature {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      font-size: 14px;
      color: #555555;
    }
    
    .signature strong {
      color: #555555;
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
    .replace(/\{\{portalMagicUrl\}\}/g, data.portalMagicUrl || data.clientAdminUrl || "#")
    .replace(/\{\{brochureUrl\}\}/g, data.brochureUrl || "#")
    .replace(/\{\{artistName\}\}/g, data.artistName || "your DJ")
    .replace(/\{\{bookingFee\}\}/g, data.bookingFee || "[booking fee]")
    .replace(/\{\{balance\}\}/g, data.balance || "[balance]")
    .replace(/\{\{invoiceReference\}\}/g, data.invoiceReference || "—")
    .replace(/\{\{markedPaidUrl\}\}/g, data.markedPaidUrl || "#")
    .replace(/\{\{signatureBlock\}\}/g, SIGNATURE_BLOCK_HTML);

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
            <img src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png" alt="STYLISH ENTERTAINMENT" style="max-width: 200px; height: auto; margin-bottom: 8px; display: block; margin-left: auto; margin-right: auto;" />
            <p style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 3px; color: #D4AF37; text-align: center; margin: 0; text-transform: uppercase;">Stylish Entertainment</p>
            <div class="divider"></div>
          </div>
          <div class="content">
            ${processedHtml}
          </div>
        </div>
      </body>
    </html>
  `;

  return { subject: processedSubject, html };
}

/**
 * 1. Enquiry Auto-Responder
 * Immediate 'Thank you' – no brochure / download guide
 */
export function enquiryAutoresponder(data: JourneyEmailData) {
  const contentHtml = `
    <h1>Thank You for Your Enquiry</h1>
    <p>Dear {{clientName}},</p>
    <p>Thank you for reaching out to Stylish Entertainment Ltd. We're delighted that you're considering us for {{eventType}} on {{eventDate}}.</p>
    <p>We're excited to learn more about your vision and help bring it to life. We specialise in creating unforgettable celebrations with our expert DJ services, elegant lighting design, and sophisticated venue styling.</p>
    <p>We'll be in touch within 24 hours to discuss your requirements in detail. In the meantime, if you have any questions, please don't hesitate to get in touch.</p>
    {{signatureBlock}}
  `;

  return buildEmailTemplate(
    "Thank You for Your Enquiry - Stylish Entertainment Ltd",
    contentHtml,
    data
  );
}

/**
 * 1.5. Gentle Reminder (3-Day Follow-up)
 * A friendly, gentle follow-up sent 3 days after initial enquiry if no booking confirmed
 */
export function gentleReminder(data: JourneyEmailData) {
  const contentHtml = `
    <h1>Just Following Up</h1>
    <p>Dear {{clientName}},</p>
    <p>We hope you're well and enjoying planning your {{eventType}} for {{eventDate}} at {{venueName}}.</p>
    <p>We wanted to check in and see if you have any questions about our services or if there's anything we can help with. Planning an event can be overwhelming, and we're here to make it easier for you.</p>
    <h2>We're Here to Help</h2>
    <p>Whether you're still exploring your options, have questions about our packages, or want to discuss your vision, we'd love to chat. Every event is unique, and we're passionate about creating something truly special for you.</p>
    <p style="text-align: center;">
      <a href="https://stylishentertainment.co.uk/contact-us" class="button">Get in Touch</a>
    </p>
    <p>If you've already found another solution, no problem at all – we're just pleased you're getting everything sorted for your special day.</p>
    <p>Best of luck with your planning, and please don't hesitate to reach out if you'd like to chat.</p>
    {{signatureBlock}}
  `;

  return buildEmailTemplate(
    "Just Following Up - {{eventType}} at {{venueName}}",
    contentHtml,
    data
  );
}

/**
 * 2. Booking Confirmation
 * Sent after deposit; includes payment terms, worksheet and link to Client Admin.
 *
 * DB field mapping (used when sending via send-email with bookingId):
 * - {{clientName}}     → booking.name
 * - {{artistName}}    → booking.preferredDJ (DJ/artist name)
 * - {{bookingFee}}    → booking.bookingFee (flexible, set in admin Flexible Operator)
 * - {{balance}}       → booking.finalBalance (formatted as £X)
 * - {{eventType}}     → booking.eventType
 * - {{eventDate}}     → formatted booking.eventDate
 * - {{venueName}}     → booking.venueName
 * - {{clientAdminUrl}}→ /client/bookings/[id]
 * - {{invoiceReference}} → booking.bookingReference or SE-{id slice}
 * - {{markedPaidUrl}} → signed link for "I've paid" (notification + flash Paid)
 */
const BOOKING_CONFIRMATION_BANK_BLOCK = `
    <h2>Payment details</h2>
    <p>Please pay the deposit of <strong>{{bookingFee}}</strong> by bank transfer. Use the reference below so we can match your payment.</p>
    <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eee; text-align: left;">
      <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin: 0 0 12px 0;">Bank details</p>
      <p style="font-size: 15px; color: #1a1a1a; margin: 4px 0;"><strong>STYLISH Ent</strong></p>
      <p style="font-size: 15px; color: #1a1a1a; margin: 4px 0;"><strong>Account Number</strong> 83312038</p>
      <p style="font-size: 15px; color: #1a1a1a; margin: 4px 0;"><strong>Sort Code</strong> 20-05-06</p>
      <p style="font-size: 15px; color: #1a1a1a; margin: 4px 0;"><strong>IBAN</strong> GB39 BARC2005 0683312038</p>
      <p style="font-size: 15px; color: #1a1a1a; margin: 4px 0;"><strong>SWIFT BIC</strong> BARC GB22</p>
      <p style="font-size: 15px; color: #1a1a1a; margin: 12px 0 0 0;"><strong>Reference</strong> {{invoiceReference}}</p>
      <p style="font-size: 13px; color: #666; margin: 16px 0 0 0;">STYLISH Entertainment Ltd: Registered in England 07848653</p>
    </div>
    <p style="text-align: center;">
      <a href="{{markedPaidUrl}}" class="button">I've paid</a>
    </p>
`;

export function bookingConfirmation(data: JourneyEmailData) {
  const contentHtml = `
    <h1>Booking Confirmed</h1>
    <p>Dear {{clientName}},</p>
    <p>Lovely to hear from you again and many thanks for sending over your booking request.</p>
    <p>I've spoken with {{artistName}} and he'd love to come and play for you.</p>
    <p>Initially please pay the deposit of {{bookingFee}} to secure {{artistName}}; the balance of {{balance}} is payable to {{artistName}} either in cash on the night or by BACS transfer two weeks before the wedding.</p>
    <p>Once the payment has been made I will forward you a receipt along with a link to our portal. There you can add music requests and send a link to your guests so they can request songs too.</p>
    <p>We request you return the worksheet 3 weeks before the wedding to give {{artistName}} the opportunity to prepare and allow you to focus on other things.</p>
    ${BOOKING_CONFIRMATION_BANK_BLOCK}
    <p>If you have any questions, please don't hesitate to reach out.</p>
    {{signatureBlock}}
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
    {{signatureBlock}}
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
    <p>Everything is in place, and our team is ready to create a truly special atmosphere for you and your guests. We've reviewed all your preferences and are excited to bring your vision to life.</p>
    <h2>See You Soon</h2>
    <p>If you need to reach us in the days leading up to your event, we're always just an email or phone call away. Otherwise, we'll see you on {{eventDate}}!</p>
    <p>Relax, enjoy, and let us take care of the entertainment. We've got everything under control.</p>
    {{signatureBlock}}
  `;

  return buildEmailTemplate(
    "We're Ready for Your {{eventType}} - This Weekend!",
    contentHtml,
    data
  );
}

/**
 * FINAL_CHASE – 3-day chase (event in 2–3 days)
 * Tokenized magic link: no login required. Use {{portalMagicUrl}} for the CTA.
 */
export function finalChase(data: JourneyEmailData) {
  const contentHtml = `
    <h1>Final Details Needed – Your Event Is in 3 Days</h1>
    <p>Dear {{clientName}},</p>
    <p>Your {{eventType}} at {{venueName}} is almost here ({{eventDate}}). We need to lock in your final details so everything runs smoothly on the day.</p>
    <h2>Update Your Final Details Now</h2>
    <p>Please confirm any last-minute changes, dietary requirements, timings, or special requests. Use the link below to access your portal instantly – no login required.</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="{{portalMagicUrl}}" class="button-luxe">CLICK TO ACCESS PORTAL NOW (No Login Required)</a>
    </p>
    <p>If you have any questions, just reply to this email or give us a call. We're here to help.</p>
    {{signatureBlock}}
  `;

  return buildEmailTemplate(
    "Urgent: Final Details for Your {{eventType}} – {{eventDate}}",
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
    <p>We'd love to hear about your experience. Your feedback helps us continue to create magical moments for couples like you, and it means the world to our team.</p>
    <h2>Share Your Experience</h2>
    <p>If you have a moment, we'd be incredibly grateful if you could share your thoughts:</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK" class="button-luxe" style="margin-right: 10px; margin-bottom: 10px;">Leave a Google Review</a>
      <a href="https://www.instagram.com/stylishentertainment/" class="button-luxe">Share on Instagram</a>
    </p>
    <p>We'd also love to see any photos from your day if you'd like to share them with us. Tag us <a href="https://www.instagram.com/stylishentertainment/" class="link">@stylishentertainment</a> on Instagram or send them directly to us.</p>
    <p>Thank you again for choosing Stylish Entertainment Ltd. It was an honour to be part of your celebration.</p>
    {{signatureBlock}}
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
    case "enquiry-autoresponder":
      return enquiryAutoresponder(data);
    case "gentle-reminder":
      return gentleReminder(data);
    case "booking-confirmation":
      return bookingConfirmation(data);
    case "4-week-checkin":
      return fourWeekCheckin(data);
    case "week-of-excitement":
      return weekOfExcitement(data);
    case "final-chase":
      return finalChase(data);
    case "post-wedding-magic":
      return postWeddingMagic(data);
    default:
      throw new Error(`Unknown journey stage: ${stage}`);
  }
}
