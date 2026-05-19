import type { Testimonial } from "@/data/testimonials";
import { testimonials } from "@/data/testimonials";

export interface DJResidency {
  venue: string;
  venueUrl: string;
  years: number;
  sinceYear: number;
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
  /**
   * High-resolution image URL used ONLY for the profile-page hero.
   * The DB `imageUrl` is a 400x400 face-cropped Cloudinary thumbnail (correct
   * for the listing card) which becomes blurry when stretched to 1920px hero
   * width. Set this to a wider/unconstrained Cloudinary transform of the same
   * source image. The listing card and modal continue to use the DB image.
   */
  heroImageUrl?: string;
  testimonialsHeading?: string;
  testimonials?: Testimonial[];
}

// Long-form profile bio for DJ Nige. Source of truth for /artists/djs/dj-nige/.
const DJ_NIGE_PROFILE_BIO = `DJ Nige began DJing at the age of 14, building his reputation through local parties before moving into the worlds of London radio, music production and live entertainment. Over the last three decades he has developed a reputation not simply as a DJ, but as an experience creator — combining music, lighting, production and live entertainment to shape the atmosphere of exceptional events.

A defining part of Nige's career has been his 22-year residency at [Babington House](/venues/babington-house/), the renowned Soho House hotel and private members' club in Somerset. Over two decades behind the decks, he has become widely regarded by guests and clients as a Babington House legend, trusted to soundtrack everything from intimate celebrity parties to large-scale weddings and high-profile private events. His ability to read a room, control energy and evolve the atmosphere naturally throughout an evening has made him one of the South West's most respected luxury event DJs.

Alongside his residency, Nige worked as a freelance producer on Pete Tong's Essential Selection, travelling across clubs and events throughout the UK and Europe, while also performing backstage at Glastonbury Festival on the Pyramid Stage. His career later expanded into premium London venues including The Met Bar, where he entertained high-profile clients and refined the polished, music-led approach he is known for today.

Beyond DJing, Nige co-founded Factory Studios, an award-winning TV and radio production company, producing and mixing dance compilation albums and working across broadcast and commercial audio production. That technical background now feeds directly into his event work, where he frequently designs complete experiences involving DJs, live bands, intelligent lighting, staging and event production.

Musically, Nige's style is driven by deep knowledge rather than predictable playlists. His collection spans everything from soul, funk, disco and reggae through to house, garage, Ibiza classics, indie, R&B and contemporary party music — all delivered with the instinct and timing of a true open-format DJ. His philosophy is simple: great parties are not created by pressing play, but by understanding people, energy and atmosphere.

Whether performing at luxury weddings, corporate celebrations or private house parties, DJ Nige is known for creating events that feel effortless, immersive and unforgettable.`;

// Hand-picked testimonial lineup for DJ Nige's profile page, displayed in
// this exact order. Two Babington House (his 22-year residency) plus one
// non-Babington venue to show geographic / venue range.
const NIGE_PROFILE_TESTIMONIAL_AUTHORS: readonly string[] = [
  "Riley & Emily Broudie",     // Babington House, Somerset
  "Colin and Lian Lockhead",   // Babington House, Somerset
  "Hollie & Lewis Corby",      // Penarth Pier Pavilion, Wales
];

// High-resolution hero images per DJ slug. Each is the SAME source photo as
// the DB imageUrl, but transformed at 1920px wide with no face-crop so it
// doesn't blur when stretched across the profile-page hero. The DB image
// keeps its `w_400,h_400,c_fill,g_face` thumbnail crop because that's the
// right shape for the listing card.
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
      profileBio: DJ_NIGE_PROFILE_BIO,
      heroImageUrl: DJ_NIGE_HERO_IMAGE,
      // Map authors to testimonials, preserving the explicit order above.
      testimonials: NIGE_PROFILE_TESTIMONIAL_AUTHORS
        .map((name) => testimonials.find((t) => t.author === name))
        .filter((t): t is Testimonial => Boolean(t)),
    };
  }

  // Hero-only overrides for the rest of the roster. The profile pages
  // otherwise render entirely from DB fields (bio/fullBio/seoTitle etc.).
  // Add residency / testimonials / profileBio later if/when curated.
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
