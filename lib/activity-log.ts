/**
 * Central activity logging for Admin Dashboard Recent Activity feed.
 * Use logActivity() from API routes, email sends, and portal mutations.
 */

import { prisma } from "@/lib/prisma";

export type ActivityActor = "client" | "guest" | "admin" | "system";

export interface ActivityMetadata {
  emailSubject?: string;
  amount?: string | number;
  songTitle?: string;
  songArtist?: string;
  templateName?: string;
  [key: string]: unknown;
}

export interface LogActivityOptions {
  bookingId?: string | null;
  enquiryId?: string | null;
  action: string;
  description: string;
  actor?: ActivityActor;
  performedBy?: string | null;
  metadata?: ActivityMetadata | null;
}

/**
 * Log an activity entry to the AuditLog. Non-throwing – errors are logged only.
 * Use from API routes after successful mutations.
 */
export async function logActivity(options: LogActivityOptions): Promise<void> {
  const { bookingId, enquiryId, action, description, actor, performedBy, metadata } = options;
  if (!bookingId && !enquiryId) {
    console.warn("[activity-log] logActivity called with neither bookingId nor enquiryId — skipping");
    return;
  }
  try {
    await prisma.auditLog.create({
      data: {
        bookingId: bookingId ?? undefined,
        enquiryId: enquiryId ?? undefined,
        action,
        description: description.slice(0, 1000),
        performedBy: performedBy ?? undefined,
        actor: actor ?? undefined,
        metadata: metadata ? (metadata as object) : undefined,
      },
    });
  } catch (err) {
    console.error("[activity-log] Failed to create audit entry:", err);
  }
}
