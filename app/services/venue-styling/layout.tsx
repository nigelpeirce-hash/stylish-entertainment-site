import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Venue Styling | Wedding & Event Decor Specialists",
  description:
    "Professional wedding and event venue styling: drapes, chair styling, table centerpieces, custom backdrops, photo walls and room transformations. Cohesive design across Somerset, the South West, London and the Home Counties.",
  path: "services/venue-styling",
  keywords: [
    "venue styling",
    "wedding venue styling",
    "wedding decor Somerset",
    "wedding decoration South West",
    "room transformation",
    "wedding drapes",
    "wedding chair styling",
    "wedding centerpieces",
    "wedding photo walls",
    "venue styling Bath",
    "venue styling Bristol",
  ],
});

export default function VenueStylingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
