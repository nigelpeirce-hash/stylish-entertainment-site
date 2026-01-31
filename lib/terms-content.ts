/**
 * Single source of truth for Terms & Conditions content.
 * Used by: terms-and-conditions page (footer link), AcceptTermsModule, portal personalised T&C document.
 */

export const TERMS_LAST_UPDATED = new Date("2026-01-31");

/** Company details – used in personalised booking agreements */
export const COMPANY_NAME = "Stylish Entertainment Ltd";
export const COMPANY_ADDRESS = "88 Weymouth Road, Frome, Somerset BA11 1HJ";
export const COMPANY_SIGNATORIES = "Alison Peirce & Nigel Peirce";

/** Abridged summary – key points for quick reading before the full terms */
export const TERMS_ABRIDGED = `• Deposit is required on confirmation; balance due before or on the night.
• All deposits are non-refundable once paid.
• Cancellations must be in writing; may incur charges within 30 days of event.
• We confirm artist availability; if unavailable, replacement or refund offered.
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
      "This booking form serves as an invitation only. Submission of this form does not constitute a confirmation of artist performance. " +
      "Once we have final confirmation from your chosen DJ, we will email a booking invoice with full terms and conditions.",
  },
  {
    id: "payment",
    heading: "2. Payment Terms",
    body:
      "A deposit is required upon booking confirmation. The final balance is due in the weeks before your event, or on the night in cash " +
      "once the artist has set up. If the DJ is not paid in full at the start of the evening, they may refuse to play.",
  },
  {
    id: "cancellation",
    heading: "3. Cancellation Policy",
    body:
      "Cancellations must be made in writing. The deposit is non-refundable. Cancellations made within 30 days of the event date " +
      "may incur additional charges as outlined in your booking confirmation.",
  },
  {
    id: "availability",
    heading: "4. Artist Availability",
    body:
      "We will confirm artist availability before finalising your booking. In the unlikely event that your chosen artist becomes unavailable, " +
      "we will offer a suitable replacement or provide a full refund of your deposit.",
  },
  {
    id: "setup",
    heading: "5. Setup and Access",
    body:
      "Our artists require adequate setup time and access to the venue. Early setup may be available for an additional fee. " +
      "Please ensure the venue provides suitable access and parking arrangements.",
  },
  {
    id: "venue",
    heading: "6. Venue Requirements",
    body:
      "You must seek permission from your venue before booking our services. Some venues have specific requirements or restrictions. " +
      "We are always respectful of venue policies and will work within their guidelines.",
  },
  {
    id: "equipment",
    heading: "7. Equipment and Safety",
    body:
      "All equipment is PAT tested and we have public liability insurance. Certificates can be provided to your venue upon request.",
  },
  {
    id: "music",
    heading: "8. Music and Requests",
    body:
      "We actively encourage music requests and will create a bespoke set for your event. Our DJs use their professional judgement " +
      "to ensure the dance floor stays full. Please provide any must-play or do-not-play lists in advance.",
  },
  {
    id: "liability",
    heading: "9. Liability",
    body:
      "While we take every care to provide an excellent service, Stylish Entertainment Ltd accepts no liability for delays or cancellations " +
      "due to circumstances beyond our control, including but not limited to severe weather, venue closure, or government restrictions.",
  },
  {
    id: "data",
    heading: "10. Data Protection",
    body:
      "Your personal information will be stored securely and used only for the purposes of managing your booking. " +
      `Please see our ${PRIVACY_LINK_PLACEHOLDER} for more details.`,
  },
];

export const TERMS_QUESTIONS =
  "Questions? Please contact us at 07970793177 or use our contact form.";
