import imap from "imap-simple";
import { simpleParser } from "mailparser";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

interface EmailMessage {
  messageId: string;
  inReplyTo?: string;
  references?: string[];
  subject: string;
  from: { name?: string; address: string };
  to: Array<{ name?: string; address: string }>;
  cc?: Array<{ name?: string; address: string }>;
  text?: string;
  html?: string;
  date: Date;
  attachments?: Array<{ filename: string; contentType: string; content: Buffer }>;
  direction: "inbound" | "outbound";
  folder?: string;
}

interface SyncOptions {
  deepSync?: boolean;
}

export async function syncEmailInbox(inboxId: string, options: SyncOptions = {}) {
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
    
    // Calculate date range based on sync type
    const lastSyncedDate = options.deepSync
      ? new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) // 6 months for deep sync
      : inbox.lastSyncedAt 
        ? new Date(inbox.lastSyncedAt.getTime() - 24 * 60 * 60 * 1000) // 24 hours before last sync
        : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // Default to last 90 days

    console.log(`Starting ${options.deepSync ? "DEEP" : "regular"} sync for ${inbox.email}`);
    console.log(`Searching for emails since: ${lastSyncedDate.toISOString()}`);

    // Get available mailboxes/folders
    const boxes = await connection.getBoxes();
    console.log(`[IMAP] Retrieved boxes structure for ${inbox.email}`);
    
    const folderNames = findFolders(boxes, ["INBOX", "Sent", "Sent Messages", "[Gmail]/Sent Mail", "[Gmail]/All Mail", "Archive"]);
    
    // Discover and store all folders in database
    await discoverAndStoreFolders(inbox, boxes, connection);

    const allMessages: EmailMessage[] = [];
    const fetchOptions = {
      bodies: "",
      struct: true,
    };

    // Process each folder
    for (const folderName of folderNames) {
      try {
        console.log(`Scanning folder: ${folderName}`);
        await connection.openBox(folderName);
        
        const isOutbound = folderName.toLowerCase().includes("sent") || folderName.toLowerCase().includes("outbox");
        const direction: "inbound" | "outbound" = isOutbound ? "outbound" : "inbound";

        // Use IMAP SEARCH for efficiency
        // Search criteria: emails since date
        const searchCriteria = [["SINCE", lastSyncedDate]];
        
        const results = await connection.search(searchCriteria, fetchOptions);
        console.log(`Found ${results.length} emails in ${folderName}`);

        // Parse emails from this folder
        for (const result of results) {
          try {
            const all = result.parts?.find((part: any) => part.which === "");

            // Extract IMAP flags (Flagged/Starred)
            const flags = result.attributes?.flags || [];
            const isFlagged = flags.some((flag: string) => 
              flag === '\\Flagged' || flag === '\\Starred' || flag === 'Flagged' || flag === 'Starred'
            );

            if (all && all.body) {
              const parsed = await simpleParser(all.body);
              const p: any = parsed;

              // Extract Message-ID, In-Reply-To, and References
              const messageId = parsed.messageId || `local-${Date.now()}-${Math.random()}`;
              const inReplyTo = parsed.inReplyTo || undefined;
              
              // Parse References header (space-separated message IDs)
              let references: string[] = [];
              if (parsed.references) {
                if (Array.isArray(parsed.references)) {
                  references = parsed.references;
                } else if (typeof parsed.references === "string") {
                  references = parsed.references.trim().split(/\s+/).filter(Boolean);
                }
              }

              // Parse from/to addresses
              const fromAddress =
                p.from && Array.isArray(p.from.value) && p.from.value.length > 0
                  ? p.from.value[0]
                  : null;

              // Helper to extract name from email if no display name provided
              const extractNameFromEmail = (email: string): string | undefined => {
                if (!email) return undefined;
                // Extract the part before @
                const localPart = email.split('@')[0];
                // Remove common prefixes/suffixes and format
                let name = localPart
                  .replace(/[._-]/g, ' ') // Replace dots, underscores, hyphens with spaces
                  .replace(/\d+/g, '') // Remove numbers
                  .trim();
                // Capitalize first letter of each word
                name = name.split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ')
                  .trim();
                // Only return if it looks like a name (has letters and is reasonable length)
                return name.length > 1 && name.length < 50 ? name : undefined;
              };

              const from = fromAddress
                ? {
                    name: (fromAddress as any).name || extractNameFromEmail((fromAddress as any).address),
                    address: (fromAddress as any).address,
                  }
                : { address: inbox.email }; // Use inbox email as fallback for sent messages

              const to =
                p.to && Array.isArray(p.to.value)
                  ? p.to.value.map((addr: any) => ({
                      name: addr.name || undefined,
                      address: addr.address,
                    }))
                  : [];

              const cc =
                p.cc && Array.isArray(p.cc.value)
                  ? p.cc.value.map((addr: any) => ({
                      name: addr.name || undefined,
                      address: addr.address,
                    }))
                  : undefined;

              allMessages.push({
                messageId,
                inReplyTo,
                references,
                subject: p.subject || "(No Subject)",
                from,
                to,
                cc,
                text: p.text || undefined,
                html: p.html || undefined,
                date: p.date || new Date(),
                attachments: p.attachments?.map((att: any) => ({
                  filename: att.filename || "attachment",
                  contentType: att.contentType,
                  content: att.content as Buffer,
                })),
                direction,
                folder: folderName,
                isFlagged: isFlagged, // Add IMAP flag status
              });
            }
          } catch (error) {
            console.error(`Error parsing email in ${folderName}:`, error);
            continue;
          }
        }
      } catch (error) {
        console.error(`Error processing folder ${folderName}:`, error);
        // Continue with other folders even if one fails
        continue;
      }
    }

    connection.end();

    console.log(`Total emails found across all folders: ${allMessages.length}`);

    // Process and store emails with proper threading
    for (const message of allMessages) {
      await processEmailMessage(inbox, message);
    }

    // Update last synced time
    await prisma.emailInbox.update({
      where: { id: inboxId },
      data: { lastSyncedAt: new Date() },
    });

    console.log(`Synced ${allMessages.length} emails from ${inbox.email}`);
    return allMessages.length;
  } catch (error) {
    console.error(`Error syncing inbox ${inboxId}:`, error);
    throw error;
  }
}

