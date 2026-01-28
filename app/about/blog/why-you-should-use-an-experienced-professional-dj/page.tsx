// Force dynamic rendering - this page cannot be statically generated
// This must be at the very top to prevent build-time prerendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

import dynamic from "next/dynamic";

// Dynamically import the client component to prevent SSR/prerendering issues
const ProfessionalDJBlogContent = dynamic(() => import("./ProfessionalDJBlogContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  ),
});

export default function BlogPostProfessionalDJ() {
  return <ProfessionalDJBlogContent />;
}
