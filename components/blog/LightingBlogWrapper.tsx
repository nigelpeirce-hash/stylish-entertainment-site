"use client";

import dynamic from "next/dynamic";

// Move the ssr: false logic HERE - this is a client component
const LightingBlogContent = dynamic(
  () => import("../app/about/blog/five-ways-to-totally-transform-a-venue-1-lighting/LightingBlogContent"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    ),
  }
);

export default function LightingBlogWrapper() {
  return <LightingBlogContent />;
}
