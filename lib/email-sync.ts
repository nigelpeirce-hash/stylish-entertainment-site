import imap from "imap-simple";
import { simpleParser } from "mailparser";
import { prisma } from "@/lib/prisma";

interface EmailMessage {
  messageId: string;
  inReplyTo?: string;
  subject: string;
  from: { name?: string; address: string };
  to: Array<{ name?: string; address: string }>;
  cc?: Array<{ name?: string; address: string }>;
  text?: string;
  html?: string;
  date: Date;
  attachments?: Array<{ filename: string; contentType: string; content: Buffer }>;
}

export async function syncEmailInbox(inboxId: string) {
  try {
    const inbox = await prisma.emailInbox.findUnique({
      where: { id: inboxId },
    });

    if (!inbox || !inbox.syncEnabled) {
      console.log(`Inbox ${inboxId} not found or sync disabled`);
      return;
    }

    const config = {
      imap: {
        user: inbox.imapUsername,
        password: inbox.imapPassword,
        host: inbox.imapHost,
        port: inbox.imapPort,
        tls: inbox.imapSecure,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 3000,
      },
    };

    const connection = await imap.connect(config);
    await connection.openBox("INBOX");

    // Search criteria:
    // For now, always fetch ALL messages from the INBOX.
    // We rely on Message-ID + existing record checks to avoid duplicates.
    // This makes behaviour predictable while we confirm connectivity.
    const searchCriteria = ["ALL"] as any;

    const fetchOptions = {
      bodies: "",
      struct: true,
    };

    const results = await connection.search(searchCriteria, fetchOptions);

    const messages: EmailMessage[] = [];

    for (const result of results) {
      try {
        const id = result.attributes.uid;
        const all = result.parts?.find((part: any) => part.which === "");

        if (all && all.body) {
          const parsed = await simpleParser(all.body);

          // Extract Message-ID and In-Reply-To
          const messageId = parsed.messageId || `local-${Date.now()}-${Math.random()}`;
          const inReplyTo = parsed.inReplyTo || undefined;

          // Parse from/to addresses
          const from = parsed.from
            ? {
                name: parsed.from.name || undefined,
                address: parsed.from.value[0].address,
              }
            : { address: "unknown@unknown.com" };

          const to = parsed.to
            ? parsed.to.value.map((addr) => ({
                name: addr.name || undefined,
                address: addr.address,
              }))
            : [];

          const cc = parsed.cc
            ? parsed.cc.value.map((addr) => ({
                name: addr.name || undefined,
                address: addr.address,
              }))
            : undefined;

          messages.push({
            messageId,
            inReplyTo,
            subject: parsed.subject || "(No Subject)",
            from,
            to,
            cc,
            text: parsed.text || undefined,
            html: parsed.html || undefined,
            date: parsed.date || new Date(),
            attachments: parsed.attachments?.map((att) => ({
              filename: att.filename || "attachment",
              contentType: att.contentType,
              content: att.content,
            })),
          });
        }
      } catch (error) {
        console.error(`Error parsing email:`, error);
        continue;
      }
    }

    connection.end();

    // Process and store emails
    for (const message of messages) {
      await processInboundEmail(inbox, message);
    }

    // Update last synced time
    await prisma.emailInbox.update({
      where: { id: inboxId },
      data: { lastSyncedAt: new Date() },
    });

    console.log(`Synced ${messages.length} emails from ${inbox.email}`);
    return messages.length;
  } catch (error) {
    console.error(`Error syncing inbox ${inboxId}:`, error);
    throw error;
  }
}

async function processInboundEmail(
  inbox: any,
  message: EmailMessage
) {
  try {
    // Find or create email thread
    const fromEmail = message.from.address.toLowerCase();
    const toEmail = inbox.email.toLowerCase();

    // Try to find existing thread by subject and participants
    let thread = await prisma.emailThread.findFirst({
      where: {
        inboxId: inbox.id,
        fromEmail: fromEmail,
        toEmail: toEmail,
        subject: {
          startsWith: message.subject.replace(/^(Re:|Fwd?:|Fwd:)\s*/i, "").trim(),
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    // If no thread found, check if this is a reply (has In-Reply-To)
    if (!thread && message.inReplyTo) {
      const parentEmail = await prisma.email.findUnique({
        where: { messageId: message.inReplyTo },
        include: { thread: true },
      });

      if (parentEmail?.thread) {
        thread = parentEmail.thread;
      }
    }

    // Create new thread if needed
    if (!thread) {
      // Try to find linked booking by email
      const booking = await prisma.booking.findFirst({
        where: { email: fromEmail },
        orderBy: { createdAt: "desc" },
      });

      // Try to find linked user by email
      const user = await prisma.user.findUnique({
        where: { email: fromEmail },
      });

      thread = await prisma.emailThread.create({
        data: {
          subject: message.subject,
          fromEmail: fromEmail,
          fromName: message.from.name || null,
          toEmail: toEmail,
          inboxId: inbox.id,
          bookingId: booking?.id || null,
          userId: user?.id || null,
          lastMessageAt: message.date,
        },
      });
    } else {
      // Update thread last message time
      await prisma.emailThread.update({
        where: { id: thread.id },
        data: { lastMessageAt: message.date, isRead: false },
      });
    }

    // Check if email already exists
    const existingEmail = await prisma.email.findUnique({
      where: { messageId: message.messageId },
    });

    if (existingEmail) {
      console.log(`Email ${message.messageId} already exists, skipping`);
      return;
    }

    // Store attachments metadata
    const attachmentsMetadata = message.attachments
      ? message.attachments.map((att) => ({
          filename: att.filename,
          contentType: att.contentType,
          size: att.content.length,
        }))
      : null;

    // Create email record
    await prisma.email.create({
      data: {
        messageId: message.messageId,
        inReplyTo: message.inReplyTo || null,
        threadId: thread.id,
        inboxId: inbox.id,
        subject: message.subject,
        fromEmail: fromEmail,
        fromName: message.from.name || null,
        toEmail: toEmail,
        toName: null,
        cc: message.cc?.map((c) => c.address) || [],
        bcc: [],
        textContent: message.text || null,
        htmlContent: message.html || null,
        attachments: attachmentsMetadata as any,
        direction: "inbound",
        isRead: false,
        isStarred: false,
        receivedAt: message.date,
      },
    });

    console.log(`Processed email: ${message.subject} from ${fromEmail}`);
  } catch (error) {
    console.error(`Error processing inbound email:`, error);
    throw error;
  }
}

// Sync all active inboxes
export async function syncAllInboxes() {
  const inboxes = await prisma.emailInbox.findMany({
    where: { isActive: true, syncEnabled: true },
  });

  const results = await Promise.allSettled(
    inboxes.map((inbox) => syncEmailInbox(inbox.id))
  );

  const successful = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  console.log(`Email sync completed: ${successful} successful, ${failed} failed`);
  return { successful, failed };
}
