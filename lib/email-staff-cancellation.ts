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
    
    .reason-box {
      background-color: #f5f5f0;
      border-left: 3px solid #D4AF37;
      padding: 15px;
      margin: 20px 0;
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
      <img src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png" alt="Stylish Entertainment Logo" style="max-width: 200px; height: auto; margin-bottom: 10px;" />
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

  const subject = `Job Cancellation - ${data.venueName} (${data.eventDate})`;

  return { subject, html };
}
