// Force dynamic rendering - this page cannot be statically generated
// This must be at the very top to prevent build-time prerendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import BristolBlogWrapper from "@/components/blog/BristolBlogWrapper";
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
  slug: "bristol-university-spring-ball",
  headline: "Bristol University Spring Ball",
  description:
    "STYLISH Entertainment designed and implemented lighting and sound for the Bristol University Spring Ball at Kings Weston House, transforming the venue for 750 law students.",
  image:
    "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg",
  datePublished: "2026-01-13T09:46:45Z",
  dateModified: "2026-02-10T20:58:19Z",
});

export default async function BlogPostBristolSpringBall() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BristolBlogWrapper />
    </>
  );
}
