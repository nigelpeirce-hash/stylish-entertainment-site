import { Metadata } from "next";
import WeddingLandingClient from "./WeddingLandingClient";

export const metadata: Metadata = {
  title: "Wedding DJ Hire | Professional Wedding DJs",
  description: "Award-winning wedding DJs in the West Country, London & Nationwide. Personal client portal, guest song requests, and stunning lighting design. Get your free quote today.",
  keywords: "wedding DJ, wedding DJ hire, wedding entertainment, Bristol wedding DJ, Somerset wedding DJ, Babington House DJ",
  openGraph: {
    title: "Wedding DJ Hire",
    description: "Award-winning wedding DJs with personal client portal & guest song requests. West Country, London & Nationwide.",
    type: "website",
  },
};

export default function WeddingDJPage() {
  return <WeddingLandingClient />;
}
