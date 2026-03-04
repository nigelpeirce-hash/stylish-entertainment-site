import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Venue Styling",
  description:
    "Venue styling and decoration for weddings and events. Transform your space.",
  pathname: "services/venue-styling",
});

export default function VenueStylingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
