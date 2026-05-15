import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import CorporateClient from "./CorporateClient";

export const metadata: Metadata = createMetadata({
  title: "Corporate Event Production & Entertainment | High-end Corporate DJ | Bespoke Brand Launch Entertainment",
  description:
    "Professional corporate event production and entertainment for galas, conferences, product launches, and team-building events. High-end corporate DJ services, intelligent lighting, and curated talent. Trusted by Aston Martin, Red Bull, Sony, and more. Corporate event production Somerset.",
  path: "parties/corporate",
  keywords: [
    "Corporate Event Production Somerset",
    "High-end Corporate DJ",
    "Bespoke Brand Launch Entertainment",
    "Corporate Event Production",
    "Corporate Entertainment",
    "Corporate DJ Services",
    "Professional Corporate Events",
    "Brand Launch Events",
    "Corporate Gala Production",
    "Corporate Conference Entertainment",
    "Team Building Events",
    "Product Launch Entertainment",
    "Corporate Party Planning",
    "Corporate Event Management",
    "Corporate Events South West",
  ],
});

export default function CorporateParties() {
  return <CorporateClient />;
}
