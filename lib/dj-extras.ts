import type { Testimonial } from "@/data/testimonials";
import { testimonials } from "@/data/testimonials";

export interface DJResidency {
  venue: string;
  venueUrl: string;
  years: number;
  sinceYear: number;
}

export interface DJFounderStory {
  heroTagline: string;
  heroIntro: string;
  babingtonAuthority: string[];
  beyondBooth: {
    radio: { heading: string; context: string; lesson: string };
    live: { heading: string; context: string; lesson: string };
    today: { heading: string; body: string };
  };
  whyBook: Array<{ title: string; copy: string }>;
  dancefloor: Array<{ phase: string; detail: string }>;
  dancefloorMessage: string;
  careerHighlights: Array<{ label: string; detail: string }>;
  founderNarrative: string;
  typicalEvent: {
    intro: string;
    phases: Array<{ label: string; detail: string }>;
    closing: string;
  };
  atmosphereLinks: string;
  testimonialsIntro: string;
}

export interface DJExtras {
  residency?: DJResidency;
  /**
   * Long-form bio displayed ONLY on the profile page (/artists/djs/[slug]/).
   * Takes precedence over the database `fullBio` field when set.
   * The listing-page "Quick preview" modal continues to use the DB `fullBio`.
   * Format: paragraphs separated by blank lines. Markdown links [text](url)
   * are rendered as gold links.
   */
  profileBio?: string;
  profileTagline?: string;
  profileSeoDescription?: string;
  founderStory?: DJFounderStory;
  /**
   * High-resolution image URL used ONLY for the profile-page hero.
   * The DB `imageUrl` is a 400x400 face-cropped Cloudinary thumbnail (correct
   * for the listing card) which becomes blurry when stretched to 1920px hero
   * width. Set this to a wider/unconstrained Cloudinary transform of the same
   * source image. The listing card and modal continue to use the DB image.
   */
  heroImageUrl?: string;
  testimonialsHeading?: string;
  testimonialsIntro?: string;
  testimonials?: Testimonial[];
}

// Merged founder narrative — lessons only; career facts live in the timeline below.
const DJ_NIGE_FOUNDER_NARRATIVE = `I started DJing at fourteen because I was fascinated by how music changes a room — a curiosity that moved from local parties into London radio and production studios.

Twenty-two years at [Babington House](/venues/babington-house/) taught me that luxury events are about reading people, not playing louder. Pete Tong's Essential Selection taught me music programming under pressure; co-founding Factory Studios taught me production standards that now feed directly into every event.

That is the [Stylish Entertainment](/about/) philosophy: not just a DJ agency, but [wedding lighting](/weddings/wedding-lighting/), [venue styling](/services/venue-styling/) and production planned together when atmosphere matters as much as the playlist. Open-format music — chosen with instinct and timing — for events that feel effortless for you and unforgettable for your guests.`;

