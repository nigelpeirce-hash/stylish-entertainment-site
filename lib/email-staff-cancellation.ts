/**
 * Staff Cancellation Email Template
 * Luxe Gatsby branded email template for staff cancellations
 * British English spelling throughout
 */

export interface StaffCancellationData {
  staffName: string;
  eventDate: string;
  venueName: string;
  role: string;
  reason: string;
  senderName: string; // "Nige" or "Ali"
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
    
    .reason-box {
      background-color: #f5f5f0;
      border-left: 3px solid #D4AF37;
      padding: 15px;
      margin: 20px 0;
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

export function staffCancellationEmail(data: StaffCancellationData): { subject: string; html: string } {
  const html = `
<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Cancellation - ${data.venueName}</title>
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
      
      <p>Unfortunately, I need to cancel your assignment for <span class="highlight">${data.eventDate}</span> at <span class="highlight">${data.venueName}</span>.</p>
      
      <p>You were confirmed for <span class="highlight">${data.role}</span>.</p>
      
      <div class="reason-box">
        <p><strong>Reason:</strong> ${data.reason}</p>
      </div>
      
      <p>I apologise for any inconvenience this may cause. We'll keep you in mind for future events.</p>
      
      <p>Best regards,<br>${data.senderName}<br>STYLISH Entertainment</p>
    </div>
    
    <div class="divider"></div>
    
    <div class="footer">
      <p>STYLISH Entertainment & Production</p>
      <p>info@stylishentertainment.co.uk</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const subject = `Job Cancellation - ${data.venueName} (${data.eventDate})`;

  return { subject, html };
}
