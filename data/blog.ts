export type BlogCategory =
  | "Wedding Entertainment"
  | "Wedding Lighting"
  | "Venue Guides"
  | "Private Parties"
  | "Corporate Events"
  | "Real Events";

export type JournalBasePath = "about/blog" | "about/journal";

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  alt: string;
  category: BlogCategory;
  /** Defaults to about/blog — newer articles may live under about/journal */
  basePath?: JournalBasePath;
}

export function getPostHref(post: BlogPost): string {
  return `/${post.basePath ?? "about/blog"}/${post.slug}/`;
}

/** Venue guide featured when no Babington blog post exists — links to existing venue content. */
export interface FeaturedGuide {
  title: string;
  href: string;
  excerpt: string;
  image: string;
  alt: string;
  label: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Wedding Entertainment",
  "Wedding Lighting",
  "Venue Guides",
  "Private Parties",
  "Corporate Events",
  "Real Events",
];

export const FEATURED_GUIDE: FeaturedGuide = {
  title: "Babington House Weddings — What We Have Learned Since 2003",
  href: "/venues/babington-house/",
  label: "Venue Guide · Featured",
  excerpt:
    "Resident DJ at Babington since 2003 — how the bar, terrace, Orangery and outdoor spaces work for music, lighting and the flow of a Soho House wedding. A practical guide from someone who has done hundreds of them.",
  image:
    "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163328/Nigel-DJ-Babs-House-0021-1_xmxz8v.jpg",
  alt: "DJ Nige at Babington House — wedding entertainment and lighting",
};

export const BROWSE_TOPICS = [
  {
    title: "Wedding Entertainment Advice",
    description: "DJs, bands, evening flow and how to plan music that reads the room.",
    href: "/weddings/wedding-entertainment/",
  },
  {
    title: "Wedding Lighting Ideas",
    description: "Uplighting, canopies, festoon and dancefloor design for barns and estates.",
    href: "/weddings/wedding-lighting/",
  },
  {
    title: "Venue Styling Inspiration",
    description: "Drapery, props and transformation — the room before guests arrive.",
    href: "/services/venue-styling/",
  },
  {
    title: "Private Party Planning",
    description: "Birthdays, celebrations and house parties planned as one atmosphere.",
    href: "/parties/private-parties/",
  },
  {
    title: "Corporate Events",
    description: "Awards nights, brand events and production support with calm delivery.",
    href: "/parties/corporate/",
  },
  {
    title: "Real Event Case Studies",
    description: "Lighting, sound and styling from events we have actually delivered.",
    href: "#all-articles",
  },
] as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "10 Things We've Learned From Hundreds Of Babington House Weddings",
    slug: "10-things-weve-learned-from-hundreds-of-babington-house-weddings",
    basePath: "about/journal",
    category: "Venue Guides",
    excerpt:
      "After hundreds of Babington House weddings since 2003, DJ Nige shares what makes the venue work — the bar, terrace, Orangery, lighting, music and guest flow from real experience.",
    image:
      "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768740393/Albert-Palmer-Photography-002_rpgfzf.jpg",
    alt: "Babington House wedding guests on the Croquet Lawn — summer estate celebration",
  },
  {
    title: "Why Does One Wedding DJ Cost £400 And Another £1,500?",
    slug: "why-does-one-wedding-dj-cost-400-and-another-1500",
    basePath: "about/journal",
    category: "Wedding Entertainment",
    excerpt:
      "Why do wedding DJ prices vary so much? An honest guide to what you are really comparing — experience, preparation, reliability, equipment and judgement on the night.",
    image:
      "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162609/Nigel-DJ-Babs-House-0004_n7thhh.jpg",
    alt: "DJ Nige performing at a Babington House wedding reception",
  },
  {
    title: "How To Keep A Wedding Dancefloor Full",
    slug: "how-to-keep-a-wedding-dancefloor-full",
    basePath: "about/journal",
    category: "Wedding Entertainment",
    excerpt:
      "What actually keeps a wedding dancefloor busy all night? Practical wedding DJ advice from Nige — resident at Babington House since 2003 — on timing, requests, lighting and reading the room.",
    image:
      "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768737146/full-dance-floor300x200_iglsa1.jpg",
    alt: "Packed wedding dancefloor with guests dancing at a formal reception",
  },
  {
    title: "How Much Does Wedding Lighting Cost in 2026?",
    slug: "how-much-does-wedding-lighting-cost-2026",
    category: "Wedding Lighting",
    excerpt:
      "Honest wedding lighting prices for 2026 — uplighting, fairy-light canopies, festoon, dancefloor rigs and full barn or marquee transformations, explained as guide ranges rather than fixed packages.",
    image:
      "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768738511/wedding-tree-lighting-2-e1510835516724_f1fant.jpg",
    alt: "Wedding tree lighting with paper lanterns and festoon lights at an outdoor evening reception",
  },
  {
    title: "Why You Should Use an Experienced, Professional DJ",
    slug: "why-you-should-use-an-experienced-professional-dj",
    category: "Wedding Entertainment",
    excerpt:
      "What separates a great wedding DJ from a playlist or an inexperienced performer? Twenty years of weddings has taught us a few things about timing, taste and keeping a dancefloor full.",
    image:
      "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163223/Nigel-DJ-Babs-House-0019_y4rjks.jpg",
    alt: "Wedding guests dancing on the bar at Babington House with a packed dancefloor",
  },
  {
    title: "Five Ways to Totally Transform a Venue #1 Lighting",
    slug: "five-ways-to-totally-transform-a-venue-1-lighting",
    category: "Wedding Lighting",
    excerpt:
      "Lighting changes how a room feels before a single guest arrives — uplighting, fairy lights, exterior glow and dancefloor rigs explained from real installs, not Pinterest boards.",
    image:
      "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162661/Exterior-LED-mood-Lighting_jjuuar.jpg",
    alt: "Professional wedding lighting design transforming venue atmosphere",
  },
  {
    title: "Five Ways to Totally Transform a Venue #2 Decor",
    slug: "five-ways-to-totally-transform-a-venue-2-decor",
    category: "Venue Guides",
    excerpt:
      "When styling works, an empty barn or marquee stops looking like a hire space and starts feeling like your event — themes, drapery and props we have used on real celebrations.",
    image:
      "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163738/Circus-Temed-Party-Tent_uizqbq.jpg",
    alt: "Circus tent venue transformation with creative decor styling",
  },
  {
    title: "Bristol University Spring Ball",
    slug: "bristol-university-spring-ball",
    category: "Real Events",
    excerpt:
      "How we lit and sounded Kings Weston House for 750 students — a large-scale ball where production, timing and venue constraints all had to work on one night.",
    image:
      "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg",
    alt: "Bristol University Spring Ball lighting design at Kings Weston House",
  },
];
