// Force dynamic rendering - this page cannot be statically generated
// This must be at the very top to prevent build-time prerendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import DecorBlogWrapper from "@/components/blog/DecorBlogWrapper";
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
  slug: "five-ways-to-totally-transform-a-venue-2-decor",
  headline: "Five Ways to Totally Transform a Venue #2 Decor",
  description:
    "Discover how decor can transform your wedding venue. From Middle Eastern themes to circus tents, explore creative venue styling ideas from STYLISH Entertainment.",
  image:
    "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162661/Exterior-LED-mood-Lighting_jjuuar.jpg",
  datePublished: "2026-01-13T09:46:45Z",
  dateModified: "2026-02-10T20:58:19Z",
});

export default async function BlogPostDecor() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DecorBlogWrapper />
    </>
  );
}
