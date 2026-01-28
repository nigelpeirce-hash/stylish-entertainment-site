// Force dynamic rendering - this page cannot be statically generated
// This must be at the very top to prevent build-time prerendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import ProfessionalDJBlogWrapper from "@/components/blog/ProfessionalDJBlogWrapper";

// Additional route segment config to ensure no static generation
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// Skip static generation entirely - build on-demand when users visit
export async function generateStaticParams() {
  return [];
}

export default async function BlogPostProfessionalDJ() {
  return <ProfessionalDJBlogWrapper />;
}
