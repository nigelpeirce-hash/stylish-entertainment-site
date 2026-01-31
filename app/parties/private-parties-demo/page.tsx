import { Metadata } from "next";
import PrivatePartiesDemoClient from "./PrivatePartiesDemoClient";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Private Parties Refactor Demo | Babington Standard",
  description: "Demo: High-end private parties page—Babington hero, transformation copy, planning timeline, and SEO location drawer.",
  pathname: "parties/private-parties-demo",
});

export default function PrivatePartiesDemoPage() {
  return <PrivatePartiesDemoClient />;
}
