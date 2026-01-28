// Force dynamic rendering - this page cannot be statically generated
// This must be at the very top to prevent build-time prerendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import dynamicImport from "next/dynamic";

// Additional route segment config to ensure no static generation
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// Skip static generation entirely - build on-demand when users visit
export async function generateStaticParams() {
  return [];
}

// Dynamically import the client component to prevent SSR/prerendering issues
const ProfessionalDJBlogContent = dynamicImport(() => import("./ProfessionalDJBlogContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  ),
});

export default async function BlogPostProfessionalDJ() {
  return <ProfessionalDJBlogContent />;
}