/**
 * Discover and store all IMAP folders in the database
 */
async function discoverAndStoreFolders(inbox: any, boxes: any, connection: any) {
  try {
    const delimiter = connection.delimiter || "/";
    const allFolders: Array<{ name: string; fullPath: string; parentPath: string | null; attributes: any }> = [];

    // Recursively collect all folders with their paths
    // getBoxes() returns an object where each key is a folder name and value is a box object
    function collectFolders(box: any, prefix = "", parentPath: string | null = null) {
      if (!box || typeof box !== 'object') return;
      
      // getBoxes() returns an object where keys are folder names
      // Each value is a box object with: { attributes, children, delimiter }
      for (const [name, childBox] of Object.entries(box)) {
        // Skip special properties that might exist on the root object
        if (name === 'delimiter' || name === 'attributes') continue;
        
        const boxData = childBox as any;
        const fullPath = prefix ? `${prefix}${delimiter}${name}` : name;
        
        // Add this folder to the list
        allFolders.push({
          name,
          fullPath,
          parentPath,
          attributes: boxData.attributes || {},
        });
        
        // Recursively process children if they exist
        if (boxData.children && typeof boxData.children === 'object') {
          collectFolders(boxData.children, fullPath, fullPath);
        }
      }
    }

    // Start collection from root boxes
    collectFolders(boxes);

    console.log(`[Folder Discovery] Found ${allFolders.length} folders for ${inbox.email}`);

    // Store folders in database (process in order to handle parent-child relationships)
    // First, sort to ensure parents are processed before children
    const sortedFolders = allFolders.sort((a, b) => {
      // Sort by path depth (shorter paths first)
      const depthA = a.fullPath.split(delimiter).length;
      const depthB = b.fullPath.split(delimiter).length;
      return depthA - depthB;
    });

    for (const folder of sortedFolders) {
      try {
        // Find parent folder ID if parentPath exists
        let parentId: string | null = null;
        if (folder.parentPath) {
          const parentFolder = await prisma.emailFolder.findUnique({
            where: {
              inboxId_fullPath: {
                inboxId: inbox.id,
                fullPath: folder.parentPath,
              },
            },
          });
          parentId = parentFolder?.id || null;
        }

        // Upsert folder with debug logging
        console.log(`[Folder Sync] Syncing folder: ${folder.fullPath} (parent: ${parentId || 'none'})`);
        
        await prisma.emailFolder.upsert({
          where: {
            inboxId_fullPath: {
              inboxId: inbox.id,
              fullPath: folder.fullPath,
            },
          },
          create: {
            id: randomUUID(),
            inboxId: inbox.id,
            name: folder.name,
            fullPath: folder.fullPath,
            parentId: parentId,
            delimiter: delimiter,
            attributes: folder.attributes,
          },
          update: {
            attributes: folder.attributes,
            updatedAt: new Date(),
          },
        });
      } catch (folderError) {
        console.error(`[Folder Sync] Error syncing folder ${folder.fullPath}:`, folderError);
        // Continue with other folders even if one fails
      }
    }

    console.log(`[Folder Discovery] Successfully stored ${allFolders.length} folders for ${inbox.email}`);
  } catch (error) {
    console.error("[Folder Discovery] Error discovering folders:", error);
    // Don't throw - folder discovery failure shouldn't break email sync
  }
}

