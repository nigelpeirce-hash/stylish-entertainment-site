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

/** Structured full-profile content for roster DJs (non-founder). */
export interface DJRosterProfile {
  heroTagline: string;
  heroIntro: string;
  whatTheyBring: string[];
  bestSuitedFor: Array<{ title: string; copy: string }>;
  dancefloor: Array<{ phase: string; detail: string }>;
  dancefloorMessage: string;
  musicStyle: Array<{ title: string; copy: string }>;
  careerHighlights: Array<{ label: string; detail: string }>;
  careerClosing: string;
  rosterLinks: string;
  testimonialsIntro: string;
}

export interface DJExtras {
  residency?: DJResidency;
  /**
   * Long-form bio displayed ONLY on the profile page (/artists/djs/[slug]/).
   * Takes precedence over the database `fullBio` field when set.
   * The listing-page "Quick preview" modal uses quickPreviewBio / quickPreviewStrapLine
   * when set; otherwise DB fullBio / strapLine.
   * Format: paragraphs separated by blank lines. Markdown links [text](url)
   * are rendered as gold links.
   */
  profileBio?: string;
  profileTagline?: string;
  profileSeoDescription?: string;
  founderStory?: DJFounderStory;
  /** Structured profile sections for roster DJs (Rich S, James H, DJ James). */
  rosterProfile?: DJRosterProfile;
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
  /** Overrides DB strapLine on the listing card and optional modal subtitle. */
  quickPreviewStrapLine?: string;
  /** Overrides DB fullBio in the listing-page Quick preview modal only. */
  quickPreviewBio?: string;
  /** Scan tags shown under the strapline in the Quick preview modal. */
  quickPreviewTags?: string[];
  /** Bullets shown immediately before testimonials in the Quick preview modal. */
  quickPreviewKnownFor?: string[];
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

const DJ_NIGE_QUICK_PREVIEW_STRAPLINE =
  "22 years at Babington House. A lifetime reading dancefloors.";

const DJ_NIGE_QUICK_PREVIEW_BIO = `For more than three decades Nigel Peirce has been creating unforgettable weddings, private parties and corporate events. As resident DJ at [Babington House](/venues/babington-house/) since 2003, he has become known for sophisticated music programming, instinctive crowd reading and creating packed dancefloors without gimmicks or forced interaction.

From producing Pete Tong's Essential Selection on BBC Radio 1 to DJing backstage at Glastonbury Festival and entertaining guests including Adele, Kate Winslet and James Corden, Nigel brings a depth of experience rarely found in the wedding and events world.

Luxury weddings. Private parties. Corporate celebrations. Atmosphere first, playlists second.`;

const DJ_NIGE_QUICK_PREVIEW_TAGS = [
  "Luxury Weddings",
  "Babington House",
  "Non-Cheesy DJ",
];

const DJ_NIGE_QUICK_PREVIEW_KNOWN_FOR = [
  "Reading the room",
  "Luxury weddings",
  "Mixed-generation dancefloors",
  "No forced interaction",
  "Music-led atmosphere",
];

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

const RICH_S_QUICK_PREVIEW_STRAPLINE = "Radio polish. Wedding dancefloor instinct.";

const RICH_S_QUICK_PREVIEW_BIO = `Rich S is an adaptable wedding DJ with deep music knowledge across decades and genres. He has played extensively across Oxford and London, presents on JACK FM, and is known for keeping mixed-age dancefloors busy with sets that feel energetic but well judged — tailored to each couple, not a generic wedding playlist.

Selected venues include [Babington House](/venues/babington-house/), Brympton, Cripps Barn, Orchardleigh, Coombe Lodge and North Cadbury Court. Couples book Rich when they want a warm, reliable [wedding DJ](/weddings/wedding-entertainment/) who listens, mixes smoothly and keeps the celebration moving.`;

const RICH_S_QUICK_PREVIEW_TAGS = ["Wedding DJ", "JACK FM", "Mixed-Age Crowds"];

const RICH_S_QUICK_PREVIEW_KNOWN_FOR = [
  "Broad music knowledge",
  "Radio presenter background",
  "Mixed-age weddings",
  "Adaptable crowd reading",
  "Warm, professional presence",
];

const RICH_S_ROSTER_PROFILE: DJRosterProfile = {
  heroTagline: "Radio polish. Wedding dancefloor instinct.",
  heroIntro:
    "An adaptable and accomplished wedding DJ with deep knowledge of music past and present. Rich has played extensively across Oxford and London, presents on JACK FM, and is known for keeping dancefloors full across all age groups with energetic but well-judged sets tailored to each couple.",
  whatTheyBring: [
    "Broad musical knowledge — decades and genres, not a wedding playlist on repeat.",
    "Radio presenter polish — confident on the mic when speeches or announcements need support, discreet when they do not.",
    "Adaptable crowd judgement — watches who is dancing, who is at the bar, and adjusts tempo without forcing the room.",
    "Warm, professional presence — easy to talk to during planning and calm under pressure on the night.",
    "Smooth mixing — transitions that feel natural, whether the brief is disco, RnB, indie or a must-play list with personality.",
  ],
  bestSuitedFor: [
    {
      title: "Mixed-age weddings",
      copy: "Couples whose guest list spans generations and want one dancefloor that works for all of them — without dumbing down the music.",
    },
    {
      title: "Oxford, London & the South West",
      copy: "Regular work across Oxfordshire, London and Somerset venues including Babington House, Brympton, Cripps Barn, Orchardleigh, Coombe Lodge and North Cadbury Court.",
    },
    {
      title: "Must-play couples",
      copy: "If you care about specific tracks, genres or a Doctor Who remix at midnight — Rich listens, plans and delivers.",
    },
    {
      title: "Private parties",
      copy: "Birthdays, anniversaries and celebrations where a knowledgeable DJ beats a playlist — see our [private parties](/parties/private-parties/) approach.",
    },
  ],
  dancefloorMessage: "A busy dancefloor starts with listening — not louder music.",
  dancefloor: [
    {
      phase: "Arrival & drinks",
      detail: "Background that sets a tone without announcing the party too early — conversation-friendly, still curated.",
    },
    {
      phase: "After dinner",
      detail: "Energy lifts gradually. Must-plays land at sensible moments; the floor begins to gather without a sudden genre shock.",
    },
    {
      phase: "Building momentum",
      detail: "Mixed generations finding common ground — disco into RnB, indie into chart, always with smooth transitions.",
    },
    {
      phase: "Peak time",
      detail: "When the room is ready, Rich pushes with confidence. Requests woven in; the floor stays moving.",
    },
    {
      phase: "Late night",
      detail: "Keeping people dancing without exhausting the room — judgement about when to wind down or keep going.",
    },
  ],
  musicStyle: [
    {
      title: "Open-format wedding sets",
      copy: "From classic soul and disco to modern chart and club edits — chosen for your guests, not a formula.",
    },
    {
      title: "Radio breadth",
      copy: "Presenter experience on JACK FM feeds into programming that holds attention across a long evening.",
    },
    {
      title: "Seamless mixing",
      copy: "Technical skill that supports flow — particularly when moving between eras or honouring a detailed brief.",
    },
    {
      title: "Request-friendly",
      copy: "Your must-plays and must-not-plays taken seriously; the set still feels like a journey, not a jukebox.",
    },
  ],
  careerHighlights: [
    { label: "Event DJ", detail: "Weddings and private parties across Oxford, London and the South West" },
    { label: "JACK FM", detail: "Radio presenter — music programming and live broadcasting" },
    { label: "Venue experience", detail: "Babington House, Brympton, Cripps Barn, Orchardleigh, Coombe Lodge, North Cadbury Court and more" },
    { label: "Stylish Entertainment", detail: "Core member of the [DJ roster](/artists/djs/) — held to the same production standards as the wider team" },
  ],
  careerClosing:
    "Rich is a strong choice when you want a knowledgeable, adaptable wedding DJ — someone who brings radio polish and genuine musical breadth to a mixed-age crowd.",
  rosterLinks:
    "Rich S is part of the Stylish Entertainment [DJ roster](/artists/djs/). Explore [wedding entertainment](/weddings/wedding-entertainment/), [wedding lighting](/weddings/wedding-lighting/) and [private parties](/parties/private-parties/) — or [contact us](/contact-us/) to check availability.",
  testimonialsIntro: "A selection of recent feedback from couples Rich has DJ'd for.",
};

const JAMES_H_QUICK_PREVIEW_STRAPLINE = "Presenter confidence. Big-room party energy.";

const JAMES_H_QUICK_PREVIEW_BIO = `James H is a highly sought-after DJ and presenter whose career runs from Chiltern FM and Heart FM to being the face of Topshop TV. He has performed alongside names including Judge Jules and Chase & Status, and is a regular choice for high-end brands such as Reiss and Jack Wills.

With decades of music knowledge across House, Kisstory, chart and indie, James brings big-room confidence to corporate events, brand launches and weddings that need polished microphone presence as well as skilled mixing. Venue credits include Heaven, Embassy, Chilfest, the Royal Yacht Club and North Cadbury Court.`;

const JAMES_H_QUICK_PREVIEW_TAGS = ["Corporate Events", "Brand Events", "Big-Room DJ"];

const JAMES_H_QUICK_PREVIEW_KNOWN_FOR = [
  "Corporate events",
  "Brand events",
  "Big-room confidence",
  "Broad genre knowledge",
  "Polished microphone presence",
];

const JAMES_H_ROSTER_PROFILE: DJRosterProfile = {
  heroTagline: "Presenter confidence. Big-room party energy.",
  heroIntro:
    "James is a highly sought-after DJ and presenter with a career spanning from Chiltern FM and Heart FM to being the face of Topshop TV. He has performed alongside major names like Judge Jules and Chase & Status, is a regular choice for high-end brands like Reiss and Jack Wills, and brings over five decades of music knowledge to every event.",
  whatTheyBring: [
    "Presenter confidence — comfortable hosting, announcing and holding a big room without overpowering it.",
    "Broad genre range — House and Kisstory through chart, indie and club edits; ska punk to DnB to pop when the crowd demands it.",
    "Brand and corporate experience — regular work for Reiss, Jack Wills and similar high-end clients who expect polish.",
    "Live mixing under pressure — including sound limiters and last-minute timing shifts, handled calmly on the night.",
    "Communication before the event — friendly, thorough planning so you relax knowing the music is in good hands.",
  ],
  bestSuitedFor: [
    {
      title: "Corporate & brand events",
      copy: "Product launches, company celebrations and brand activations where a presenter-led DJ sets the right tone.",
    },
    {
      title: "High-energy weddings",
      copy: "Couples who want a confident, versatile wedding DJ — not a novelty act, but a set with real range and momentum.",
    },
    {
      title: "Big-room parties",
      copy: "Large guest lists, barns and marquee weddings where the DJ needs presence as well as programming skill.",
    },
    {
      title: "Genre-spanning briefs",
      copy: "When your guests' tastes are wide and the DJ must move between styles without losing the floor.",
    },
  ],
  dancefloorMessage: "Big-room energy is built with timing — not volume alone.",
  dancefloor: [
    {
      phase: "Early evening",
      detail: "Sets the tone after speeches — energy rising naturally, not forced onto a room still eating dessert.",
    },
    {
      phase: "Genre shifts",
      detail: "Moves between styles with confidence — ska punk into DnB into pop when that is what the crowd responds to.",
    },
    {
      phase: "Peak momentum",
      detail: "Keeps the floor moving through peak time; live mixing maintains flow even with venue restrictions.",
    },
    {
      phase: "Presenter moments",
      detail: "Mic used with purpose — introductions, key tracks, energy lifts — never constant shout-outs.",
    },
    {
      phase: "Late finish",
      detail: "Flexible on timings when the party runs long; professional setup early and adaptable on the night.",
    },
  ],
  musicStyle: [
    {
      title: "House & club",
      copy: "Decades of dance music knowledge — from classic house to contemporary club edits.",
    },
    {
      title: "Chart & indie",
      copy: "Kisstory, indie and singalong moments woven into sets that still feel current.",
    },
    {
      title: "Live mixing",
      copy: "Technical skill to mix on the fly — including working around sound limiters without breaking flow.",
    },
    {
      title: "Wide genre range",
      copy: "From ska punk and DnB to chart and pop — mixing styles that reflect what the crowd responds to on the night.",
    },
  ],
  careerHighlights: [
    { label: "Radio", detail: "Chiltern FM and Heart FM — live presenting and music programming" },
    { label: "Topshop TV", detail: "Face of Topshop TV — presenter experience at scale" },
    { label: "Live & festivals", detail: "Performed alongside Judge Jules and Chase & Status; credits include Heaven, Embassy and Chilfest" },
    { label: "Brand work", detail: "Regular DJ for Reiss, Jack Wills and high-end corporate clients" },
    { label: "Venues", detail: "Royal Yacht Club, North Cadbury Court and weddings across the UK" },
  ],
  careerClosing:
    "James H suits couples and clients who want a confident event DJ with presenter polish — ideal for corporate celebrations, brand events and weddings that need big-room energy without losing control.",
  rosterLinks:
    "James H is part of the Stylish Entertainment [DJ roster](/artists/djs/). For corporate and wedding enquiries, explore [wedding entertainment](/weddings/wedding-entertainment/) or [contact us](/contact-us/) directly.",
  testimonialsIntro: "Feedback from weddings and events James has DJ'd — every quote is real and used with permission.",
};

const DJ_JAMES_QUICK_PREVIEW_STRAPLINE = "Modern weddings. Natural party energy.";

const DJ_JAMES_QUICK_PREVIEW_BIO = `DJ James combines technical mixing with an intuitive sense of what a crowd responds to. His sets move naturally from dinner music into peak-time party moments — a strong fit for couples who want a modern wedding DJ with energy and flow rather than a predictable playlist.

Couples appreciate his pre-event planning: time to talk through must-plays, must-not-plays and the mood you want before the first guest arrives. On the night, smooth transitions and guest-focused sets keep the dancefloor busy without the DJ becoming the centre of attention.`;

const DJ_JAMES_QUICK_PREVIEW_TAGS = ["Modern Weddings", "Party DJ", "Technical Mixing"];

const DJ_JAMES_QUICK_PREVIEW_KNOWN_FOR = [
  "Modern weddings",
  "Energetic parties",
  "Technical mixing",
  "Smooth flow",
  "Guest-focused sets",
];

const DJ_JAMES_ROSTER_PROFILE: DJRosterProfile = {
  heroTagline: "Modern weddings. Natural party energy.",
  heroIntro:
    "DJ James combines technical skill with an intuitive sense of what the crowd wants. His sets flow effortlessly from dinner music to peak-time party moments, making him a natural choice for weddings that want a modern, energetic celebration without a cheesy DJ performance.",
  whatTheyBring: [
    "Technical mixing — smooth transitions that keep momentum between dinner, first dance and peak party time.",
    "Intuitive programming — understands when to lift energy and when to let the room breathe.",
    "Pre-event consultation — time to discuss playlists, must-plays and the mood you want so you arrive relaxed on the day.",
    "Modern wedding focus — contemporary sets that feel fresh, not a default wedding formula.",
    "Guest-focused delivery — the music leads; no forced interaction or novelty routines.",
  ],
  bestSuitedFor: [
    {
      title: "Modern weddings",
      copy: "Couples who want a party feel after dinner — energetic, current and tailored to your guests rather than a generic wedding set.",
    },
    {
      title: "Must-play briefs",
      copy: "If you have a clear idea of the playlist you want, James listens, plans and delivers on the night.",
    },
    {
      title: "Energetic celebrations",
      copy: "Weddings and [private parties](/parties/private-parties/) where the dancefloor matters as much as the ceremony.",
    },
    {
      title: "Couples who want flow",
      copy: "When smooth transitions between phases of the evening matter — dinner, first dance, peak time — without awkward gaps.",
    },
  ],
  dancefloorMessage: "Great party nights are built gradually — dinner to peak time, not one sudden switch.",
  dancefloor: [
    {
      phase: "Dinner & early evening",
      detail: "Music that supports conversation and speeches — considered, not silent, not overpowering.",
    },
    {
      phase: "First dance & transition",
      detail: "Your key moment handled properly, then a natural lift into the main party set.",
    },
    {
      phase: "Building the floor",
      detail: "Energy increases as guests arrive on the floor — intuitive programming rather than a pre-written list.",
    },
    {
      phase: "Peak party",
      detail: "Technical mixing keeps momentum; requests and must-plays woven into a set that still feels cohesive.",
    },
    {
      phase: "Late night",
      detail: "Keeps people dancing when the room is ready — guest-focused to the end.",
    },
  ],
  musicStyle: [
    {
      title: "Modern open-format",
      copy: "Contemporary wedding and party programming — chart, club edits and crowd favourites chosen for your guests.",
    },
    {
      title: "Technical mixing",
      copy: "Smooth blends and transitions that maintain energy across genres and decades.",
    },
    {
      title: "Playlist collaboration",
      copy: "Pre-wedding conversations to understand your taste — couples often say the set exceeded what they hoped for.",
    },
    {
      title: "Party energy",
      copy: "Natural lift on the floor without mic-hype — music-led celebration from first dance to last song.",
    },
  ],
  careerHighlights: [
    { label: "Wedding DJ", detail: "Modern weddings and private celebrations across the UK" },
    { label: "Technical skill", detail: "Mixing and flow from dinner music through to peak-time party sets" },
    { label: "Client planning", detail: "Detailed pre-event discussions — must-plays, mood and timing agreed in advance" },
    { label: "Stylish Entertainment", detail: "Member of the [DJ roster](/artists/djs/) — same professional standards as the wider team" },
  ],
  careerClosing:
    "DJ James is the right choice when you want a modern, intuitive party DJ — technical skill, natural energy and a set that feels built for your guests.",
  rosterLinks:
    "DJ James is part of the Stylish Entertainment [DJ roster](/artists/djs/). Explore [wedding entertainment](/weddings/wedding-entertainment/) or [contact us](/contact-us/) to enquire about your date.",
  testimonialsIntro: "What couples say after booking DJ James for their wedding.",
};

const RICH_S_PROFILE_TESTIMONIAL_AUTHORS: readonly string[] = [
  "Hannah and Alex Torres",
  "Rich Farmer",
  "Beth and Dan Porter",
];

const JAMES_H_PROFILE_TESTIMONIAL_AUTHORS: readonly string[] = [
  "Rebecca & Dan Shreeve",
  "Clare and James Fisher",
  "Mitchell Droppa",
];

const DJ_JAMES_PROFILE_TESTIMONIAL_AUTHORS: readonly string[] = ["Charis Edwards"];

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
      quickPreviewStrapLine: DJ_NIGE_QUICK_PREVIEW_STRAPLINE,
      quickPreviewBio: DJ_NIGE_QUICK_PREVIEW_BIO,
      quickPreviewTags: DJ_NIGE_QUICK_PREVIEW_TAGS,
      quickPreviewKnownFor: DJ_NIGE_QUICK_PREVIEW_KNOWN_FOR,
      testimonials: NIGE_PROFILE_TESTIMONIAL_AUTHORS
        .map((name) => testimonials.find((t) => t.author === name))
        .filter((t): t is Testimonial => Boolean(t)),
    };
  }

  if (slug === "rich-s") {
    return {
      profileTagline: RICH_S_ROSTER_PROFILE.heroTagline,
      profileSeoDescription:
        "Wedding DJ Somerset, Bath and Bristol — radio presenter and adaptable open-format DJ for mixed-age weddings and private parties.",
      rosterProfile: RICH_S_ROSTER_PROFILE,
      heroImageUrl: RICH_S_HERO_IMAGE,
      testimonialsHeading: "What Couples Are Saying",
      testimonialsIntro: RICH_S_ROSTER_PROFILE.testimonialsIntro,
      quickPreviewStrapLine: RICH_S_QUICK_PREVIEW_STRAPLINE,
      quickPreviewBio: RICH_S_QUICK_PREVIEW_BIO,
      quickPreviewTags: RICH_S_QUICK_PREVIEW_TAGS,
      quickPreviewKnownFor: RICH_S_QUICK_PREVIEW_KNOWN_FOR,
      testimonials: RICH_S_PROFILE_TESTIMONIAL_AUTHORS.map((name) =>
        testimonials.find((t) => t.author === name)
      ).filter((t): t is Testimonial => Boolean(t)),
    };
  }

  if (slug === "james-h") {
    return {
      profileTagline: JAMES_H_ROSTER_PROFILE.heroTagline,
      profileSeoDescription:
        "Corporate event DJ and wedding DJ — presenter confidence for brand events, big-room parties and UK-wide celebrations.",
      rosterProfile: JAMES_H_ROSTER_PROFILE,
      heroImageUrl: JAMES_H_HERO_IMAGE,
      testimonialsHeading: "What Clients Are Saying",
      testimonialsIntro: JAMES_H_ROSTER_PROFILE.testimonialsIntro,
      quickPreviewStrapLine: JAMES_H_QUICK_PREVIEW_STRAPLINE,
      quickPreviewBio: JAMES_H_QUICK_PREVIEW_BIO,
      quickPreviewTags: JAMES_H_QUICK_PREVIEW_TAGS,
      quickPreviewKnownFor: JAMES_H_QUICK_PREVIEW_KNOWN_FOR,
      testimonials: JAMES_H_PROFILE_TESTIMONIAL_AUTHORS.map((name) =>
        testimonials.find((t) => t.author === name)
      ).filter((t): t is Testimonial => Boolean(t)),
    };
  }

  if (slug === "dj-james") {
    return {
      profileTagline: DJ_JAMES_ROSTER_PROFILE.heroTagline,
      profileSeoDescription:
        "Modern wedding DJ and party DJ for Somerset, Bath, Bristol and UK-wide — technical mixing and natural party energy.",
      rosterProfile: DJ_JAMES_ROSTER_PROFILE,
      heroImageUrl: DJ_JAMES_HERO_IMAGE,
      testimonialsHeading: "What Couples Are Saying",
      testimonialsIntro: DJ_JAMES_ROSTER_PROFILE.testimonialsIntro,
      quickPreviewStrapLine: DJ_JAMES_QUICK_PREVIEW_STRAPLINE,
      quickPreviewBio: DJ_JAMES_QUICK_PREVIEW_BIO,
      quickPreviewTags: DJ_JAMES_QUICK_PREVIEW_TAGS,
      quickPreviewKnownFor: DJ_JAMES_QUICK_PREVIEW_KNOWN_FOR,
      testimonials: DJ_JAMES_PROFILE_TESTIMONIAL_AUTHORS.map((name) =>
        testimonials.find((t) => t.author === name)
      ).filter((t): t is Testimonial => Boolean(t)),
    };
  }

  return null;
}
