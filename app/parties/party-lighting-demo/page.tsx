import { Metadata } from "next";
import PartyLightingDemoClient from "./PartyLightingDemoClient";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Party Lighting Portfolio Demo | Visual-First Design",
  description: "Demo: High-end visual portfolio for party lighting—mood gallery, service cards, venue spotlights, and filtering.",
  pathname: "parties/party-lighting-demo",
  noindex: true,
});

export default function PartyLightingDemoPage() {
  return <PartyLightingDemoClient />;
}
