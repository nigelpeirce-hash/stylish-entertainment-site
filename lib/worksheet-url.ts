/**
 * Public worksheet URLs sent to clients in journey emails.
 * Weddings use the full DJ worksheet; every other event type uses the shorter party worksheet.
 */
export function worksheetUrlFor(baseUrl: string, eventType?: string | null): string {
  const isWedding = (eventType || "").toLowerCase().trim() === "wedding";
  const path = isWedding ? "/dj-worksheet/" : "/party-dj-worksheet/";
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}
