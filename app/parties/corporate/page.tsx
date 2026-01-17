import { Metadata } from "next";
import CorporateClient from "./CorporateClient";

export const metadata: Metadata = {
  title: "Corporate Event Production & Entertainment | High-end Corporate DJ | Bespoke Brand Launch Entertainment | Stylish Entertainment",
  description: "Professional corporate event production and entertainment for galas, conferences, product launches, and team-building events. High-end corporate DJ services, intelligent lighting, and curated talent. Trusted by Aston Martin, Red Bull, Sony, and more. Corporate event production Somerset.",
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
    "West Country Corporate Events",
  ],
};

export default function CorporateParties() {
  return <CorporateClient />;
}
