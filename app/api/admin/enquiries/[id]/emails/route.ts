import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1") || process.env.NODE_ENV === "development";

    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // Fetch booking for synthetic entries (booking request, deposit invoice, quotes)
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        name: true,
        email: true,
        createdAt: true,
        depositInvoiceSentAt: true,
        emailsSent: true,
        message: true,
        eventDate: true,
        venueName: true,
        eventType: true,
      },
    });

    // Synthetic entries from booking metadata so "Client emails" shows activity even when
    // emails were sent via Resend (no EmailThread/Email record) or form submission (no thread).
    const synthetic: Array<{
      id: string;
      threadId: string | null;
      subject: string;
      fromEmail: string;
      toEmail: string;
      direction: string;
      textContent: string | null;
      htmlContent: string | null;
      createdAt: string;
      receivedAt: string;
    }> = [];

    if (booking) {
      const clientEmail = booking.email || "";
      const createdDate = booking.createdAt
        ? new Date(booking.createdAt as Date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
        : "";
      const eventDateStr = booking.eventDate
        ? new Date(booking.eventDate as Date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
        : "—";
      const venueName = (booking.venueName || "").trim() || "—";
      const eventType = (booking.eventType || "event").trim();
      const clientMessage = (booking.message || "").trim();
      // Always provide a body for "Booking request received" so the thread has full history context
      const bookingRequestBody = [
        `This booking was created on ${createdDate}.`,
        "",
        `Client: ${(booking.name || "").trim() || "—"}`,
        `Email: ${clientEmail || "—"}`,
        `Event: ${eventType} on ${eventDateStr}`,
        `Venue: ${venueName}`,
        ...(clientMessage ? ["", "Message from client:", clientMessage] : []),
      ].join("\n");

      synthetic.push({
        id: `synthetic-booking-request-${bookingId}`,
        threadId: null,
        subject: "Booking request received",
        fromEmail: clientEmail,
        toEmail: "enquiries",
        direction: "inbound",
        textContent: bookingRequestBody,
        htmlContent: null,
        createdAt: (booking.createdAt as Date).toISOString(),
        receivedAt: (booking.createdAt as Date).toISOString(),
      });

      if (booking.depositInvoiceSentAt) {
        const depositDate = new Date(booking.depositInvoiceSentAt as Date).toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        synthetic.push({
          id: `synthetic-deposit-invoice-${bookingId}`,
          threadId: null,
          subject: "Deposit invoice sent",
          fromEmail: "Stylish Entertainment",
          toEmail: clientEmail,
          direction: "outbound",
          textContent: `Deposit invoice was sent to the client on ${depositDate}.\n\nPayment details and instructions were included. The client can pay the deposit to secure their booking.`,
          htmlContent: null,
          createdAt: (booking.depositInvoiceSentAt as Date).toISOString(),
          receivedAt: (booking.depositInvoiceSentAt as Date).toISOString(),
        });
      }

      const emailsSent = booking.emailsSent as { artistQuotes?: { sentAt: string }[] } | undefined;
      const quotes = emailsSent?.artistQuotes;
      if (Array.isArray(quotes) && quotes.length > 0) {
        const last = quotes[quotes.length - 1];
        const sentAt = last?.sentAt;
        if (sentAt) {
          const quoteDate = new Date(sentAt).toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          synthetic.push({
            id: `synthetic-artist-quote-${bookingId}`,
            threadId: null,
            subject: "Options & quote sent",
            fromEmail: "Stylish Entertainment",
            toEmail: clientEmail,
            direction: "outbound",
            textContent: `Options and quote (DJ/musician and services) were sent to the client on ${quoteDate}.\n\nThe client can review the quote and confirm via the link in the email.`,
            htmlContent: null,
            createdAt: sentAt,
            receivedAt: sentAt,
          });
        }
      }
    }

    // Fetch email threads for this booking (relation is Email, not emails)
    const emailThreads = await prisma.emailThread.findMany({
      where: {
        bookingId,
      },
      include: {
        Email: {
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
      (thread.Email || []).map((email) => ({
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

    // Combine real emails, WhatsApp, and synthetic entries; sort by date descending
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
      ...synthetic,
    ].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ emails: allEmails });
  } catch (error) {
    console.error("Error fetching email history:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
