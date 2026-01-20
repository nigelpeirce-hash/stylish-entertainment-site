/**
 * Centralised Email Configuration
 * All outgoing emails use info@stylishentertainment.co.uk as the domain identity
 */

export const EMAIL_CONFIG = {
  // Primary domain email address
  OFFICE_EMAIL: "info@stylishentertainment.co.uk",
  
  // Dynamic sender names based on email type
  SENDER_NAMES: {
    booking: "Ali | STYLISH",
    dj_brief: "Nigel | STYLISH", // Legacy support
    dj_worksheet: "Nigel | STYLISH",
    general: "STYLISH Entertainment",
    default: "STYLISH Entertainment",
  },

  // Reply-To addresses (always info@stylishentertainment.co.uk)
  REPLY_TO: "info@stylishentertainment.co.uk",
} as const;

/**
 * Get the sender name for a specific email type
 */
export function getSenderName(emailType: "booking" | "dj_brief" | "dj_worksheet" | "general" | "default" = "default"): string {
  // Support both old and new naming for backward compatibility
  if (emailType === "dj_brief" || emailType === "dj_worksheet") {
    return EMAIL_CONFIG.SENDER_NAMES.dj_worksheet;
  }
  const nameKey = emailType as keyof typeof EMAIL_CONFIG.SENDER_NAMES;
  return EMAIL_CONFIG.SENDER_NAMES[nameKey] || EMAIL_CONFIG.SENDER_NAMES.default;
}

/**
 * Format the From address with dynamic sender name
 */
export function getFromAddress(emailType: "booking" | "dj_brief" | "dj_worksheet" | "general" | "default" = "default"): string {
  const senderName = getSenderName(emailType);
  return `${senderName} <${EMAIL_CONFIG.OFFICE_EMAIL}>`;
}

/**
 * Get email configuration for Resend
 */
export interface ResendEmailConfig {
  from: string;
  replyTo: string;
}

export function getResendConfig(emailType: "booking" | "dj_brief" | "dj_worksheet" | "general" | "default" = "default"): ResendEmailConfig {
  return {
    from: getFromAddress(emailType),
    replyTo: EMAIL_CONFIG.REPLY_TO,
  };
}
