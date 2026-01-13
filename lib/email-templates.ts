interface BookingDetails {
  name: string;
  eventType: string;
  eventDate: Date;
  venueName: string;
  bookingId: string;
}

interface EmailTemplateProps {
  booking: BookingDetails;
  [key: string]: any;
}

// Booking Confirmation Email (sent 2 days after booking)
export function bookingConfirmationEmail({ booking }: EmailTemplateProps): { subject: string; html: string } {
  const subject = `Booking Confirmation - ${booking.eventType} at ${booking.venueName}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #d4af37; color: #000; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .footer { background: #333; color: #fff; padding: 20px; text-align: center; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #d4af37; color: #000; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
        .details { background: #fff; padding: 20px; margin: 20px 0; border-left: 4px solid #d4af37; }
        .details p { margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Stylish Entertainment</h1>
        </div>
        <div class="content">
          <h2>Booking Confirmation</h2>
          <p>Dear ${booking.name},</p>
          <p>Thank you for your booking with Stylish Entertainment. We're delighted to be part of your special day!</p>
          
          <div class="details">
            <h3>Your Booking Details:</h3>
            <p><strong>Event Type:</strong> ${booking.eventType}</p>
            <p><strong>Date:</strong> ${booking.eventDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p><strong>Venue:</strong> ${booking.venueName}</p>
          </div>

          <p>We're currently processing your booking and will be in touch soon to confirm all the details.</p>
          
          <p>In the meantime, if you have any questions or need to make any changes, please don't hesitate to contact us:</p>
          <ul>
            <li>Phone: 07970793177</li>
            <li>Email: info@stylishentertainment.co.uk</li>
          </ul>

          <p>Looking forward to making your celebration extraordinary!</p>
          <p>Best regards,<br>The Team at Stylish Entertainment</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Stylish Entertainment. All rights reserved.</p>
          <p>88 Weymouth Road, Frome, Somerset BA11 1HJ</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}

// Final Details Reminder Email (sent 3 weeks before event)
export function finalDetailsReminderEmail({ booking }: EmailTemplateProps): { subject: string; html: string } {
  const daysUntil = Math.ceil((booking.eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const subject = `Final Details Required - ${booking.eventType} in ${daysUntil} days`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #d4af37; color: #000; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .footer { background: #333; color: #fff; padding: 20px; text-align: center; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #d4af37; color: #000; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
        .details { background: #fff; padding: 20px; margin: 20px 0; border-left: 4px solid #d4af37; }
        .details p { margin: 10px 0; }
        .urgent { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Stylish Entertainment</h1>
        </div>
        <div class="content">
          <h2>Final Details Required</h2>
          <p>Dear ${booking.name},</p>
          <p>Your ${booking.eventType} at ${booking.venueName} is just ${daysUntil} days away!</p>
          
          <div class="urgent">
            <h3>Action Required:</h3>
            <p>To ensure everything runs smoothly on your special day, we need you to complete your final details and payment.</p>
          </div>

          <div class="details">
            <h3>Your Event:</h3>
            <p><strong>Date:</strong> ${booking.eventDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p><strong>Venue:</strong> ${booking.venueName}</p>
          </div>

          <h3>What You Need to Do:</h3>
          <ol>
            <li><strong>Complete Your DJ Worksheet</strong> - This includes all music preferences, timings, and special requirements</li>
            <li><strong>Confirm Final Payment</strong> - Final balance is due before the event</li>
            <li><strong>Confirm Any Last-Minute Changes</strong> - Let us know if anything has changed</li>
          </ol>

          <p style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://stylishentertainment.co.uk'}/dj-worksheet" class="button">
              Complete DJ Worksheet
            </a>
          </p>

          <p>If you have any questions or need assistance, please contact us:</p>
          <ul>
            <li>Phone: 07970793177</li>
            <li>Email: info@stylishentertainment.co.uk</li>
          </ul>

          <p>We're looking forward to making your celebration truly special!</p>
          <p>Best regards,<br>Alison & The Team at Stylish Entertainment</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Stylish Entertainment. All rights reserved.</p>
          <p>88 Weymouth Road, Frome, Somerset BA11 1HJ</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}

// Payment Reminder Email (sent 2 weeks before event)
export function paymentReminderEmail({ booking }: EmailTemplateProps): { subject: string; html: string } {
  const daysUntil = Math.ceil((booking.eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const subject = `Payment Reminder - ${booking.eventType} in ${daysUntil} days`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #d4af37; color: #000; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .footer { background: #333; color: #fff; padding: 20px; text-align: center; font-size: 12px; }
        .details { background: #fff; padding: 20px; margin: 20px 0; border-left: 4px solid #d4af37; }
        .details p { margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Stylish Entertainment</h1>
        </div>
        <div class="content">
          <h2>Payment Reminder</h2>
          <p>Dear ${booking.name},</p>
          <p>Your ${booking.eventType} at ${booking.venueName} is coming up in ${daysUntil} days!</p>
          
          <div class="details">
            <h3>Final Payment Due</h3>
            <p><strong>Event Date:</strong> ${booking.eventDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p><strong>Venue:</strong> ${booking.venueName}</p>
            <p>Please ensure your final balance is paid before the event date.</p>
          </div>

          <p>Payment can be made by bank transfer or cash on the day. If paying on the day, please ensure payment is made before the DJ starts.</p>

          <p>If you have already made payment, please ignore this reminder. If you have any questions about payment, please contact us:</p>
          <ul>
            <li>Phone: 07970793177</li>
            <li>Email: info@stylishentertainment.co.uk</li>
          </ul>

          <p>Thank you for choosing Stylish Entertainment!</p>
          <p>Best regards,<br>The Team at Stylish Entertainment</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Stylish Entertainment. All rights reserved.</p>
          <p>88 Weymouth Road, Frome, Somerset BA11 1HJ</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}

// Welcome Email (sent immediately after booking)
export function welcomeEmail({ booking }: EmailTemplateProps): { subject: string; html: string } {
  const subject = `Welcome to Stylish Entertainment - ${booking.eventType} Booking`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #d4af37; color: #000; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .footer { background: #333; color: #fff; padding: 20px; text-align: center; font-size: 12px; }
        .details { background: #fff; padding: 20px; margin: 20px 0; border-left: 4px solid #d4af37; }
        .details p { margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Stylish Entertainment</h1>
        </div>
        <div class="content">
          <h2>Thank You for Your Booking!</h2>
          <p>Dear ${booking.name},</p>
          <p>Thank you for choosing Stylish Entertainment for your ${booking.eventType}. We're thrilled to be part of your special day!</p>
          
          <div class="details">
            <h3>Your Booking:</h3>
            <p><strong>Event Type:</strong> ${booking.eventType}</p>
            <p><strong>Date:</strong> ${booking.eventDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p><strong>Venue:</strong> ${booking.venueName}</p>
          </div>

          <p>We'll be in touch within 48 hours to confirm all the details. In the meantime, if you have any questions, please don't hesitate to contact us.</p>

          <p>Phone: 07970793177<br>Email: info@stylishentertainment.co.uk</p>

          <p>Best regards,<br>The Team at Stylish Entertainment</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Stylish Entertainment. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
