import { Metadata } from "next";
import WhatWeDoClient from "./WhatWeDoClient";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "What We Do | Complete Event Services",
  description: "Discover our complete range of event services. DJs and musicians UK-wide; lighting design and venue styling in the South West and beyond.",
  pathname: "what-we-do",
});

export default function WhatWeDo() {
  return <WhatWeDoClient />;
}
