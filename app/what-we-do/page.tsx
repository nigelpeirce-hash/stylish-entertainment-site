import { Metadata } from "next";
import WhatWeDoClient from "./WhatWeDoClient";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "What We Do | Complete Event Services",
  description: "Discover our complete range of event services including lighting design, venue styling, sound equipment, DJs, and musicians. Professional event solutions across the West Country.",
  pathname: "what-we-do",
});

export default function WhatWeDo() {
  return <WhatWeDoClient />;
}
