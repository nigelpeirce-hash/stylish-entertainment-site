"use client";

import dynamic from "next/dynamic";

const WeddingLightingCostBlogContent = dynamic(
  () =>
    import(
      "@/app/about/blog/how-much-does-wedding-lighting-cost-2026/WeddingLightingCostBlogContent"
    ),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    ),
  }
);

export default function WeddingLightingCostBlogWrapper() {
  return <WeddingLightingCostBlogContent />;
}
