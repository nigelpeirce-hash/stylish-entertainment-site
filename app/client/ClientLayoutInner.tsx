"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const EventDatePrompt = dynamic(() => import("@/components/EventDatePrompt"), {
  ssr: false,
});
const HeaderCountdown = dynamic(() => import("@/components/HeaderCountdown"), {
  ssr: false,
});

export default function ClientLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBookingPage = pathname?.includes("/bookings/");

  return (
    <>
      <HeaderCountdown />
      {!isBookingPage && <EventDatePrompt />}
      {children}
    </>
  );
}
