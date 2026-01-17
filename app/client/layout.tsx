"use client";

import dynamic from "next/dynamic";

// Dynamically import components for client portal only
const EventDatePrompt = dynamic(() => import("@/components/EventDatePrompt"), {
  ssr: false,
});
const HeaderCountdown = dynamic(() => import("@/components/HeaderCountdown"), {
  ssr: false,
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderCountdown />
      <EventDatePrompt />
      {children}
    </>
  );
}