import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Venue Styling & Transformation | Weddings & Events",
  description:
    "Venue styling and transformation for weddings, private parties and events. Styling, lighting coordination and finishing touches — Somerset, South West and UK-wide.",
  path: "services/venue-styling",
  keywords: [
    "venue styling",
    "wedding venue styling",
    "event styling",
    "party styling",
    "marquee styling",
    "barn wedding styling",
    "wedding decor",
    "venue transformation",
    "event styling Somerset",
    "party styling South West",
  ],
});

export default function VenueStylingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
