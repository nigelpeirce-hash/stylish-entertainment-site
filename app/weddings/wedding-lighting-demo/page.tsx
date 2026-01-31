import { Metadata } from "next";
import WeddingLightingDemoClient from "./WeddingLightingDemoClient";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Wedding Lighting Demo | Atmosphere-First Design",
  description: "Demo: Editorial wedding lighting page—room vs vibe, lighting personas, and Choose Your Mood table. West Country only.",
  pathname: "weddings/wedding-lighting-demo",
});

export default function WeddingLightingDemoPage() {
  return <WeddingLightingDemoClient />;
}
