"use client";

import dynamic from "next/dynamic";

// Move the ssr: false logic HERE - this is a client component
const BristolBlogContent = dynamic(
  () => import("@/app/about/blog/bristol-university-spring-ball/BristolBlogContent"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    ),
  }
);

export default function BristolBlogWrapper() {
  return <BristolBlogContent />;
}
