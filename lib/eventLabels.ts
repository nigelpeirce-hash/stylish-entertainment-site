/**
 * Event Label Helper
 * Provides dynamic terminology based on event type archetype
 * Supports: Wedding, Corporate, Party/Celebration
 */

export type EventType = "Wedding" | "Corporate Event" | "Private Party" | "Christmas Party" | "Other" | "Corporate" | "Party";

export type LabelKey = 
  | "admin"
  | "client"
  | "clientName"
  | "stakeholder"
  | "guide"
  | "brief"
  | "ceremonyTime"
  | "loadInSchedule"
  | "firstDance"
  | "eventDate"
  | "countdown";

/**
 * Normalizes event type to archetype for terminology mapping
 */
function getEventArchetype(eventType: EventType | string | null | undefined): "wedding" | "corporate" | "party" {
  if (!eventType) return "party"; // Default fallback
  
  const normalized = eventType.toLowerCase().trim();
  
  if (normalized.includes("wedding")) {
    return "wedding";
  }
  
  if (normalized.includes("corporate") || normalized.includes("business")) {
    return "corporate";
  }
  
  // Default to party for Private Party, Christmas Party, Other, etc.
  return "party";
}

/**
 * Get dynamic label based on event type archetype
 * Uses British English throughout
 */
export function getLabel(key: LabelKey, eventType: EventType | string | null | undefined): string {
  const archetype = getEventArchetype(eventType);

  const labels: Record<LabelKey, Record<"wedding" | "corporate" | "party", string>> = {
    admin: {
      wedding: "Wedding Admin",
      corporate: "Event Admin",
      party: "Event Admin",
    },
    client: {
      wedding: "Bride & Groom",
      corporate: "Stakeholders",
      party: "Event Hosts",
    },
    clientName: {
      wedding: "Bride/Groom Names",
      corporate: "Contact Names",
      party: "Host Names",
    },
    stakeholder: {
      wedding: "Bride/Groom",
      corporate: "Stakeholders",
      party: "Hosts",
    },
    guide: {
      wedding: "Wedding Guide",
      corporate: "Event Brief",
      party: "Event Guide",
    },
    brief: {
      wedding: "Wedding Guide",
      corporate: "Event Brief",
      party: "Event Brief",
    },
    ceremonyTime: {
      wedding: "Ceremony Time",
      corporate: "Load-in Schedule",
      party: "Event Start Time",
    },
    loadInSchedule: {
      wedding: "Ceremony Time",
      corporate: "Load-in Schedule",
      party: "Event Schedule",
    },
    firstDance: {
      wedding: "First Dance",
      corporate: "Opening Performance",
      party: "Opening Song",
    },
    eventDate: {
      wedding: "Wedding Date",
      corporate: "Event Date",
      party: "Event Date",
    },
    countdown: {
      wedding: "Wedding",
      corporate: "Event",
      party: "Event",
    },
  };

  return labels[key]?.[archetype] || labels[key]?.party || key;
}

/**
 * Check if event type is wedding-specific
 */
export function isWeddingEvent(eventType: EventType | string | null | undefined): boolean {
  return getEventArchetype(eventType) === "wedding";
}

/**
 * Check if event type is corporate
 */
export function isCorporateEvent(eventType: EventType | string | null | undefined): boolean {
  return getEventArchetype(eventType) === "corporate";
}

/**
 * Check if event type is party/celebration
 */
export function isPartyEvent(eventType: EventType | string | null | undefined): boolean {
  return getEventArchetype(eventType) === "party";
}
