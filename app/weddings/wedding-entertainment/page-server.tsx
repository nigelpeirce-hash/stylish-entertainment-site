import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import WeddingEntertainmentClient from "./WeddingEntertainmentClient";

export const metadata: Metadata = createMetadata({
  title: "Wedding Entertainment | Professional Wedding DJs & Musicians | STYLISH Entertainment",
  description: "Professional wedding entertainment including DJs with sax and bongos, creative lighting, and fire pits. Trusted by venues including Babington House since 2003.",
  pathname: "weddings/wedding-entertainment",
});

export default function WeddingEntertainment() {
  return <WeddingEntertainmentClient />;
}
