import { MondayBrief } from "./monday-brief";
import { getEmailUrl } from "./get-base-url";

/**
 * Generate the HTML email template for Monday Morning Brief
 */
export function generateMondayBriefEmail(brief: MondayBrief, baseUrl?: string): string {
  const hasActions = brief.totalActions > 0;

  if (!hasActions) {
    return generateAllClearEmail(brief.weekOf);
  }

  const siteUrl = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Monday Morning Brief - STYLISH Entertainment</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f5f5f5;
      color: #1A1A1A;
      line-height: 1.6;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-top: 2px solid #000000;
    }
    
    .header {
      background-color: #ffffff;
      padding: 40px 30px;
      text-align: center;
      border-bottom: 1px solid #e5e5e5;
    }
    
    .header h1 {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 32px;
      font-weight: 600;
      color: #1A1A1A;
      margin: 0;
      letter-spacing: 0.5px;
    }
    
    .greeting {
      background-color: #ffffff;
      padding: 30px;
      border-bottom: 1px solid #e5e5e5;
    }
    
    .greeting p {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 18px;
      color: #1A1A1A;
      margin: 0;
      line-height: 1.8;
    }
    
    .section {
      padding: 30px;
      border-bottom: 1px solid #e5e5e5;
    }
    
    .section:last-child {
      border-bottom: none;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .section-title {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 24px;
      font-weight: 600;
      margin: 0;
      margin-left: 12px;
      color: #1A1A1A;
    }
    
    .section-title.red {
      color: #dc2626;
    }
    
    .section-title.gold {
      color: #d4af37;
    }
    
    .section-title.blue {
      color: #2563eb;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .badge.red {
      background-color: #fee2e2;
      color: #dc2626;
    }
    
    .badge.gold {
      background-color: #fef3c7;
      color: #b45309;
    }
    
    .badge.blue {
      background-color: #dbeafe;
      color: #2563eb;
    }
    
    .action-item {
      background-color: #f9fafb;
      border-left: 4px solid;
      padding: 20px;
      margin-bottom: 16px;
      border-radius: 4px;
    }
    
    .action-item.red {
      border-left-color: #dc2626;
      background-color: #fef2f2;
    }
    
    .action-item.gold {
      border-left-color: #d4af37;
      background-color: #fffbeb;
    }
    
    .action-item.blue {
      border-left-color: #2563eb;
      background-color: #eff6ff;
    }
    
    .action-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    
    .action-title {
      font-weight: 600;
      font-size: 16px;
      color: #1A1A1A;
      margin: 0;
    }
    
    .action-days {
      font-size: 14px;
      color: #1A1A1A;
      font-weight: 500;
    }
    
    .action-details {
      font-size: 14px;
      color: #1A1A1A;
      margin: 8px 0;
    }
    
    .action-reason {
      font-size: 13px;
      color: #1A1A1A;
      font-style: italic;
      margin: 8px 0;
    }
    
    a {
      color: #D4AF37;
      text-decoration: underline;
    }
    
    .action-button {
      display: inline-block;
      margin-top: 12px;
      padding: 12px 24px;
      background-color: #000000;
      color: #FFFFFF;
      text-decoration: none;
      border-radius: 2px;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: background-color 0.2s;
    }
    
    .action-button:hover {
      background-color: #333333;
    }
    
    .action-button.red {
      background-color: #000000;
      color: #FFFFFF;
    }
    
    .action-button.red:hover {
      background-color: #333333;
    }
    
    .action-button.gold {
      background-color: #000000;
      color: #FFFFFF;
    }
    
    .action-button.gold:hover {
      background-color: #333333;
    }
    
    .action-button.blue {
      background-color: #000000;
      color: #FFFFFF;
    }
    
    .action-button.blue:hover {
      background-color: #333333;
    }
    
    a {
      color: #D4AF37;
      text-decoration: underline;
    }
    
    .footer {
      background-color: #1a1a1a !important;
      padding: 30px;
      text-align: center;
      color: #cccccc !important;
      font-size: 12px;
    }
    
    .footer p {
      margin: 4px 0;
      color: #cccccc !important;
    }
    
    .footer a {
      color: #cccccc !important;
    }
    
    @media (prefers-color-scheme: dark) {
      .email-container { background-color: #ffffff !important; }
      .footer { background-color: #1a1a1a !important; }
      .footer p { color: #cccccc !important; }
      .footer a { color: #cccccc !important; }
    }
    
    .empty-state {
      text-align: center;
      padding: 40px 30px;
      color: #6b7280;
    }
    
    .empty-state-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    
    .summary {
      background-color: #f9fafb;
      padding: 20px 30px;
      border-top: 1px solid #e5e5e5;
      text-align: center;
    }
    
    .summary-text {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>STYLISH Entertainment</h1>
    </div>
    
    <!-- Greeting -->
    <div class="greeting">
      <p>Good morning Ali & Nige,<br>here is your STYLISH briefing for the week of ${brief.weekOf}.</p>
    </div>
    
    ${brief.redActions.length > 0 ? `
    <!-- Red Actions Section -->
    <div class="section">
      <div class="section-header">
        <span class="badge red">Urgent</span>
        <h2 class="section-title red">Actions Required</h2>
      </div>
      ${brief.redActions.map(action => `
        <div class="action-item red">
          <div class="action-header">
            <div>
              <p class="action-title">${action.clientName} @ ${action.venueName}</p>
              <p class="action-days">${action.daysRemaining === 0 ? 'Today' : action.daysRemaining === 1 ? 'Tomorrow' : `${action.daysRemaining} days`} • ${action.eventDate}</p>
            </div>
          </div>
          <p class="action-reason">${action.reason}</p>
          <a href="${action.directLink}" class="action-button red">View Booking →</a>
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    ${brief.goldActions.length > 0 ? `
    <!-- Gold Actions Section -->
    <div class="section">
      <div class="section-header">
        <span class="badge gold">Client</span>
        <h2 class="section-title gold">Portal Messages</h2>
      </div>
      ${brief.goldActions.map(action => `
        <div class="action-item gold">
          <div class="action-header">
            <div>
              <p class="action-title">${action.clientName} @ ${action.venueName}</p>
              <p class="action-days">${action.daysRemaining === 0 ? 'Today' : action.daysRemaining === 1 ? 'Tomorrow' : `${action.daysRemaining} days`} • ${action.eventDate}</p>
            </div>
          </div>
          <p class="action-reason">${action.reason}</p>
          <a href="${action.directLink}" class="action-button gold">View Messages →</a>
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    ${brief.blueActions.length > 0 ? `
    <!-- Blue Actions Section -->
    <div class="section">
      <div class="section-header">
        <span class="badge blue">Staff</span>
        <h2 class="section-title blue">Staff Confirmations</h2>
      </div>
      ${brief.blueActions.map(action => `
        <div class="action-item blue">
          <div class="action-header">
            <div>
              <p class="action-title">${action.clientName} @ ${action.venueName}</p>
              <p class="action-days">${action.daysRemaining === 0 ? 'Today' : action.daysRemaining === 1 ? 'Tomorrow' : `${action.daysRemaining} days`} • ${action.eventDate}</p>
            </div>
          </div>
          <p class="action-reason">${action.reason}</p>
          <a href="${action.directLink}" class="action-button blue">View Booking →</a>
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    <!-- Summary -->
    <div class="summary">
      <p class="summary-text">
        <strong>${brief.totalActions}</strong> action${brief.totalActions !== 1 ? 's' : ''} requiring attention this week
      </p>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>STYLISH Entertainment</p>
      <p>88 Weymouth Road, Frome, Somerset BA11 1HJ</p>
      <p style="margin-top: 16px; font-size: 11px;">This is an automated briefing email sent every Monday at 08:00 GMT</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate "All Clear" email when there are no actions
 */
function generateAllClearEmail(weekOf: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Monday Morning Brief - All Clear</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f5f5f5;
      color: #1A1A1A;
      line-height: 1.6;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-top: 2px solid #000000;
    }
    
    .header {
      background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
      padding: 40px 30px;
      text-align: center;
    }
    
    .header h1 {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 600;
      color: #d4af37;
      margin: 0;
      letter-spacing: 0.5px;
    }
    
    .content {
      padding: 60px 30px;
      text-align: center;
    }
    
    .greeting {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      color: #1a1a1a;
      margin-bottom: 30px;
      line-height: 1.8;
    }
    
    .all-clear-icon {
      font-size: 64px;
      margin: 30px 0;
    }
    
    .all-clear-message {
      font-size: 18px;
      color: #059669;
      font-weight: 500;
      margin: 20px 0;
    }
    
    .footer {
      background-color: #1a1a1a !important;
      padding: 30px;
      text-align: center;
      color: #cccccc !important;
      font-size: 12px;
    }
    
    .footer p {
      margin: 4px 0;
      color: #cccccc !important;
    }
    
    .footer a {
      color: #cccccc !important;
    }
    
    @media (prefers-color-scheme: dark) {
      .email-container { background-color: #ffffff !important; }
      .footer { background-color: #1a1a1a !important; }
      .footer p { color: #cccccc !important; }
      .footer a { color: #cccccc !important; }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>STYLISH Entertainment</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Good morning Ali & Nige,<br>here is your STYLISH briefing for the week of ${weekOf}.</p>
      
      <div class="all-clear-icon">✅</div>
      
      <p class="all-clear-message">All Clear</p>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
        No urgent actions required this week. All bookings are on track.
      </p>
    </div>
    
    <div class="footer">
      <p>STYLISH Entertainment</p>
      <p>88 Weymouth Road, Frome, Somerset BA11 1HJ</p>
      <p style="margin-top: 16px; font-size: 11px;">This is an automated briefing email sent every Monday at 08:00 GMT</p>
    </div>
  </div>
</body>
</html>
  `;
}
