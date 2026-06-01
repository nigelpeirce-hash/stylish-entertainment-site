"use client";

import dynamic from "next/dynamic";

const DancefloorFullBlogContent = dynamic(
  () =>
    import(
      "@/app/about/journal/how-to-keep-a-wedding-dancefloor-full/DancefloorFullBlogContent"
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

export default function DancefloorFullBlogWrapper() {
  return <DancefloorFullBlogContent />;
}
