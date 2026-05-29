/**
 * Pushover Notification System for STYLISH ENTERTAINMENT
 * Sends mobile push notifications via Pushover API
 */

import { prisma } from "@/lib/prisma";

interface PushoverNotification {
  title: string;
  message: string;
  userKey: string;
  priority?: number; // 0 = normal, 1 = high, 2 = emergency
  url?: string; // Optional URL to open when notification is clicked
  urlTitle?: string; // Optional title for the URL
}

interface NotificationResult {
  success: boolean;
  error?: string;
  messageId?: string;
}

/**
 * Send a push notification via Pushover API
 */
export async function sendPushoverNotification(
  notification: PushoverNotification
): Promise<NotificationResult> {
  const pushoverApiKey = process.env.PUSHOVER_API_KEY;
  const pushoverApiUrl = "https://api.pushover.net/1/messages.json";

  if (!pushoverApiKey) {
    return {
      success: false,
      error: "PUSHOVER_API_KEY not configured",
    };
  }

  if (!notification.userKey) {
    return {
      success: false,
      error: "User key (push_user_key) not provided",
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("token", pushoverApiKey);
    formData.append("user", notification.userKey);
    formData.append("title", notification.title);
    formData.append("message", notification.message);
    formData.append("priority", String(notification.priority || 0));
    
    if (notification.url) {
      formData.append("url", notification.url);
      if (notification.urlTitle) {
        formData.append("url_title", notification.urlTitle);
      }
    }

    const response = await fetch(pushoverApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const result = await response.json();

    if (!response.ok || result.status !== 1) {
      return {
        success: false,
        error: result.errors?.[0] || `Pushover API error: ${response.status}`,
      };
    }

    return {
      success: true,
      messageId: result.request,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to send push notification",
    };
  }
}

/**
 * Get staff push user keys from Staff_Settings table
 */
export async function getStaffPushKeys(): Promise<{
  ali: string | null;
  nigel: string | null;
}> {
  try {
    const staff = await prisma.staff_Settings.findMany({
      where: {
        name: {
          in: ["Ali", "Nigel"],
        },
        notificationEnabled: true,
      },
      select: {
        name: true,
        pushUserKey: true,
      },
    });

    const ali = staff.find((s) => s.name === "Ali")?.pushUserKey || null;
    const nigel = staff.find((s) => s.name === "Nigel")?.pushUserKey || null;

    return { ali, nigel };
  } catch (error) {
    console.error("Error fetching staff push keys:", error);
    return { ali: null, nigel: null };
  }
}

/**
 * Send new enquiry notification (unified inbox) to both Ali and Nigel
 */
export async function sendNewEnquiryNotification(enquiry: {
  id: string;
  name: string;
  eventDate: Date;
  venueName: string;
  isConflict?: boolean;
}): Promise<void> {
  const { ali, nigel } = await getStaffPushKeys();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.stylishentertainment.co.uk";
  const enquiryUrl = `${siteUrl}/admin/new-enquiries/${enquiry.id}`;

  const eventDate = new Date(enquiry.eventDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const title = enquiry.isConflict
    ? `⚠️ Enquiry (conflict): ${enquiry.name}`
    : `🆕 New Enquiry: ${enquiry.name}`;
  const message = `${eventDate} at ${enquiry.venueName}. Tap to review.`;

  const notifications: Promise<NotificationResult>[] = [];

  if (ali) {
    notifications.push(
      sendPushoverNotification({
        title,
        message,
        userKey: ali,
        priority: enquiry.isConflict ? 1 : 0,
        url: enquiryUrl,
        urlTitle: "View Enquiry",
      })
    );
  }

  if (nigel) {
    notifications.push(
      sendPushoverNotification({
        title,
        message,
        userKey: nigel,
        priority: enquiry.isConflict ? 1 : 0,
        url: enquiryUrl,
        urlTitle: "View Enquiry",
      })
    );
  }

  await Promise.allSettled(notifications);
}

/**
 * @deprecated New public forms create NewEnquiry records — use sendNewEnquiryNotification.
 * Kept for legacy booking-creation paths.
 */
export async function sendNewLeadNotification(booking: {
  id: string;
  name: string;
  eventDate: Date;
  venueName: string;
}): Promise<void> {
  const { ali, nigel } = await getStaffPushKeys();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylishentertainment.co.uk";
  const bookingUrl = `${siteUrl}/admin/bookings/${booking.id}`;
  
  const eventDate = new Date(booking.eventDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const title = `🆕 New Lead: ${booking.name}`;
  const message = `${eventDate} at ${booking.venueName}. Click to view.`;

  const notifications: Promise<NotificationResult>[] = [];

  // Send to Ali if she has a push key
  if (ali) {
    notifications.push(
      sendPushoverNotification({
        title,
        message,
        userKey: ali,
        priority: 1, // High priority
        url: bookingUrl,
        urlTitle: "View Booking",
      })
    );
  }

  // Send to Nigel if he has a push key
  if (nigel) {
    notifications.push(
      sendPushoverNotification({
        title,
        message,
        userKey: nigel,
        priority: 1, // High priority
        url: bookingUrl,
        urlTitle: "View Booking",
      })
    );
  }

  // Send all notifications in parallel
  const results = await Promise.allSettled(notifications);

  // Log any failures to Audit Log
  for (const result of results) {
    if (result.status === "rejected" || (result.status === "fulfilled" && !result.value.success)) {
      const error = result.status === "rejected" 
        ? result.reason 
        : result.value.error;
      
      await logNotificationError(booking.id, "new_lead", error);
    }
  }
}

/**
 * Send hand-off notification to Ali when Nigel passes a booking
 */
export async function sendHandoffNotification(booking: {
  id: string;
  name: string;
  assignedBy: "Nigel";
}): Promise<void> {
  const { ali } = await getStaffPushKeys();
  
  if (!ali) {
    console.warn("Ali's push key not found, skipping hand-off notification");
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylishentertainment.co.uk";
  const bookingUrl = `${siteUrl}/admin/bookings/${booking.id}`;

  const title = "📋 Booking Hand-off";
  const message = `Nigel passed you a booking: ${booking.name}`;

  const result = await sendPushoverNotification({
    title,
    message,
    userKey: ali,
    priority: 1, // High priority
    url: bookingUrl,
    urlTitle: "View Booking",
  });

  if (!result.success) {
    await logNotificationError(booking.id, "handoff", result.error);
  }
}

/**
 * Send "client paid deposit invoice" notification to both Ali and Nigel.
 * Uses latest settings: getStaffPushKeys() (Staff_Settings) and env base URL.
 */
export async function sendDepositPaidNotification(booking: {
  id: string;
  name: string;
  bookingReference?: string | null;
}): Promise<void> {
  const { ali, nigel } = await getStaffPushKeys();
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://stylishentertainment.co.uk";
  const bookingUrl = `${siteUrl}/admin/bookings/${booking.id}`;
  const ref = (booking.bookingReference || "").trim() || `SE-${booking.id.slice(-8)}`;

  const title = "Client paid deposit invoice";
  const message = `${booking.name} (${ref}). Click to view booking.`;

  const notifications: Promise<NotificationResult>[] = [];
  if (ali) {
    notifications.push(
      sendPushoverNotification({
        title,
        message,
        userKey: ali,
        priority: 1,
        url: bookingUrl,
        urlTitle: "View booking",
      })
    );
  }
  if (nigel) {
    notifications.push(
      sendPushoverNotification({
        title,
        message,
        userKey: nigel,
        priority: 1,
        url: bookingUrl,
        urlTitle: "View booking",
      })
    );
  }

  const results = await Promise.allSettled(notifications);
  for (const result of results) {
    if (result.status === "rejected" || (result.status === "fulfilled" && !result.value.success)) {
      const err = result.status === "rejected" ? result.reason : result.value.error;
      await logNotificationError(booking.id, "deposit_paid", String(err));
    }
  }
}

/**
 * Log notification errors to Audit Log
 */
async function logNotificationError(
  bookingId: string,
  notificationType: "new_lead" | "handoff" | "deposit_paid",
  error: string
): Promise<void> {
  const { logActivity } = await import("@/lib/activity-log");
  await logActivity({
    bookingId,
    action: `notification_${notificationType}_failed`,
    description: `Failed to send ${notificationType} notification: ${error}`,
    actor: "system",
    performedBy: "system",
  });
}
