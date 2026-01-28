// Force dynamic rendering - this page cannot be statically generated
// This must be at the very top to prevent build-time prerendering
export const dynamic = 'force-dynamic';

import dynamic from "next/dynamic";

// Additional route segment config to ensure no static generation
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// Dynamically import the client component to prevent SSR/prerendering issues
// Using a function to ensure truly lazy loading and prevent build-time evaluation
const BristolBlogContent = dynamic(
  () => import("./BristolBlogContent"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    ),
  }
);

export default async function BlogPostBristolSpringBall() {
  return <BristolBlogContent />;
}
