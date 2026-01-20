import { NextRequest, NextResponse } from "next/server";
import { generateMondayBrief } from "@/lib/monday-brief";
import { generateMondayBriefEmail } from "@/lib/monday-brief-email";
import { sendEmail } from "@/lib/email";
import { getEmailUrl } from "@/lib/get-base-url";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Monday Morning Brief Cron Job
 * 
 * This endpoint should be called every Monday at 08:00 GMT
 * 
 * Security: Requires CRON_SECRET environment variable to prevent unauthorized access
 * 
 * Usage:
 * - Vercel Cron: Add to vercel.json
 * - External Cron: Call this endpoint with ?secret=YOUR_CRON_SECRET
 */
export async function GET(request: NextRequest) {
  try {
    // Security check: Verify cron secret or Vercel cron header
    const { searchParams } = new URL(request.url);
    const providedSecret = searchParams.get("secret");
    const vercelCronHeader = request.headers.get("x-vercel-cron");
    const expectedSecret = process.env.CRON_SECRET;

    // Allow Vercel cron (has x-vercel-cron header) OR secret parameter
    const isVercelCron = vercelCronHeader === "1";
    const isValidSecret = expectedSecret && providedSecret === expectedSecret;

    if (!isVercelCron && !isValidSecret) {
      if (!expectedSecret) {
        console.error("CRON_SECRET not configured in environment variables");
        return NextResponse.json(
          { error: "Cron job not configured - CRON_SECRET missing" },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: "Unauthorized - Invalid secret" },
        { status: 401 }
      );
    }

    // Get base URL for email links
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

    // Generate brief data
    console.log("Generating Monday Morning Brief...");
    const brief = await generateMondayBrief(baseUrl);

    // Generate email HTML
    const emailHtml = generateMondayBriefEmail(brief, baseUrl);

    // Determine subject line
    const subject = brief.totalActions > 0
      ? `Monday Morning Brief - ${brief.totalActions} Action${brief.totalActions !== 1 ? 's' : ''} Required`
      : "Monday Morning Brief - All Clear";

    // Send email
    const recipientEmail = process.env.MONDAY_BRIEF_RECIPIENT || "info@stylishentertainment.co.uk";
    
    console.log(`Sending Monday Morning Brief to ${recipientEmail}...`);
    
    await sendEmail({
      to: recipientEmail,
      subject,
      html: emailHtml,
      text: generatePlainTextBrief(brief),
    });

    console.log("Monday Morning Brief sent successfully");

    return NextResponse.json({
      success: true,
      message: "Monday Morning Brief sent",
      brief: {
        weekOf: brief.weekOf,
        totalActions: brief.totalActions,
        redActions: brief.redActions.length,
        goldActions: brief.goldActions.length,
        blueActions: brief.blueActions.length,
      },
    });
  } catch (error: any) {
    console.error("Error sending Monday Morning Brief:", error);
    return NextResponse.json(
      {
        error: "Failed to send Monday Morning Brief",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Generate plain text version of the brief
 */
function generatePlainTextBrief(brief: any): string {
  if (brief.totalActions === 0) {
    return `Good morning Ali & Nige,

Here is your STYLISH briefing for the week of ${brief.weekOf}.

✅ All Clear

No urgent actions required this week. All bookings are on track.

---
STYLISH Entertainment
88 Weymouth Road, Frome, Somerset BA11 1HJ

This is an automated briefing email sent every Monday at 08:00 GMT`;
  }

  let text = `Good morning Ali & Nige,

Here is your STYLISH briefing for the week of ${brief.weekOf}.

${brief.redActions.length > 0 ? `
URGENT ACTIONS (${brief.redActions.length}):
${brief.redActions.map((a: any, i: number) => 
  `${i + 1}. ${a.clientName} @ ${a.venueName}
   ${a.eventDate} (${a.daysRemaining} days)
   ${a.reason}
   Link: ${a.directLink}
`).join('\n')}
` : ''}

${brief.goldActions.length > 0 ? `
PORTAL MESSAGES (${brief.goldActions.length}):
${brief.goldActions.map((a: any, i: number) => 
  `${i + 1}. ${a.clientName} @ ${a.venueName}
   ${a.eventDate} (${a.daysRemaining} days)
   ${a.reason}
   Link: ${a.directLink}
`).join('\n')}
` : ''}

${brief.blueActions.length > 0 ? `
STAFF CONFIRMATIONS (${brief.blueActions.length}):
${brief.blueActions.map((a: any, i: number) => 
  `${i + 1}. ${a.clientName} @ ${a.venueName}
   ${a.eventDate} (${a.daysRemaining} days)
   ${a.reason}
   Link: ${a.directLink}
`).join('\n')}
` : ''}

Total: ${brief.totalActions} action${brief.totalActions !== 1 ? 's' : ''} requiring attention this week.

---
STYLISH Entertainment
88 Weymouth Road, Frome, Somerset BA11 1HJ

This is an automated briefing email sent every Monday at 08:00 GMT`;

  return text;
}
