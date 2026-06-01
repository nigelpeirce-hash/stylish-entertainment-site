import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { getAllFaqs } from "@/data/faq";
import FaqClient from "./FaqClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "FAQ | Event Planning Questions",
  description:
    "Practical answers on booking DJs, wedding lighting, venue styling, sound and event production — planning advice from an experienced UK events team.",
  pathname: "about/faq",
});

// IMPORTANT: FAQ copy lives in data/faq.ts. JSON-LD uses the same plain-text answers.
// Rich answers with internal links in FaqClient.tsx must not contradict data/faq.ts.
const faqs = getAllFaqs();

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqClient />
    </>
  );
}
