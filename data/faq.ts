export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSection {
  title: string;
  slug: string;
  items: FaqItem[];
}

export function faqQuestionSlug(question: string): string {
  return `faq-${question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}

/** Questions linked from the “Most Popular” block — must match FAQ_SECTIONS items exactly */
export const MOST_POPULAR_QUESTIONS = [
  "How much do your DJs charge?",
  "Can we choose music?",
  "Have you worked at our venue before?",
  "What happens if our DJ is ill?",
  "Can you provide DJs and lighting together?",
] as const;

/** Visible FAQ copy — keep in sync with FAQPage JSON-LD in app/about/faq/page.tsx */
export const FAQ_SECTIONS: FaqSection[] = [
  {
    title: "Planning & Booking",
    slug: "planning-booking",
    items: [
      {
        question: "How far in advance should we book?",
        answer:
          "Summer Saturdays and key venues fill early. Many clients book 12–18 months ahead; shorter notice can work. Enquire once your venue is confirmed.",
      },
      {
        question: "How do we book?",
        answer:
          "Send your date, venue and brief — DJ, lighting, sound, styling or a mix. We confirm availability, recommend the right team and send a clear fee. Deposit and signed terms secure the date.",
      },
      {
        question: "Have you worked at our venue before?",
        answer:
          "Chances are yes. Over the last 20 years we have worked at hundreds of venues including Babington House, Mells Barn, Kin House, North Cadbury Court and country estates across the UK. If your venue is new to us, we research access, power and layout with you before quoting.",
      },
      {
        question: "Do you visit the venue beforehand?",
        answer:
          "For larger lighting or styling briefs, a site visit is standard. For straightforward DJ or sound bookings, a detailed brief and venue liaison is usually enough — we will advise what your event needs.",
      },
      {
        question: "Can you work with our wedding planner?",
        answer:
          "Yes — we work with planners and venue teams regularly, with shared timelines and one technical contact on the day.",
      },
      {
        question: "What area do you cover?",
        answer:
          "Based in Somerset near Bath, working UK-wide — from Norfolk to Cornwall and London to the Midlands.",
      },
    ],
  },
  {
    title: "Pricing",
    slug: "pricing",
    items: [
      {
        question: "How much do you charge for lighting and styling?",
        answer:
          "Quotes depend on room size, ceiling height, access times and design scope. Canopies and full transformations need more detail than uplighting alone. We also confirm your venue allows external suppliers.",
      },
      {
        question: "How much do your DJs charge?",
        answer:
          "Fees depend on artist, location, hours and whether you need ceremony sound or a late finish. Every event is different — send your brief and we reply with availability and a clear fee.",
      },
      {
        question: "When do we pay?",
        answer:
          "Deposit on booking; balance due before the event or on the night once setup is complete — terms on your invoice.",
      },
    ],
  },
  {
    title: "DJs & Entertainment",
    slug: "djs-entertainment",
    items: [
      {
        question: "Can we choose music?",
        answer:
          "Yes. Every set is built around your taste — must-plays, mood and how you want the room to feel. Our DJs combine your input with years of reading dancefloors.",
      },
      {
        question: "Can we give you a do-not-play list?",
        answer:
          "Yes — tell us songs or genres to avoid. We treat do-not-play lists as seriously as requests.",
      },
      {
        question: "We have a mixed-age crowd — is that an issue?",
        answer:
          "The norm at weddings. We programme for all ages in one room — full dancefloor without cheesy routines.",
      },
      {
        question: "Can we have a DJ and band for the evening?",
        answer:
          "Yes, often. We advise on timing and handle changeovers — band, DJ, sax or acoustic sets in one brief.",
      },
      {
        question: "How late can you play?",
        answer:
          "Depends on your venue licence. Many run to midnight or later; some marquees allow 1–2am. Late finishes may mean artist accommodation — we flag that upfront.",
      },
      {
        question: "What happens if our DJ is ill?",
        answer:
          "Backup cover across our roster. If an artist cannot perform, we arrange a replacement at the same standard. We have never left a client without entertainment on the day.",
      },
    ],
  },
  {
    title: "Lighting & Styling",
    slug: "lighting-styling",
    items: [
      {
        question: "When will you set up and de-rig?",
        answer:
          "We prefer to install the day before the wedding. De-rig is planned with your venue — often Monday after a Saturday wedding.",
      },
      {
        question: "What types of lighting do you offer?",
        answer:
          "Uplighting, fairy-light canopies, festoon, dancefloor rigs, exterior lighting and bespoke installs for barns, marquees and estates.",
      },
      {
        question: "Can you work with our venue's existing lighting?",
        answer:
          "Yes — we integrate with house systems or work independently, depending on what the venue allows.",
      },
      {
        question: "Do you provide venue styling consultations?",
        answer:
          "Yes — drapery, backdrops, props, furniture and table styling, focused on transforming the room rather than filling it.",
      },
      {
        question: "Can you create custom lighting designs?",
        answer:
          "Core to our work — canopies, tunnels, colour schemes and one-off features. Share a reference and we will say honestly what is achievable.",
      },
      {
        question: "Do you handle outdoor lighting?",
        answer:
          "Yes — terraces, gardens, walkways and marquee exteriors, with weather-appropriate kit and power planning.",
      },
      {
        question: "Can you provide DJs and lighting together?",
        answer:
          "Yes — often the best approach. One team on music and atmosphere avoids clashing timings and duplicate kit.",
      },
    ],
  },
  {
    title: "Sound & Production",
    slug: "sound-production",
    items: [
      {
        question: "Can you provide ceremony sound?",
        answer:
          "Yes — discreet PA, playback and wireless mics for vows and readings, sized for the space.",
      },
      {
        question: "Can you provide microphones for speeches?",
        answer:
          "Yes — wireless handheld or lapel mics, with levels checked before speeches.",
      },
      {
        question: "Can you set up during the day?",
        answer:
          "Early rig-and-return is available for a fee when access allows — useful when the room is busy earlier in the day.",
      },
      {
        question: "Can you support marquee weddings and parties?",
        answer:
          "Regularly. Marquees need separate planning for acoustics, power, speeches and dancefloor audio — we work with marquee companies on timing and cables.",
      },
    ],
  },
  {
    title: "Practical Questions",
    slug: "practical-questions",
    items: [
      {
        question: "Where are you based?",
        answer:
          "Somerset, near Bath — South West at heart, UK-wide for the right events.",
      },
      {
        question: "Do you have public liability insurance and PAT-tested equipment?",
        answer:
          "Yes — £10m public liability and PAT-tested equipment. Certificates sent to venues on request.",
      },
      {
        question: "Can I speak with someone before booking?",
        answer:
          "Yes — call 07970 793177. Leave a message if we are on site; we call back. The contact form works best for detailed briefs.",
      },
      {
        question: "Are you reliable?",
        answer:
          "Backup artists, tested kit and clear timelines are standard. If something changes, you hear from us early with a plan.",
      },
    ],
  },
];

/** Flat list for JSON-LD FAQPage schema */
export function getAllFaqs(): FaqItem[] {
  return FAQ_SECTIONS.flatMap((section) => section.items);
}
