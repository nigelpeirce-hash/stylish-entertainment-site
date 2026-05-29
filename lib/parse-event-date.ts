/**
 * Parse event dates from HTML date inputs (YYYY-MM-DD) into stable UTC-noon Date objects.
 * Avoids timezone/DST shifts and PrismaPg DateTime serialization issues (e.g. +020026…).
 */

export function parseEventDate(value: string | Date): Date {
  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      throw new Error("Invalid event date");
    }
    const parts = value.toISOString().slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (parts) {
      return utcNoon(Number(parts[1]), Number(parts[2]), Number(parts[3]));
    }
    return value;
  }

  const trimmed = String(value).trim();
  const dateOnly = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnly) {
    return utcNoon(Number(dateOnly[1]), Number(dateOnly[2]), Number(dateOnly[3]));
  }

  const parsed = new Date(trimmed);
  if (isNaN(parsed.getTime())) {
    throw new Error("Invalid event date");
  }
  return parsed;
}

function utcNoon(year: number, month: number, day: number): Date {
  if (year < 2000 || year > 2099 || month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error("Invalid event date");
  }
  const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
  if (isNaN(d.getTime()) || d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) {
    throw new Error("Invalid event date");
  }
  return d;
}

/** UTC start/end of the calendar day for a normalized event date. */
export function eventDateDayRange(eventDate: Date): { dayStart: Date; dayEnd: Date } {
  const y = eventDate.getUTCFullYear();
  const m = eventDate.getUTCMonth();
  const d = eventDate.getUTCDate();
  return {
    dayStart: new Date(Date.UTC(y, m, d, 0, 0, 0, 0)),
    dayEnd: new Date(Date.UTC(y, m, d, 23, 59, 59, 999)),
  };
}
