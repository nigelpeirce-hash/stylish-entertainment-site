import { Metadata } from "next";
import VenuesClient from "./VenuesClient";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Venues | Trusted Wedding Venues | STYLISH Entertainment",
  description: "Stylish Entertainment has provided entertainment and production services at prestigious venues across the UK and Europe including Babington House, Goodwood House, Cardiff Castle, and many more.",
  pathname: "venues",
});

export default function Venues() {
  return <VenuesClient />;
}
