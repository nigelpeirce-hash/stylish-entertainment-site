// Force dynamic rendering - this page cannot be statically generated
// This must be at the very top to prevent build-time prerendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import LightingBlogWrapper from "@/components/blog/LightingBlogWrapper";
import { buildBlogPostingJsonLd } from "@/lib/blog-jsonld";

// Additional route segment config to ensure no static generation
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// Skip static generation entirely - build on-demand when users visit
export async function generateStaticParams() {
  return [];
}

// NOTE: Dates are codebase-history proxies, NOT original publication dates.
// Update if the true publication date is known.
const jsonLd = buildBlogPostingJsonLd({
  slug: "five-ways-to-totally-transform-a-venue-1-lighting",
  headline: "Five Ways to Totally Transform a Venue #1 Lighting",
  description:
    "Discover how lighting can transform any venue for weddings, parties, and corporate events. From fairy lights to LED uplighting, explore creative lighting design ideas from STYLISH Entertainment.",
  image:
    "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163745/Pool-Party01_qe5ro0.jpg",
  datePublished: "2026-01-13T09:46:45Z",
  dateModified: "2026-02-10T20:58:19Z",
});

export default async function BlogPostLighting() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LightingBlogWrapper />
    </>
  );
}