const DJ_NIGE_FOUNDER_STORY: DJFounderStory = {
  heroTagline:
    "Luxury wedding, party and corporate DJ. Reading rooms, not playlists.",
  heroIntro:
    "For more than thirty years Nigel Peirce has been creating memorable nights for weddings, private parties and corporate events. From producing Pete Tong's Essential Selection to becoming one of the most recognised DJs at Babington House, his career has always focused on one thing: understanding people, energy and atmosphere.",
  babingtonAuthority: [
    "Guests remember how a night felt — not which songs played in what order.",
    "Reading the room matters more than playlists. Great parties are built gradually, not announced.",
    "Different generations can share the same dancefloor when the DJ has judgement, not just a crate of hits.",
    "The best DJs watch more than they talk. Sometimes the smartest thing you can do is wait.",
    "Sometimes the right decision is playing the obvious song at exactly the right moment.",
    "Timing matters more than volume. Atmosphere beats gimmicks — every time.",
    "No two weddings are ever the same. That is why a non-cheesy wedding DJ reads people first and playlists second.",
  ],
  beyondBooth: {
    radio: {
      heading: "Radio & Production",
      context:
        "Pete Tong's Essential Selection, BBC Radio 1, London radio and co-founding Factory Studios — producing and mixing dance compilations and broadcast audio.",
      lesson:
        "This taught me music programming, production standards and audience psychology — how to hold attention without shouting for it.",
    },
    live: {
      heading: "Live Events & Festivals",
      context:
        "Glastonbury backstage on the Pyramid Stage, The Met Bar and luxury venues across London and the South West.",
      lesson:
        "This developed crowd reading, event flow and confidence under pressure — knowing when a room is ready and when it is not.",
    },
    today: {
      heading: "Events Today",
      body: "All of that now feeds into weddings, private parties and corporate events — and into the wider Stylish Entertainment philosophy. DJing is one part of the atmosphere. [Wedding entertainment](/weddings/wedding-entertainment/), [lighting design](/weddings/wedding-lighting/), [private parties](/parties/private-parties/) and [venue styling](/services/venue-styling/) can be planned together by one experienced team.",
    },
  },
  whyBook: [
    {
      title: "No cheesy routines",
      copy: "No novelty acts, no forced fun — a non-cheesy wedding DJ who lets the music do the talking.",
    },
    {
      title: "No forced audience participation",
      copy: "No mic-hype, no YMCA — confidence without ego.",
    },
    {
      title: "Mixed generations, one dancefloor",
      copy: "Open-format DJ sets that bring different ages together without dumbing down the music.",
    },
    {
      title: "Music tailored to your guests",
      copy: "Your must-plays and must-not-plays — curated for the room, not a generic formula.",
    },
    {
      title: "Comfortable alongside live bands",
      copy: "Seamless handovers from ceremony musicians to evening bands to the DJ set.",
    },
    {
      title: "Lighting and production expertise",
      copy: "Technical background that supports complete event atmospheres, not just a speaker on a stand.",
    },
    {
      title: "Calm, professional presence",
      copy: "Discreet, polished and attentive — atmosphere, not attention-seeking DJ performances.",
    },
  ],
  dancefloor: [
    {
      phase: "Arrival",
      detail: "Guests settle in. Background that feels considered — the tone is set long before anyone expects to dance.",
    },
    {
      phase: "Transition",
      detail: "After dinner and speeches, the room changes. Energy shifts naturally; must-plays land at the right moment.",
    },
    {
      phase: "Momentum",
      detail: "The floor starts to gather without being forced — mixed generations finding common ground.",
    },
    {
      phase: "Peak time",
      detail: "When the room is ready, energy builds. Judgement, not volume.",
    },
    {
      phase: "Late night",
      detail: "Keeping people dancing without exhausting the room — the hours after midnight matter.",
    },
  ],
  dancefloorMessage:
    "A packed dancefloor is created long before the first dance.",
  careerHighlights: [
    { label: "Age 14", detail: "Started DJing at local parties" },
    { label: "London radio", detail: "Built foundations in music programming and live broadcasting" },
    { label: "Essential Selection", detail: "Freelance producer on Pete Tong's Essential Selection" },
    { label: "Factory Studios", detail: "Co-founded award-winning TV and radio production company" },
    { label: "Glastonbury", detail: "Performed backstage at the Pyramid Stage" },
    { label: "The Met Bar", detail: "Premium London venue experience" },
    { label: "2003 — present", detail: "Resident DJ at Babington House" },
    { label: "Stylish Entertainment", detail: "Founder — weddings, parties, corporate events and production" },
  ],
  founderNarrative: DJ_NIGE_FOUNDER_NARRATIVE,
  typicalEvent: {
    intro:
      "Every wedding and private celebration has its own personality — but most evenings follow a natural shape. Here is how a typical DJ Nige event tends to unfold.",
    phases: [
      {
        label: "Arrival & drinks",
        detail:
          "Background that feels curated, not generic. Conversation flows; nobody is thinking about the DJ yet — but the tone is already set.",
      },
      {
        label: "Dinner atmosphere",
        detail:
          "Warmth and clarity for speeches. Understated music that keeps the room feeling intimate, not empty.",
      },
      {
        label: "Transition after speeches",
        detail:
          "Energy shifts gradually. Must-plays land at the right moment; the floor begins to gather without being forced.",
      },
      {
        label: "First dance",
        detail:
          "Timed and supported properly — then into a set that reads the room, not a pre-written playlist.",
      },
      {
        label: "Peak dancefloor",
        detail:
          "Mixed generations, momentum building. Judgement and music knowledge — not mic-hype or novelty routines.",
      },
      {
        label: "Late-night finish",
        detail:
          "Keeping people who do not want to leave. The hours after midnight matter as much as the peak.",
      },
    ],
    closing:
      "Whether it is a luxury wedding, a private party or a corporate celebration, the goal is the same: an evening that feels effortless for you and unforgettable for your guests.",
  },
  atmosphereLinks:
    "DJ Nige is one part of Stylish Entertainment — the founder story behind a team that plans [wedding entertainment](/weddings/wedding-entertainment/), [wedding lighting](/weddings/wedding-lighting/), [private parties](/parties/private-parties/) and [venue styling](/services/venue-styling/) as one atmosphere. Meet the wider [DJ roster](/artists/djs/) held to the same standard.",
  testimonialsIntro: "What matters most is what clients say after the event.",
};

