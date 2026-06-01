import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "The Art of the Atmosphere | Lighting Inspiration Gallery",
  description:
    "Lighting inspiration and atmosphere gallery — uplighting, festoon, fairy lights, mirror balls and exterior lighting for weddings, parties and events. Explore ideas, then plan via our wedding or party lighting pages.",
  path: "what-we-do/lighting",
  keywords: [
    "lighting inspiration",
    "event lighting ideas",
    "venue lighting ideas",
    "atmospheric lighting",
    "lighting gallery",
    "wedding lighting ideas",
    "party lighting ideas",
    "festoon lighting inspiration",
  ],
});

export default function LightingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
