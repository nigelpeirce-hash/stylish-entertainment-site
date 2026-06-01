// Force dynamic rendering - this page cannot be statically generated
// This must be at the very top to prevent build-time prerendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import ProfessionalDJBlogWrapper from "@/components/blog/ProfessionalDJBlogWrapper";
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
  slug: "why-you-should-use-an-experienced-professional-dj",
  headline: "Why You Should Use an Experienced, Professional DJ",
  description:
    "Discover why hiring an experienced, professional DJ is essential for your wedding or event. Learn about the benefits of professional DJ services over amateur options.",
  image:
    "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163223/Nigel-DJ-Babs-House-0019_y4rjks.jpg",
  datePublished: "2026-01-13T09:46:45Z",
  dateModified: "2026-02-10T20:58:19Z",
});

export default async function BlogPostProfessionalDJ() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProfessionalDJBlogWrapper />
    </>
  );
}
