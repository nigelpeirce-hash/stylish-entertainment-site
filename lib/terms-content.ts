/**
 * Single source of truth for Terms & Conditions content.
 * Used by AcceptTermsModule, terms-and-conditions page, and any T&C dialogs.
 */

export const TERMS_LAST_UPDATED = new Date();

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
