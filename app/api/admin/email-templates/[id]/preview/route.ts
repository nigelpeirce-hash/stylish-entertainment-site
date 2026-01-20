import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { 
  fetchLockedEventData, 
  populateEmailTemplate,
} from "@/lib/email-template-utils";
import { 
  ensureBookingReference, 
  getThreadingHeaders,
  generateThreadIdFooter
} from "@/lib/booking-integrity";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Check admin authentication
    const admin = await requireAdmin(request);
    
    // Check if request is from localhost (development only)
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    if (!admin && !isLocalhost) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const templateId = resolvedParams.id;
    const body = await request.json();
    const { bookingId, templateHtml, templateSubject } = body;

    if (!bookingId || !templateHtml || !templateSubject) {
      return NextResponse.json(
        { error: "bookingId, templateHtml, and templateSubject are required" },
        { status: 400 }
      );
    }

    // Fetch locked event data
    const eventData = await fetchLockedEventData(bookingId);

    // Populate template with event data
    const populated = populateEmailTemplate(
      templateHtml,
      templateSubject,
      eventData
    );

    return NextResponse.json({
      success: true,
      previewHtml: populated.html,
      previewSubject: populated.subject,
      contractData: eventData.contractData,
      eventStatus: eventData.status,
    });
  } catch (error: any) {
    console.error("Error generating preview:", error);
    return NextResponse.json(
      {
        error: "Failed to generate preview",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
