/**
 * Staff Confirmation Email Template
 * Luxe Gatsby branded email template for staff confirmations
 * British English spelling throughout
 */

import { EMAIL_LOGO_HTML } from "@/lib/email-signature";

export interface StaffConfirmationData {
  staffName: string;
  eventDate: string;
  venueName: string;
  role: string;
  agreedFee: number;
  senderName: string; // "Nige" or "Ali"
}

const LUXE_STYLES = `
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #1A1A1A;
      background-color: #ffffff;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-top: 2px solid #000000;
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
    
    p {
      margin: 0 0 16px;
      color: #1A1A1A;
    }
    
    .highlight {
      font-weight: 500;
      color: #1A1A1A;
    }
    
    a {
      color: #D4AF37;
      text-decoration: underline;
    }
    
    .footer {
      padding: 20px 30px;
      text-align: center;
      font-size: 14px;
      color: #1A1A1A;
      border-top: 1px solid #E5E5E5;
      margin-top: 30px;
    }
    
    .footer a {
      color: #D4AF37;
      text-decoration: underline;
    }
  </style>
`;

export function staffConfirmationEmail(data: StaffConfirmationData): { subject: string; html: string } {
  const formattedFee = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(data.agreedFee);

  const html = `
<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Date Confirmation - ${data.venueName}</title>
${LUXE_STYLES}
</head>
<body>
  <div class="email-container">
    <div class="header">
      ${EMAIL_LOGO_HTML}
    </div>
    <div class="divider"></div>
    
    <div class="content">
      <p>Hi ${data.staffName},</p>
      
      <p>${data.senderName} here from STYLISH Entertainment.</p>
      
      <p>This is a formal confirmation to hold <span class="highlight">${data.eventDate}</span> for <span class="highlight">${data.venueName}</span>.</p>
      
      <p>We have you down for <span class="highlight">${data.role}</span> at the agreed fee of <span class="highlight">${formattedFee}</span>.</p>
      
      <p>Full production details and timings will follow closer to the date.</p>
      
      <p>Please reply to this email to acknowledge.</p>
      
      <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 14px; color: #555555;">
        Best regards,<br><strong>${data.senderName}</strong><br>STYLISH Entertainment
      </p>
    </div>
    
    <div class="divider"></div>
    
    <div class="footer">
      <p style="margin-bottom: 8px;">STYLISH Entertainment & Production</p>
      <p style="margin-bottom: 8px;">info@stylishentertainment.co.uk</p>
      <p style="margin-top: 15px;">
        <a href="https://stylishentertainment.co.uk">stylishentertainment.co.uk</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const subject = `Date Confirmation - ${data.venueName} (${data.eventDate})`;

  return { subject, html };
}
