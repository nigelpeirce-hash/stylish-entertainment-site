"use client";

import dynamic from "next/dynamic";

const WeddingDJCostBlogContent = dynamic(
  () =>
    import(
      "@/app/about/journal/why-does-one-wedding-dj-cost-400-and-another-1500/WeddingDJCostBlogContent"
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

export default function WeddingDJCostBlogWrapper() {
  return <WeddingDJCostBlogContent />;
}
