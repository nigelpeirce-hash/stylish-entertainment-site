"use client";

import dynamic from "next/dynamic";

const BabingtonLearningsBlogContent = dynamic(
  () =>
    import(
      "@/app/about/journal/10-things-weve-learned-from-hundreds-of-babington-house-weddings/BabingtonLearningsBlogContent"
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

export default function BabingtonLearningsBlogWrapper() {
  return <BabingtonLearningsBlogContent />;
}
