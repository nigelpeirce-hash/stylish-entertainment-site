/**
 * Messaging helper: event-type-specific copy for headers, countdowns, and CTAs.
 * Wedding → Wedding profile; Corporate → Corporate profile; else → Private profile.
 */

export interface EventTypeMessaging {
  header: string;
  countdown: string;
  cta: string;
}

/**
 * Email-specific: subject template ([Name] / [Company Name]), CTA, and branding accent.
 */
export interface EventTypeEmailProfile {
  subjectTemplate: string;
  cta: string;
  accent: string;
}

const WEDDING: EventTypeMessaging = {
  header: "Your Wedding Journey",
  countdown: "To the Ceremony",
  cta: "Plan Your Big Day",
};

const CORPORATE: EventTypeMessaging = {
  header: "Your Event Dashboard",
  countdown: "To the Main Stage",
  cta: "Review Schedule",
};

const PRIVATE: EventTypeMessaging = {
  header: "Your Celebration",
  countdown: "To the Party",
  cta: "Customize Your Vibe",
};

const EMAIL_WEDDING: EventTypeEmailProfile = {
  subjectTemplate: "Your Date is Secured: [Name] x Stylish",
  cta: "View Your Countdown",
  accent: "Champagne Gold",
};

const EMAIL_CORPORATE: EventTypeEmailProfile = {
  subjectTemplate: "Booking Confirmed: [Company Name]",
  cta: "Review Event Itinerary",
  accent: "Slate & Silver",
};

const EMAIL_PRIVATE: EventTypeEmailProfile = {
  subjectTemplate: "It's Official: Let's Celebrate!",
  cta: "Customize Your Vibe",
  accent: "Amber Glow",
};

/**
 * Returns messaging copy based on eventType.
 * - wedding → Wedding profile
 * - corporate → Corporate profile
 * - otherwise → Private profile (default)
 */
export function getEventTypeMessaging(eventType: string | null | undefined): EventTypeMessaging {
  if (!eventType) return PRIVATE;
  const normalized = eventType.toLowerCase().trim();
  if (normalized === "wedding") return WEDDING;
  if (normalized === "corporate") return CORPORATE;
  return PRIVATE;
}

/**
 * Returns email profile (subject template, CTA, accent) for eventType.
 * Use with getEmailSubject() to resolve [Name] / [Company Name].
 */
export function getEventTypeEmailProfile(
  eventType: string | null | undefined
): EventTypeEmailProfile {
  if (!eventType) return EMAIL_PRIVATE;
  const n = eventType.toLowerCase().trim();
  if (n === "wedding") return EMAIL_WEDDING;
  if (n === "corporate") return EMAIL_CORPORATE;
  return EMAIL_PRIVATE;
}

/**
 * Builds subject line from email profile. Replaces [Name] and [Company Name].
 */
export function getEmailSubject(
  eventType: string | null | undefined,
  opts: { name?: string | null; companyName?: string | null } = {}
): string {
  const profile = getEventTypeEmailProfile(eventType);
  let s = profile.subjectTemplate;
  s = s.replace(/\[Name\]/g, opts.name || "there");
  s = s.replace(/\[Company Name\]/g, opts.companyName || "Your Event");
  return s;
}
