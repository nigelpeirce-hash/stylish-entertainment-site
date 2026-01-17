import { Metadata } from "next";
import WeddingLightingClient from "./WeddingLightingClient";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Wedding Lighting | Bespoke Wedding Lighting Design | STYLISH Entertainment",
  description: "Transform your wedding venue with bespoke lighting installations. Fairy lights, festoon lighting, LED uplighting, and custom wedding lighting design across Somerset, Wiltshire, Dorset, and the West Country.",
  pathname: "weddings/wedding-lighting",
});

export default function WeddingLighting() {
  return <WeddingLightingClient />;
}
