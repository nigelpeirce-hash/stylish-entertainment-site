import { Metadata } from "next";
import WeddingLandingClient from "./WeddingLandingClient";

export const metadata: Metadata = {
  title: "Wedding DJ Hire | No Cheesy DJs. No YMCA.",
  description: "High-quality wedding entertainment for couples who hate wedding music. Across the UK. No cringe, no cheesy chat. Get a quote today.",
  keywords: "wedding DJ, wedding DJ hire, wedding entertainment, Bristol wedding DJ, Somerset wedding DJ, anti-cheesy wedding DJ, Babington House DJ",
  openGraph: {
    title: "Wedding DJ Hire | You're Terrified of a Cheesy DJ. We're the Antidote.",
    description: "High-quality wedding entertainment across the UK. No cringe, no cheesy chat. Get a quote.",
    type: "website",
  },
};

export default function WeddingDJPage() {
  return <WeddingLandingClient />;
}
