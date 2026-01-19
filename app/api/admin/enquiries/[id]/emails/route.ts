import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1") || process.env.NODE_ENV === "development";

    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookingId = params.id;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // Fetch email threads for this booking
    const emailThreads = await prisma.emailThread.findMany({
      where: {
        bookingId,
      },
      include: {
        emails: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
    });

    // Flatten emails from threads
    const emails = emailThreads.flatMap((thread) =>
      thread.emails.map((email) => ({
        id: email.id,
        threadId: thread.id,
        subject: email.subject,
        fromEmail: email.fromEmail,
        toEmail: email.toEmail,
        direction: email.direction,
        textContent: email.textContent,
        htmlContent: email.htmlContent,
        createdAt: email.createdAt.toISOString(),
        receivedAt: email.receivedAt.toISOString(),
      }))
    );

    // Also fetch WhatsApp messages (CommsLog)
    const whatsappMessages = await prisma.commsLog.findMany({
      where: {
        bookingId,
        platform: "whatsapp",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Combine and format all messages
    const allEmails = [
      ...emails,
      ...whatsappMessages.map((msg) => ({
        id: msg.id,
        threadId: null,
        subject: "WhatsApp Message",
        fromEmail: msg.direction === "inbound" ? msg.phoneNumber || "" : "",
        toEmail: msg.direction === "outbound" ? msg.phoneNumber || "" : "",
        direction: msg.direction,
        textContent: msg.message || "",
        htmlContent: null,
        createdAt: msg.createdAt.toISOString(),
        receivedAt: msg.createdAt.toISOString(),
      })),
    ].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ emails: allEmails });
  } catch (error) {
    console.error("Error fetching email history:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
