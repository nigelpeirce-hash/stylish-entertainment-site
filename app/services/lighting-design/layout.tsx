import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Lighting Design | Professional Wedding & Event Lighting",
  description:
    "Bespoke wedding and event lighting design. LED uplighting, fairy-light canopies, festoon installations, intelligent moving heads, dance-floor packages and gobo projection — from the team behind Babington House's Chill Out Camp installation. Somerset, South West, London and the Home Counties.",
  path: "services/lighting-design",
  keywords: [
    "wedding lighting design",
    "fairy light canopy",
    "festoon lighting",
    "LED uplighting",
    "wedding lighting Somerset",
    "wedding lighting South West",
    "wedding lighting Bath",
    "wedding lighting Bristol",
    "event lighting design",
    "Babington House lighting",
    "Chill Out Camp lighting",
  ],
});

export default function LightingDesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
