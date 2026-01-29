import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidTokenFormat } from "@/lib/brief-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Public route for staff members to acknowledge receipt of final brief
 * Security: Token-based, no authentication required (but token must be valid)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> | { token: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const token = resolvedParams.token;

    if (!token || !isValidTokenFormat(token)) {
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invalid Link - STYLISH Entertainment</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: #fff;
    }
    .container {
      text-align: center;
      padding: 40px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(212, 175, 55, 0.3);
      max-width: 500px;
    }
    h1 { color: #D4AF37; margin-bottom: 20px; }
    p { color: #ccc; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Invalid Confirmation Link</h1>
    <p>This confirmation link is invalid or has expired. Please contact STYLISH Entertainment if you need assistance.</p>
  </div>
</body>
</html>`,
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
    }

    // Find assignment by token, or DispatchConfirmation (artist/DJ worksheet)
    const assignment = await prisma.bookingStaffAssignment.findUnique({
      where: { briefToken: token },
      include: {
        booking: {
          select: {
            id: true,
            name: true,
            venueName: true,
            eventDate: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const dc = !assignment
      ? await prisma.dispatchConfirmation.findUnique({
          where: { token },
          include: {
            booking: {
              select: {
                id: true,
                name: true,
                venueName: true,
                eventDate: true,
              },
            },
          },
        })
      : null;

    if (!assignment && !dc) {
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Link Not Found - STYLISH Entertainment</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: #fff;
    }
    .container {
      text-align: center;
      padding: 40px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(212, 175, 55, 0.3);
      max-width: 500px;
    }
    h1 { color: #D4AF37; margin-bottom: 20px; }
    p { color: #ccc; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Confirmation Link Not Found</h1>
    <p>This confirmation link could not be found. It may have already been used or may have expired. Please contact STYLISH Entertainment if you need assistance.</p>
  </div>
</body>
</html>`,
        { status: 404, headers: { "Content-Type": "text/html" } }
      );
    }

    // Staff: check if already acknowledged
    if (assignment && assignment.briefStatus === "acknowledged") {
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Already Confirmed - STYLISH Entertainment</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: #fff;
    }
    .container {
      text-align: center;
      padding: 40px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(76, 175, 80, 0.3);
      max-width: 500px;
    }
    h1 { color: #4CAF50; margin-bottom: 20px; }
    .checkmark { font-size: 48px; margin-bottom: 20px; }
    p { color: #ccc; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="checkmark">✅</div>
    <h1>Already Confirmed</h1>
    <p>You have already confirmed receipt of the final brief for this event. Thank you!</p>
    <p style="margin-top: 20px; color: #888; font-size: 14px;">
      Event: ${assignment.booking.name} @ ${assignment.booking.venueName}
    </p>
  </div>
</body>
</html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }

    // Artist/DJ (DispatchConfirmation): check if already acknowledged
    if (dc && dc.acknowledgedAt) {
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Already Confirmed - STYLISH Entertainment</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: #fff;
    }
    .container {
      text-align: center;
      padding: 40px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(76, 175, 80, 0.3);
      max-width: 500px;
    }
    h1 { color: #4CAF50; margin-bottom: 20px; }
    .checkmark { font-size: 48px; margin-bottom: 20px; }
    p { color: #ccc; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="checkmark">✅</div>
    <h1>Already Confirmed</h1>
    <p>You have already accepted this booking. Thank you!</p>
    <p style="margin-top: 20px; color: #888; font-size: 14px;">
      Event: ${dc.booking.name} @ ${dc.booking.venueName}
    </p>
  </div>
</body>
</html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }

    // Show confirmation page (staff or artist)
    const booking = assignment?.booking ?? dc!.booking;
    const eventDate = booking.eventDate
      ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Date TBC";

    const roleLine = assignment
      ? `<p><strong>Your Role:</strong> ${assignment.role}</p>`
      : "";

    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Brief Receipt - STYLISH Entertainment</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: #fff;
    }
    .container {
      text-align: center;
      padding: 40px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(212, 175, 55, 0.3);
      max-width: 500px;
    }
    h1 { color: #D4AF37; margin-bottom: 10px; }
    .event-info {
      background: rgba(212, 175, 55, 0.1);
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: left;
    }
    .event-info p {
      margin: 8px 0;
      color: #fff;
    }
    .event-info strong {
      color: #D4AF37;
    }
    .confirm-btn {
      display: inline-block;
      margin-top: 20px;
      padding: 14px 32px;
      background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%);
      color: #1a1a1a;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
      border: none;
    }
    .confirm-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
    }
    .confirm-btn:active {
      transform: translateY(0);
    }
    .loading {
      display: none;
      margin-top: 20px;
      color: #D4AF37;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Confirm Booking</h1>
    <p style="color: #ccc; margin-bottom: 20px;">Please confirm you accept this booking:</p>
    
    <div class="event-info">
      <p><strong>Event:</strong> ${booking.name}</p>
      <p><strong>Venue:</strong> ${booking.venueName}</p>
      <p><strong>Date:</strong> ${eventDate}</p>
      ${roleLine}
    </div>

    <form id="confirmForm" method="POST">
      <button type="submit" class="confirm-btn" id="confirmBtn">
        Yes, I accept the booking
      </button>
      <div class="loading" id="loading">Confirming...</div>
    </form>
  </div>

  <script>
    document.getElementById('confirmForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = document.getElementById('confirmBtn');
      const loading = document.getElementById('loading');
      btn.style.display = 'none';
      loading.style.display = 'block';
      
      try {
        const response = await fetch(window.location.href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          window.location.reload();
        } else {
          alert('Failed to confirm. Please try again or contact STYLISH Entertainment.');
          btn.style.display = 'inline-block';
          loading.style.display = 'none';
        }
      } catch (error) {
        alert('An error occurred. Please try again or contact STYLISH Entertainment.');
        btn.style.display = 'inline-block';
        loading.style.display = 'none';
      }
    });
  </script>
</body>
</html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  } catch (error: any) {
    console.error("Error in brief confirmation GET:", error);
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Error - STYLISH Entertainment</title>
  <style>
    body {
      font-family: 'Inter', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #1a1a1a;
      color: #fff;
      text-align: center;
      padding: 20px;
    }
    .container {
      max-width: 500px;
    }
    h1 { color: #ff4444; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Error</h1>
    <p>An error occurred processing your request. Please contact STYLISH Entertainment.</p>
  </div>
</body>
</html>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}

/**
 * Handle POST request to acknowledge the brief
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> | { token: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const token = resolvedParams.token;

    if (!token || !isValidTokenFormat(token)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    // Find assignment or DispatchConfirmation
    const assignment = await prisma.bookingStaffAssignment.findUnique({
      where: { briefToken: token },
      include: {
        booking: {
          select: {
            id: true,
            name: true,
            venueName: true,
          },
        },
        staff: {
          select: {
            name: true,
          },
        },
      },
    });

    const dc = !assignment
      ? await prisma.dispatchConfirmation.findUnique({
          where: { token },
          include: {
            booking: {
              select: {
                id: true,
                name: true,
                venueName: true,
              },
            },
          },
        })
      : null;

    if (!assignment && !dc) {
      return NextResponse.json({ error: "Assignment or confirmation not found" }, { status: 404 });
    }

    if (assignment) {
      if (assignment.briefStatus === "acknowledged") {
        return NextResponse.json(
          { message: "Already acknowledged", acknowledged: true },
          { status: 200 }
        );
      }
      await prisma.bookingStaffAssignment.update({
        where: { id: assignment.id },
        data: {
          briefStatus: "acknowledged",
          acknowledgedAt: new Date(),
        },
      });
    } else if (dc) {
      if (dc.acknowledgedAt) {
        return NextResponse.json(
          { message: "Already acknowledged", acknowledged: true },
          { status: 200 }
        );
      }
      await prisma.dispatchConfirmation.update({
        where: { id: dc.id },
        data: { acknowledgedAt: new Date() },
      });
    }

    const displayName = assignment?.staff?.name ?? dc?.recipientName ?? "there";
    const booking = assignment?.booking ?? dc!.booking;

    // Return success page
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmed - STYLISH Entertainment</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: #fff;
    }
    .container {
      text-align: center;
      padding: 40px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(76, 175, 80, 0.3);
      max-width: 500px;
    }
    .checkmark {
      font-size: 64px;
      margin-bottom: 20px;
      animation: scaleIn 0.5s ease-out;
    }
    @keyframes scaleIn {
      from { transform: scale(0); }
      to { transform: scale(1); }
    }
    h1 {
      color: #4CAF50;
      margin-bottom: 20px;
    }
    p {
      color: #ccc;
      line-height: 1.6;
      margin: 10px 0;
    }
    .event-info {
      background: rgba(76, 175, 80, 0.1);
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .event-info p {
      margin: 8px 0;
      color: #fff;
    }
    .event-info strong {
      color: #4CAF50;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="checkmark">✅</div>
    <h1>Booking Accepted</h1>
    <p>Thank you, <strong>${displayName}</strong>!</p>
    <p>You have successfully accepted this booking.</p>
    
    <div class="event-info">
      <p><strong>Event:</strong> ${booking.name}</p>
      <p><strong>Venue:</strong> ${booking.venueName}</p>
      ${assignment ? `<p><strong>Your Role:</strong> ${assignment.role}</p>` : ""}
    </div>
    
    <p style="margin-top: 20px; color: #888; font-size: 14px;">
      You can now close this page. We'll see you at the event!
    </p>
  </div>
</body>
</html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  } catch (error: any) {
    console.error("Error acknowledging brief:", error);
    return NextResponse.json(
      { error: "Failed to acknowledge brief" },
      { status: 500 }
    );
  }
}