// Hand-picked testimonial lineup for DJ Nige's profile page, displayed in
// this exact order. Two Babington House (his 22-year residency) plus one
// non-Babington venue to show geographic / venue range.
const NIGE_PROFILE_TESTIMONIAL_AUTHORS: readonly string[] = [
  "Riley & Emily Broudie",     // Babington House, Somerset
  "Colin and Lian Lockhead",   // Babington House, Somerset
  "Hollie & Lewis Corby",      // Penarth Pier Pavilion, Wales
];

const DJ_NIGE_HERO_IMAGE =
  "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto,w_1920,c_limit/v1768163712/Mirjam-and-Ben-0970-1_mjs2ws.jpg";
const DJ_JAMES_HERO_IMAGE =
  "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto,w_1920,c_limit/v1768163128/James-F-DJ_wgijk1.jpg";
const JAMES_H_HERO_IMAGE =
  "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto,w_1920,c_limit/v1769625669/9747514b-c254-4782-a155-30c0ba513b94_ach2cd.jpg";
const RICH_S_HERO_IMAGE =
  "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto,w_1920,c_limit/v1768163359/Rich-S-DJ_qxsnht.jpg";

/**
 * Per-DJ enrichment: long-term venue residencies and curated testimonials.
 *
 * Keep this small and explicit. We don't want to surprise the rest of the
 * DJ roster with auto-attributed quotes — testimonials in /data don't have
 * a DJ field, so the only safe attribution is hand-picked per slug.
 */
export function getDJExtras(slug: string): DJExtras | null {
  if (slug === "dj-nige") {
    return {
      residency: {
        venue: "Babington House",
        venueUrl: "/venues/babington-house/",
        years: 22,
        sinceYear: 2003,
      },
      profileTagline: DJ_NIGE_FOUNDER_STORY.heroTagline,
      profileBio: DJ_NIGE_FOUNDER_NARRATIVE,
      profileSeoDescription:
        "Luxury wedding DJ and open-format private party DJ — non-cheesy wedding DJ for Somerset, Bath, Bristol and UK-wide. Resident at Babington House since 2003.",
      founderStory: DJ_NIGE_FOUNDER_STORY,
      heroImageUrl: DJ_NIGE_HERO_IMAGE,
      testimonialsHeading: "What Couples Are Saying",
      testimonialsIntro: DJ_NIGE_FOUNDER_STORY.testimonialsIntro,
      testimonials: NIGE_PROFILE_TESTIMONIAL_AUTHORS
        .map((name) => testimonials.find((t) => t.author === name))
        .filter((t): t is Testimonial => Boolean(t)),
    };
  }

  if (slug === "dj-james") {
    return { heroImageUrl: DJ_JAMES_HERO_IMAGE };
  }
  if (slug === "james-h") {
    return { heroImageUrl: JAMES_H_HERO_IMAGE };
  }
  if (slug === "rich-s") {
    return { heroImageUrl: RICH_S_HERO_IMAGE };
  }

  return null;
}
