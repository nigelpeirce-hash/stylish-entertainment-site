import nodemailer from "nodemailer";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

interface SendEmailOptions {
  inboxId: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyToMessageId?: string; // For replying to existing emails
  threadId?: string;
  sentByUserId: string;
}

export async function sendEmailFromCRM(options: SendEmailOptions) {
  try {
    const inbox = await prisma.emailInbox.findUnique({
      where: { id: options.inboxId },
    });

    if (!inbox) {
      throw new Error("Inbox not found");
    }

    if (!inbox.smtpHost || !inbox.smtpUsername || !inbox.smtpPassword) {
      throw new Error("SMTP not configured for this inbox");
    }

    // Create transporter
    // Port 465 = implicit TLS (secure: true). Port 587/25 = STARTTLS (secure: false).
    // Using secure: true on 587 causes "wrong version number" – server sends plain first.
    const port = inbox.smtpPort ?? 587;
    const secure = port === 465;
    const transporter = nodemailer.createTransport({
      host: inbox.smtpHost,
      port,
      secure,
      auth: {
        user: inbox.smtpUsername,
        pass: inbox.smtpPassword,
      },
    });

    // Prepare email
    const toArray = Array.isArray(options.to) ? options.to : [options.to];
    const toAddresses = toArray.map((email) => email.toLowerCase());

    const mailOptions: any = {
      from: `${inbox.name || "Stylish Entertainment Ltd"} <${inbox.email}>`,
      to: toAddresses.join(", "),
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    // Add In-Reply-To header if replying
    if (options.replyToMessageId) {
      mailOptions.inReplyTo = options.replyToMessageId;
      mailOptions.references = [options.replyToMessageId];
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);
    const messageId = info.messageId;

    // Find or get thread
    let thread = options.threadId
      ? await prisma.emailThread.findUnique({
          where: { id: options.threadId },
        })
      : null;

    // If no thread but replying, find thread from parent email
    if (!thread && options.replyToMessageId) {
      const parentEmail = await prisma.email.findUnique({
        where: { messageId: options.replyToMessageId },
        include: { thread: true },
      });

      if (parentEmail?.thread) {
        thread = parentEmail.thread;
      }
    }

    // Create thread if needed
    if (!thread) {
      const firstTo = toAddresses[0];
      const booking = await prisma.booking.findFirst({
        where: { email: firstTo },
        orderBy: { createdAt: "desc" },
      });

      const user = await prisma.user.findUnique({
        where: { email: firstTo },
      });

      // Validate inboxId is not undefined
      if (!inbox.id) {
        throw new Error("Invalid inbox: inboxId is missing");
      }

      thread = await prisma.emailThread.create({
        data: {
          id: randomUUID(), // Generate UUID for EmailThread id
          subject: options.subject,
          fromEmail: inbox.email.toLowerCase(),
          fromName: inbox.name || null,
          toEmail: firstTo,
          inboxId: inbox.id,
          bookingId: booking?.id || null,
          userId: user?.id || null,
          lastMessageAt: new Date(),
        },
      });
    } else {
      // Update thread
      await prisma.emailThread.update({
        where: { id: thread.id },
        data: { lastMessageAt: new Date() },
      });
    }

    // Store email in database
    await prisma.email.create({
      data: {
        id: randomUUID(), // Generate UUID for Email id
        messageId: messageId,
        inReplyTo: options.replyToMessageId || null,
        threadId: thread.id,
        inboxId: inbox.id,
        subject: options.subject,
        fromEmail: inbox.email.toLowerCase(),
        fromName: inbox.name || null,
        toEmail: toAddresses[0],
        toName: null,
        cc: [],
        bcc: [],
        textContent: options.text || null,
        htmlContent: options.html || null,
        attachments: [],
        direction: "outbound",
        isRead: true,
        isStarred: false,
        sentByUserId: options.sentByUserId,
        receivedAt: new Date(),
      },
    });

    // If this is a reply to a portal message, also send email to client as backup
    if (thread.source === "portal" && thread.user) {
      try {
        const { sendEmail } = await import("@/lib/email");
        await sendEmail({
          to: thread.user.email,
          subject: options.subject,
          html: options.html || options.text?.replace(/\n/g, "<br>"),
          text: options.text || options.html?.replace(/<[^>]*>/g, ""),
        });
      } catch (emailError) {
        console.error("Error sending backup email to client:", emailError);
        // Don't fail the request if backup email fails
      }
    }

    return { success: true, messageId, threadId: thread.id };
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw error;
  }
}
