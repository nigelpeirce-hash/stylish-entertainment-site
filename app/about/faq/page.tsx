import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import FaqClient from "./FaqClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about wedding and event entertainment, DJs, lighting and venue styling.",
  pathname: "about/faq",
});

export default function FAQPage() {
  return <FaqClient />;
}
