/**
 * Staff Confirmation Email Template
 * Luxe Gatsby branded email template for staff confirmations
 * British English spelling throughout
 */

export interface StaffConfirmationData {
  staffName: string;
  eventDate: string;
  venueName: string;
  role: string;
  agreedFee: number;
  senderName: string; // "Nigel" or "Ali"
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
    
    p {
      margin: 0 0 16px;
      color: #333333;
    }
    
    .highlight {
      font-weight: 500;
      color: #1a1a1a;
    }
    
    .footer {
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #666666;
      border-top: 1px solid #E5E5E5;
      margin-top: 30px;
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
      <div class="logo">S</div>
    </div>
    <div class="divider"></div>
    
    <div class="content">
      <p>Hi ${data.staffName},</p>
      
      <p>${data.senderName} here from STYLISH Entertainment.</p>
      
      <p>This is a formal confirmation to hold <span class="highlight">${data.eventDate}</span> for <span class="highlight">${data.venueName}</span>.</p>
      
      <p>We have you down for <span class="highlight">${data.role}</span> at the agreed fee of <span class="highlight">${formattedFee}</span>.</p>
      
      <p>Full production details and timings will follow closer to the date.</p>
      
      <p>Please reply to this email to acknowledge.</p>
      
      <p>Best regards,<br>${data.senderName}<br>STYLISH Entertainment</p>
    </div>
    
    <div class="divider"></div>
    
    <div class="footer">
      <p>STYLISH Entertainment & Production</p>
      <p>office@stylishentertainment.co.uk</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const subject = `Date Confirmation - ${data.venueName} (${data.eventDate})`;

  return { subject, html };
}
