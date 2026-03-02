/**
 * Single source of truth for Terms & Conditions content.
 * Used by: terms-and-conditions page (footer link), AcceptTermsModule, portal personalised T&C document.
 */

export const TERMS_LAST_UPDATED = new Date("2026-03-02");

/** Stable version string for storage at acceptance (YYYY-MM-DD). Used for legal traceability. */
export const TERMS_VERSION = TERMS_LAST_UPDATED.toISOString().slice(0, 10);

/** Company details – used in personalised booking agreements */
export const COMPANY_NAME = "Stylish Entertainment Ltd";
export const COMPANY_ADDRESS = "88 Weymouth Road, Frome, Somerset BA11 1HJ";
export const COMPANY_SIGNATORIES = "Alison Peirce & Nigel Peirce";

/** Intro paragraph – legally binding agreement (Artist = DJs, musicians, live performers, production). */
export const TERMS_INTRO =
  'These Terms & Conditions form a legally binding agreement between Stylish Entertainment Ltd ("we", "us", "our") and the client ("you", "your") in relation to the provision of entertainment services, including but not limited to DJs, musicians, live performers, and event production services (together referred to as the "Artist" or "Services").';

/** Abridged summary – key points for quick reading before the full terms */
export const TERMS_ABRIDGED = `• Deposit is required on confirmation; balance due before or on the night.
• All deposits are non-refundable once paid.
• Cancellations must be in writing; charges apply by notice period (see full terms).
• We confirm Artist availability; if unavailable, replacement or refund offered.
• Venue permission required; equipment PAT tested and insured.
• Full terms at stylishentertainment.co.uk/terms-and-conditions`;

/** Deposit & cancellation clause – added to personalised portal T&C document */
export const DEPOSIT_CLAUSE = {
  heading: "Deposit and Cancellation",
  body:
    "By paying your deposit, you confirm that you have read and accept these terms. All deposits are non-refundable once paid. " +
    "In the event of cancellation by you, the deposit will not be returned. If you need to cancel after paying your deposit, " +
    "please notify us in writing as soon as possible. Any balance paid may be refundable subject to our cancellation policy " +
    "and the notice period given. We recommend securing cancellation insurance for your event.",
};

export interface TermsSection {
  id: string;
  heading: string;
  body: string;
}

/** Placeholder replaced with <a href="/privacy-policy">Privacy Policy</a> when rendering. */
export const PRIVACY_LINK_PLACEHOLDER = "{{PRIVACY_LINK}}";

export const TERMS_SECTIONS: TermsSection[] = [
  {
    id: "booking",
    heading: "1. Booking Confirmation",
    body:
      "This booking form serves as an invitation only. Submission of this form does not constitute a confirmation of Artist performance. " +
      "Once we have final confirmation from your chosen Artist, we will email a booking invoice with full terms and conditions.",
  },
  {
    id: "payment",
    heading: "2. Payment Terms",
    body:
      "A deposit is required upon booking confirmation. The final balance is due in the weeks before your event, or on the night in cash " +
      "once the Artist has set up. If the Artist is not paid in full at the start of the evening, they may refuse to perform.",
  },
  {
    id: "cancellation",
    heading: "3. Cancellation Policy",
    body:
      "Cancellations must be made in writing. The deposit is always non-refundable. Where you cancel, the following charges apply to any balance paid: " +
      "more than 90 days before the event: deposit retained; 90–60 days: 50% of total fee; 60–30 days: 75% of total fee; less than 30 days: 100% of total fee.",
  },
  {
    id: "availability",
    heading: "4. Artist Availability and Substitution",
    body:
      "We will confirm Artist availability before finalising your booking. In the unlikely event that your chosen Artist becomes unavailable, " +
      "we will offer a replacement Artist of comparable standard and experience or provide a full refund of your deposit.",
  },
  {
    id: "coolingoff",
    heading: "5. Cooling-Off Period (Consumer Contracts Regulations 2013)",
    body:
      "5.1 Where you are a consumer and the contract is formed at a distance, you would normally have a statutory 14-day cancellation right. " +
      "5.2 However, this booking relates to leisure services to be provided on a specific event date. " +
      "5.3 Under Regulation 28(1)(h) of the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, the 14-day cancellation right does not apply to contracts for leisure services where the contract provides for a specific date or period of performance. " +
      "5.4 By confirming this booking, you acknowledge and agree that the statutory cooling-off period does not apply.",
  },
  {
    id: "setup",
    heading: "6. Setup and Access",
    body:
      "Our Artists require adequate setup time and access to the venue. Early setup may be available for an additional fee. " +
      "Please ensure the venue provides suitable access and parking arrangements.",
  },
  {
    id: "venue",
    heading: "7. Venue Requirements",
    body:
      "You must seek permission from your venue before booking our services. Some venues have specific requirements or restrictions. " +
      "We are always respectful of venue policies and will work within their guidelines.",
  },
  {
    id: "equipment",
    heading: "8. Equipment and Safety",
    body:
      "All equipment is PAT tested and we have public liability insurance. Certificates can be provided to your venue upon request.",
  },
  {
    id: "music",
    heading: "9. Music and Requests",
    body:
      "We actively encourage music requests and will create a bespoke set for your event. The Artist will use their professional discretion " +
      "to ensure the dance floor stays full. Please provide any must-play or do-not-play lists in advance.",
  },
  {
    id: "liability",
    heading: "10. Liability",
    body:
      "While we take every care to provide an excellent service, Stylish Entertainment Ltd accepts no liability for delays or cancellations " +
      "due to circumstances beyond our control, including but not limited to severe weather, venue closure, or government restrictions.",
  },
  {
    id: "data",
    heading: "11. Data Protection",
    body:
      "Your personal information will be stored securely and used only for the purposes of managing your booking. " +
      `Please see our ${PRIVACY_LINK_PLACEHOLDER} for more details.`,
  },
];

