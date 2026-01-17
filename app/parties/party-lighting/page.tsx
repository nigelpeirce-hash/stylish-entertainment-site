import { Metadata } from "next";
import PartyLightingClient from "./PartyLightingClient";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Party Lighting | Creative Party & Event Lighting | STYLISH Entertainment",
  description: "Hire party lighting, mirror balls, fairy lights, festoon lighting, disco and mood lighting for parties across Somerset, Wiltshire, Dorset, Devon and Gloucestershire.",
  pathname: "parties/party-lighting",
});

export default function PartyLighting() {
  return <PartyLightingClient />;
}
