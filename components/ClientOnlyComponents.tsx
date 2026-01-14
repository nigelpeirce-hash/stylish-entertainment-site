"use client";

import dynamic from "next/dynamic";

// Dynamically import heavy components that don't need to block initial render
const EventDatePrompt = dynamic(() => import("@/components/EventDatePrompt"), {
  ssr: false,
});
const HeaderCountdown = dynamic(() => import("@/components/HeaderCountdown"), {
  ssr: false,
});

export default function ClientOnlyComponents() {
  return (
    <>
      <HeaderCountdown />
      <EventDatePrompt />
    </>
  );
}
