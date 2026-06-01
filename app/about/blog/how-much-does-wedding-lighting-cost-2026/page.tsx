// Force dynamic rendering - this page cannot be statically generated
export const dynamic = "force-dynamic";
export const dynamicParams = true;

import type { Metadata } from "next";
import WeddingLightingCostBlogWrapper from "@/components/blog/WeddingLightingCostBlogWrapper";
import { buildBlogPostingJsonLd } from "@/lib/blog-jsonld";
import { createMetadata } from "@/lib/metadata";

export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

export async function generateStaticParams() {
  return [];
}

const SLUG = "how-much-does-wedding-lighting-cost-2026";
const HEADLINE = "How Much Does Wedding Lighting Cost in 2026?";
const DESCRIPTION =
  "A practical guide to wedding lighting costs in 2026, including uplighting, fairy-light canopies, festoon, dancefloor lighting, marquee lighting and full venue transformations.";
const HERO_IMAGE =
  "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768738511/wedding-tree-lighting-2-e1510835516724_f1fant.jpg";

export const metadata: Metadata = createMetadata({
  title: "How Much Does Wedding Lighting Cost in 2026? | Wedding Lighting Prices",
  description: DESCRIPTION,
  pathname: `about/blog/${SLUG}`,
  titleAbsolute: true,
  keywords: [
    "wedding lighting cost",
    "how much does wedding lighting cost",
    "wedding lighting prices",
    "wedding uplighting cost",
    "fairy light canopy cost",
    "marquee wedding lighting cost",
    "barn wedding lighting cost",
    "wedding lighting budget",
    "wedding lighting hire",
  ],
  openGraph: {
    images: [
      {
        url: HERO_IMAGE,
        width: 1200,
        height: 800,
        alt: "Wedding tree lighting with paper lanterns and festoon lights at an outdoor evening reception",
      },
    ],
  },
});

const blogPostingJsonLd = buildBlogPostingJsonLd({
  slug: SLUG,
  headline: HEADLINE,
  description: DESCRIPTION,
  image: HERO_IMAGE,
  datePublished: "2026-06-01T10:00:00Z",
  dateModified: "2026-06-01T10:00:00Z",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does wedding lighting cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most couples spend between £600 and £1,500 on wedding lighting hire, with simple uplighting or dancefloor enhancement from around £300–£600 and full venue transformations often reaching £1,500–£5,000 or more. The final wedding lighting cost depends on venue access, coverage area, rigging, installation time and how ambitious the design is.",
      },
    },
    {
      "@type": "Question",
      name: "What is the cheapest way to improve wedding lighting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Uplighting is often the most cost-effective improvement. For £300–£900 it can warm walls, highlight architecture and change how a barn, orangery or country house feels after sunset — without needing a full rig or canopy install.",
      },
    },
    {
      "@type": "Question",
      name: "How much does a fairy light canopy cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A fairy light canopy typically costs £800–£3,000 or more, depending on ceiling height, rigging access, the area covered and how complex the install is. Barns and marquees with high ceilings often sit at the upper end of that range.",
      },
    },
    {
      "@type": "Question",
      name: "Is uplighting worth it for a wedding?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — uplighting is one of the best-value wedding lighting investments. It works quickly, suits most venues and makes a visible difference to dinner atmosphere and evening photographs without requiring a full production budget.",
      },
    },
    {
      "@type": "Question",
      name: "How early should we book wedding lighting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Book as soon as your venue and date are confirmed — ideally six to twelve months ahead for peak season. Early booking secures your date, allows a proper site visit or planning conversation, and avoids leaving lighting decisions until the last few weeks when access and crew availability become harder.",
      },
    },
  ],
};

export default async function BlogPostWeddingLightingCost() {
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
      <WeddingLightingCostBlogWrapper />
    </>
  );
}
