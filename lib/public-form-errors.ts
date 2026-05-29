/**
 * Customer-facing copy for public enquiry forms (quote request, contact, etc.).
 * Never expose Prisma, stack traces, or other technical errors to visitors.
 */

export const PUBLIC_FORM_MESSAGES = {
  eventDateRequired: "Please choose your event date.",
  eventDateInvalid:
    "That date doesn't look right. Please pick a valid date between 2000 and 2099.",
  eventDatePast: "Please choose a date in the future.",
  emailRequired: "Please enter your email address.",
  emailInvalid: "Please enter a valid email address (e.g. name@example.com).",
  phoneRequired: "Please enter a phone number so we can call you back.",
  phoneInvalid: "Please enter a valid UK phone number.",
  nameRequired: "Please enter your full name.",
  servicesRequired: "Please tick at least one service you're interested in.",
  networkError:
    "We couldn't connect just now. Please check your internet connection and try again.",
  serverError:
    "Something went wrong on our side. Please try again in a moment, or email info@stylishentertainment.co.uk if it keeps happening.",
  checkForm: "Please check the highlighted details and try again.",
} as const;

export type PublicFormField =
  | "eventDate"
  | "email"
  | "phone"
  | "name"
  | "services"
  | "general";

/** Client- and server-safe event date check (HTML date input YYYY-MM-DD). */
export function getEventDateValidationError(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return PUBLIC_FORM_MESSAGES.eventDateRequired;

  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return PUBLIC_FORM_MESSAGES.eventDateInvalid;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (year < 2000 || year > 2099) return PUBLIC_FORM_MESSAGES.eventDateInvalid;

  const parsed = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
  if (
    isNaN(parsed.getTime()) ||
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return PUBLIC_FORM_MESSAGES.eventDateInvalid;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventLocal = new Date(year, month - 1, day);
  eventLocal.setHours(0, 0, 0, 0);
  if (eventLocal < today) return PUBLIC_FORM_MESSAGES.eventDatePast;

  return null;
}

export function getEmailValidationError(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return PUBLIC_FORM_MESSAGES.emailRequired;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return PUBLIC_FORM_MESSAGES.emailInvalid;
  }
  return null;
}

export function getPhoneValidationError(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return PUBLIC_FORM_MESSAGES.phoneRequired;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    return PUBLIC_FORM_MESSAGES.phoneInvalid;
  }
  return null;
}

const TECHNICAL_PATTERNS =
  /prisma|invocation|ArgumentValue|ECONNREFUSED|ETIMEDOUT|\$type|stack trace|could not convert|internal server error/i;

const KNOWN_API_ERRORS: Record<string, string> = {
  "Full name is required": PUBLIC_FORM_MESSAGES.nameRequired,
  "Email is required": PUBLIC_FORM_MESSAGES.emailRequired,
  "Phone number is required": PUBLIC_FORM_MESSAGES.phoneRequired,
  "Event date is required": PUBLIC_FORM_MESSAGES.eventDateRequired,
  "Invalid event date": PUBLIC_FORM_MESSAGES.eventDateInvalid,
  "Select at least one service": PUBLIC_FORM_MESSAGES.servicesRequired,
};

/** Map API / thrown errors to safe customer copy. */
export function toPublicFormError(
  error: unknown,
  fallback: string = PUBLIC_FORM_MESSAGES.serverError
): string {
  if (typeof error === "string") {
    if (KNOWN_API_ERRORS[error]) return KNOWN_API_ERRORS[error];
    if (TECHNICAL_PATTERNS.test(error)) return mapTechnicalMessage(error);
    return error;
  }

  if (error instanceof Error) {
    const msg = error.message.trim();
    if (KNOWN_API_ERRORS[msg]) return KNOWN_API_ERRORS[msg];
    if (TECHNICAL_PATTERNS.test(msg)) return mapTechnicalMessage(msg);
    if (msg.length > 0 && msg.length < 200) return msg;
  }

  return fallback;
}

function mapTechnicalMessage(msg: string): string {
  if (/date|DateTime|event date/i.test(msg)) {
    return PUBLIC_FORM_MESSAGES.eventDateInvalid;
  }
  return PUBLIC_FORM_MESSAGES.serverError;
}

/** Min value for HTML date inputs (today, local). */
export function minEventDateInputValue(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
