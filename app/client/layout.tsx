"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  
  // Auto-bypass: Completely disable EventDatePrompt on booking pages
  // Booking pages have eventDate from the database, so no onboarding needed
  const isBookingPage = pathname?.includes("/bookings/");
  
  return (
    <>
      <HeaderCountdown />
      {/* EventDatePrompt handles its own booking page check, but we also prevent rendering here */}
      {!isBookingPage && <EventDatePrompt />}
      {children}
    </>
  );
}