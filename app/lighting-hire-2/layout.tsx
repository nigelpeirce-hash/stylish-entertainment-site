import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

// NOTE: This page overlaps in topic with /services/lighting-design/. Distinct
// metadata avoids the homepage-default fallback and stops the two pages
// competing on identical titles, but they remain potential consolidation
// candidates. Title/description focus on uplighting & dance-floor packages
// to differentiate from the broader /services/lighting-design/ page.
export const metadata: Metadata = createMetadata({
  title: "Wedding Lighting Hire | LED Uplighting & Dance Floor Packages",
  description:
    "Hire professional wedding lighting: LED uplighters, intelligent moving lights, dance-floor packages and atmospheric mood lighting for weddings and events across the South West.",
  path: "lighting-hire-2",
  keywords: [
    "Wedding Lighting Hire",
    "LED Uplighting Hire",
    "Dance Floor Lighting",
    "Moving Head Hire",
    "Wedding Lighting South West",
  ],
});

export default function LightingHire2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
