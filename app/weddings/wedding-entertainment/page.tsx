import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import WeddingEntertainmentClient from "./WeddingEntertainmentClient";

// titleAbsolute skips the root template — otherwise this title becomes 88 chars
// and truncates in SERPs.
export const metadata: Metadata = createMetadata({
  title: "Wedding Entertainment Ideas | DJs, Live Music, Lighting & Production",
  titleAbsolute: true,
  description:
    "Plan the flow of your day: drinks reception music, wedding breakfast atmosphere, evening bands, DJs and dancefloor, plus lighting and production from one team. 20+ years, trusted at Babington House since 2003.",
  path: "weddings/wedding-entertainment",
  keywords: [
    "wedding entertainment",
    "wedding entertainment ideas",
    "wedding DJ",
    "wedding band",
    "function band wedding",
    "wedding DJ Somerset",
    "wedding saxophone",
    "wedding live music",
    "wedding lighting and DJ",
    "Babington House wedding DJ",
    "wedding drinks reception music",
    "how much wedding entertainment do I need",
    "wedding entertainment cost",
    "how much does wedding entertainment cost",
    "wedding entertainment packages",
    "wedding dancefloor",
    "wedding party entertainment",
  ],
});

export default function WeddingEntertainment() {
  return <WeddingEntertainmentClient />;
}