/**
 * Production, Lighting and Styling – only included when booking includes such services.
 * Rendered as clause 12 when included.
 */
export const PRODUCTION_CLAUSE: TermsSection = {
  id: "production",
  heading: "12. Production, Lighting and Styling Services",
  body:
    "12.1 Where your booking includes lighting, staging, sound reinforcement, décor, styling or other production services, the following additional terms apply. " +
    "12.2 Venue Permissions and Power: You are responsible for ensuring that the venue permits all agreed services, including (where applicable) rigging, fixing, haze/smoke effects and required power loads. Adequate and safe power supply must be available. " +
    "12.3 Access and Timings: Agreed load-in and load-out times must be honoured. Delays caused by the venue, client or third parties may result in additional charges. Access restrictions must be disclosed in advance. " +
    "12.4 Equipment Safety and Damage: You are responsible for any loss or damage to our equipment caused by guests, venue staff or third parties (fair wear and tear excluded). We reserve the right to recover repair or replacement costs where damage is attributable to your event. " +
    "12.5 Outdoor Events: For outdoor events, suitable weather protection and stable ground conditions must be provided. We reserve the right to suspend or cease operation where weather conditions pose a risk to safety or equipment. " +
    "12.6 Health and Safety: We reserve the right to amend, relocate or remove equipment if necessary to comply with health and safety requirements or venue regulations. " +
    "12.7 Overtime: If we are required to provide services beyond the agreed performance or hire period, additional overtime charges may apply at the rate stated in your booking confirmation or invoice.",
};

/**
 * Whether a booking includes production/lighting/styling services (so Production clause 12 applies).
 */
export function includesProductionServices(booking: {
  services?: string[] | null;
  upsellItems?: string[] | null;
}): boolean {
  const services = Array.isArray(booking.services) ? booking.services : [];
  const upsell = Array.isArray(booking.upsellItems) ? booking.upsellItems : [];
  const productionServiceIds = ["Lighting Design", "Venue Styling"];
  const hasProductionService = services.some((s) =>
    productionServiceIds.some((id) => s === id || s?.toLowerCase().includes(id.toLowerCase()))
  );
  const hasRelevantUpsell = upsell.some(
    (u) =>
      /lighting|styling|production|décor|decor|staging|sound|rigging|haze|smoke/i.test(String(u))
  );
  return hasProductionService || hasRelevantUpsell;
}

/**
 * Terms sections to display: core (1–11) plus optional Production (12) when booking includes production/lighting/styling.
 */
export function getTermsSectionsForDisplay(includeProduction: boolean): TermsSection[] {
  return includeProduction ? [...TERMS_SECTIONS, PRODUCTION_CLAUSE] : TERMS_SECTIONS;
}

export const TERMS_QUESTIONS =
  "Questions? Please contact us at 07970793177 or use our contact form.";
