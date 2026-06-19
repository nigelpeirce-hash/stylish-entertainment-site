import { Metadata } from "next";
import { fetchActiveDJsForRoster } from "@/lib/dj-data";
import WeddingDjHero from "./WeddingDjHero";
import WeddingLandingClient from "./WeddingLandingClient";

export const metadata: Metadata = {
  title: "Wedding DJ Hire | No Cheesy DJs. No YMCA.",
  description: "High-quality wedding entertainment for couples who hate wedding music. No cringe, no cheesy chat. Get a quote today.",
  keywords: "wedding DJ, wedding DJ hire, wedding entertainment, Bristol wedding DJ, Somerset wedding DJ, anti-cheesy wedding DJ, Babington House DJ",
  alternates: {
    canonical: "https://www.stylishentertainment.co.uk/wedding-dj/",
  },
  openGraph: {
    title: "Wedding DJ Hire | You're Terrified of a Cheesy DJ. We're the Antidote.",
    description: "High-quality wedding entertainment. No cringe, no cheesy chat. Get a quote.",
    type: "website",
    url: "https://www.stylishentertainment.co.uk/wedding-dj/",
  },
};

export default async function WeddingDJPage() {
  const initialDjs = await fetchActiveDJsForRoster();
  return (
    <>
      <WeddingDjHero />
      <WeddingLandingClient initialDjs={initialDjs} />
    </>
  );
}
