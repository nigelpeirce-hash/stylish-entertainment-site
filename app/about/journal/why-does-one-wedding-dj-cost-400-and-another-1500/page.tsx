export const dynamic = "force-dynamic";
export const dynamicParams = true;

import type { Metadata } from "next";
import WeddingDJCostBlogWrapper from "@/components/blog/WeddingDJCostBlogWrapper";
import { buildBlogPostingJsonLd } from "@/lib/blog-jsonld";
import { createMetadata } from "@/lib/metadata";

export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

export async function generateStaticParams() {
  return [];
}

const SLUG = "why-does-one-wedding-dj-cost-400-and-another-1500";
const PATHNAME = `about/journal/${SLUG}`;
const HEADLINE = "Why Does One Wedding DJ Cost £400 And Another £1,500?";
const DESCRIPTION =
  "Why do wedding DJ prices vary so much? A practical guide to wedding DJ costs, experience, equipment, reliability, planning, insurance and what couples are really paying for.";
const HERO_IMAGE =
  "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768162609/Nigel-DJ-Babs-House-0004_n7thhh.jpg";

export const metadata: Metadata = createMetadata({
  title: HEADLINE,
  description: DESCRIPTION,
  pathname: PATHNAME,
  titleAbsolute: true,
  keywords: [
    "wedding DJ cost",
    "how much does a wedding DJ cost",
    "wedding DJ prices",
    "wedding DJ cost UK",
    "luxury wedding DJ",
    "professional wedding DJ",
    "wedding entertainment cost",
    "wedding DJ Somerset",
    "wedding DJ Bath",
    "wedding DJ Bristol",
  ],
  openGraph: {
    images: [
      {
        url: HERO_IMAGE,
        width: 1200,
        height: 800,
        alt: "DJ Nige performing at a Babington House wedding reception",
      },
    ],
  },
});

const blogPostingJsonLd = buildBlogPostingJsonLd({
  slug: SLUG,
  pathname: PATHNAME,
  headline: HEADLINE,
  description: DESCRIPTION,
  image: HERO_IMAGE,
  datePublished: "2026-06-01T16:00:00Z",
  dateModified: "2026-06-01T16:00:00Z",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does a wedding DJ cost in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Broad UK guide ranges in 2026: budget or casual wedding DJs often £400–£700, professional wedding DJs £700–£1,200, experienced premium or luxury wedding DJs £1,200–£2,000 or more, and full DJ plus sound, lighting or production packages £1,500–£4,000+. Location, travel, timings, equipment and artist profile all affect the final quote.",
      },
    },
    {
      "@type": "Question",
      name: "Why are some wedding DJs more expensive?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Higher wedding DJ fees usually reflect experience, preparation, music judgement, reliability, insurance, backup plans, venue familiarity and professional delivery — not just hours behind the decks. You are paying for what happens when the room does not follow a playlist.",
      },
    },
    {
      "@type": "Question",
      name: "Is a cheap wedding DJ always a bad idea?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. A lower-cost DJ can suit smaller parties, casual events, short sets or simple venues with modest expectations. For a luxury wedding, complex venue, mixed guest list or high-pressure evening, paying more for experience and preparation usually reduces risk.",
      },
    },
    {
      "@type": "Question",
      name: "What should be included in a wedding DJ fee?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A clear wedding DJ fee should cover who is performing on the night, reliable sound, microphones for speeches if needed, setup and de-rig time, planning communication, insurance, PAT-tested equipment where required, and a backup plan if the DJ cannot attend. Lighting or production may be quoted separately.",
      },
    },
    {
      "@type": "Question",
      name: "Is it worth paying more for an experienced wedding DJ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It is worth paying more when music matters deeply, the guest list spans generations, the venue is complex, you need band handovers or ceremony sound, or you want peace of mind on a one-day event with no second chance. Experience does not guarantee perfection but reduces avoidable mistakes.",
      },
    },
  ],
};

export default function JournalPostWeddingDJCost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <WeddingDJCostBlogWrapper />
    </>
  );
}
