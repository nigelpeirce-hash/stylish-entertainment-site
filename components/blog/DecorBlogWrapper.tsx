"use client";

import dynamic from "next/dynamic";

// Move the ssr: false logic HERE - this is a client component
const DecorBlogContent = dynamic(
  () => import("@/app/about/blog/five-ways-to-totally-transform-a-venue-2-decor/DecorBlogContent"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    ),
  }
);

export default function DecorBlogWrapper() {
  return <DecorBlogContent />;
}