/**
 * Find available folders from IMAP mailbox structure
 */
function findFolders(boxes: any, preferredNames: string[]): string[] {
  const found: string[] = [];
  const allFolders: string[] = [];

  // Recursively collect all folder names
  function collectFolders(box: any, prefix = "") {
    if (box.children) {
      for (const [name, child] of Object.entries(box.children)) {
        const fullName = prefix ? `${prefix}/${name}` : name;
        allFolders.push(fullName);
        collectFolders(child as any, fullName);
      }
    }
  }

  collectFolders(boxes);

  // Find preferred folders first
  for (const preferred of preferredNames) {
    const foundFolder = allFolders.find((f) => 
      f.toLowerCase() === preferred.toLowerCase() ||
      f.toLowerCase().includes(preferred.toLowerCase())
    );
    if (foundFolder && !found.includes(foundFolder)) {
      found.push(foundFolder);
    }
  }

  // Always include INBOX if not already found
  const inbox = allFolders.find((f) => f.toLowerCase() === "inbox");
  if (inbox && !found.includes(inbox)) {
    found.unshift(inbox);
  }

  return found.length > 0 ? found : ["INBOX"]; // Fallback to INBOX only
}

/**
 * Process email message with advanced threading logic
 */
async function processEmailMessage(
  inbox: any,
  message: EmailMessage
) {
  try {
    // Normalize email addresses
    const fromEmail = message.from.address.toLowerCase();
    const inboxEmail = inbox.email.toLowerCase();
    
    // Determine primary email addresses involved (for client association)
    const allParticipantEmails = new Set<string>([fromEmail]);
    message.to.forEach((t) => allParticipantEmails.add(t.address.toLowerCase()));
    message.cc?.forEach((c) => allParticipantEmails.add(c.address.toLowerCase()));

    // Check if email already exists (for logging purposes)
    const existingEmail = await prisma.email.findUnique({
      where: { messageId: message.messageId },
    });

    if (existingEmail) {
      console.log(`Email ${message.messageId} already exists, skipping`);
      return;
    }

    // THREAD RECONSTRUCTION: Use Message-ID, In-Reply-To, and References
    let thread = null;

    // Strategy 1: Find thread via In-Reply-To (direct parent)
    if (message.inReplyTo) {
      const parentEmail = await prisma.email.findUnique({
        where: { messageId: message.inReplyTo },
        include: { EmailThread: true },
      });

      if (parentEmail?.EmailThread) {
        thread = parentEmail.EmailThread;
        console.log(`Thread found via In-Reply-To: ${thread.id}`);
      }
    }

    // Strategy 2: Find thread via References header (entire conversation chain)
    if (!thread && message.references && message.references.length > 0) {
      // Search for any email in the References chain
      for (const refId of message.references) {
        const refEmail = await prisma.email.findUnique({
          where: { messageId: refId },
          include: { EmailThread: true },
        });

        if (refEmail?.EmailThread) {
          thread = refEmail.EmailThread;
          console.log(`Thread found via References: ${thread.id}`);
          break;
        }
      }
    }

    // Strategy 3: Find existing thread by subject and participants (fallback)
    if (!thread) {
      const cleanSubject = message.subject.replace(/^(Re:|Fwd?:|Fwd:)\s*/i, "").trim();
      
      // Search for threads involving any participant email
      const participantEmailsArray = Array.from(allParticipantEmails);
      
      thread = await prisma.emailThread.findFirst({
        where: {
          inboxId: inbox.id,
          OR: [
            { fromEmail: { in: participantEmailsArray } },
            { toEmail: { in: participantEmailsArray } },
          ],
          subject: {
            startsWith: cleanSubject.substring(0, 50), // First 50 chars to avoid truncation issues
          },
        },
        orderBy: { lastMessageAt: "desc" },
      });

      if (thread) {
        console.log(`Thread found via subject matching: ${thread.id}`);
      }
    }

    // CLIENT ASSOCIATION: Find booking or user by any participant email
    let bookingId: string | null = null;
    let userId: string | null = null;
    let clientEmail: string = fromEmail; // Default to from email

    // Search for booking by any participant email
    for (const email of allParticipantEmails) {
      if (email === inboxEmail) continue; // Skip inbox email itself

      const booking = await prisma.booking.findFirst({
        where: { email: email },
        orderBy: { createdAt: "desc" },
      });

      if (booking) {
        bookingId = booking.id;
        clientEmail = email;
        break;
      }
    }

    // Search for user by any participant email
    if (!userId) {
      for (const email of allParticipantEmails) {
        if (email === inboxEmail) continue;

        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (user) {
          userId = user.id;
          break;
        }
      }
    }

    // Create new thread if needed
    if (!thread) {
      // Determine thread participants
      // For inbound: fromEmail is client, toEmail is inbox
      // For outbound: fromEmail is inbox, toEmail is client
      const threadFromEmail = message.direction === "inbound" ? clientEmail : inboxEmail;
      const threadToEmail = message.direction === "inbound" ? inboxEmail : clientEmail;

      thread = await prisma.emailThread.create({
        data: {
          id: randomUUID(),
          subject: message.subject,
          fromEmail: threadFromEmail,
          fromName: message.from.name || null,
          toEmail: threadToEmail,
          inboxId: inbox.id,
          bookingId: bookingId,
          userId: userId,
          lastMessageAt: message.date,
          isStarred: message.isFlagged || false, // Set thread starred if email is flagged
          updatedAt: new Date(),
        },
      });

      console.log(`Created new thread: ${thread.id} for ${clientEmail}`);
    } else {
      // Update thread last message time and potentially booking/user association
      const updateData: any = {
        lastMessageAt: message.date,
        isRead: false,
        updatedAt: new Date(),
      };

      // Update thread starred status if any email in thread is flagged
      if (message.isFlagged) {
        updateData.isStarred = true;
      }

      // If thread doesn't have booking/user but we found one, update it
      if (!thread.bookingId && bookingId) {
        updateData.bookingId = bookingId;
      }
      if (!thread.userId && userId) {
        updateData.userId = userId;
      }

      await prisma.emailThread.update({
        where: { id: thread.id },
        data: updateData,
      });
    }

    // Store attachments metadata
    const attachmentsMetadata = message.attachments
      ? message.attachments.map((att) => ({
          filename: att.filename,
          contentType: att.contentType,
          size: att.content.length,
        }))
      : null;

    // Determine toEmail for database (for outbound, use first recipient)
    const dbToEmail = message.direction === "outbound" && message.to.length > 0
      ? message.to[0].address.toLowerCase()
      : inboxEmail;

    // Create or update email record using upsert to prevent unique constraint errors
    // Ensure messageId is not null/undefined before upserting
    if (!message.messageId) {
      console.warn(`Skipping email with missing messageId: ${message.subject}`);
      return;
    }
    
    await prisma.email.upsert({
      where: { messageId: message.messageId },
      create: {
        id: randomUUID(),
        messageId: message.messageId,
        inReplyTo: message.inReplyTo || null,
        threadId: thread.id,
        inboxId: inbox.id,
        subject: message.subject,
        fromEmail: fromEmail,
        fromName: message.from.name || null,
        toEmail: dbToEmail,
        toName: message.to[0]?.name || null,
        cc: message.cc?.map((c) => c.address.toLowerCase()) || [],
        bcc: [],
        textContent: message.text || null,
        htmlContent: message.html || null,
        attachments: attachmentsMetadata as any,
        direction: message.direction,
        isRead: false,
        isStarred: message.isFlagged || false, // Map IMAP \Flagged/\Starred to isStarred
        receivedAt: message.date,
      },
      update: {
        // Update thread association in case it changed
        threadId: thread.id,
        // Update starred status from IMAP flags if provided
        ...(message.isFlagged !== undefined && { isStarred: message.isFlagged }),
        // Update read status if needed (keep existing if already read)
        // Don't update other fields to preserve original data
      },
    });

    console.log(`Processed ${message.direction} email: ${message.subject} (${message.from.address})`);
  } catch (error) {
    console.error(`Error processing email message:`, error);
    throw error;
  }
}

// Sync all active inboxes
export async function syncAllInboxes(options: SyncOptions = {}) {
  const inboxes = await prisma.emailInbox.findMany({
    where: { isActive: true, syncEnabled: true },
  });

  const results = await Promise.allSettled(
    inboxes.map((inbox) => syncEmailInbox(inbox.id, options))
  );

  const successful = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  console.log(`Email sync completed: ${successful} successful, ${failed} failed`);
  return { successful, failed };
}
