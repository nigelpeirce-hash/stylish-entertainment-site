import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import WeddingEntertainmentClient from "./WeddingEntertainmentClient";

// titleAbsolute skips the root template — otherwise this title becomes 88 chars
// and truncates in SERPs.
export const metadata: Metadata = createMetadata({
  title: "Wedding Entertainment UK | Wedding DJs & Live Musicians",
  titleAbsolute: true,
  description: "Wedding entertainment across the UK: wedding DJs, sax and bongo duos, live trios, creative lighting and fire pits. Resident at Babington House since 2003.",
  path: "weddings/wedding-entertainment",
});

export default function WeddingEntertainment() {
  return <WeddingEntertainmentClient />;
}
