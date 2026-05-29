import { Metadata } from "next";
import TestimonialsClient from "./TestimonialsClient";
import { testimonials } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Client Reviews & Testimonials",
  description: "Five-star Google reviews from weddings and events across the UK and Europe. Trusted by couples at Babington House, Devon, London, Monaco, Norfolk, Suffolk and beyond.",
  keywords: ["Wedding DJ Testimonials", "Babington House Reviews", "Wedding Entertainment Reviews", "Party DJ Testimonials", "Somerset Wedding DJs"],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Client Reviews & Testimonials",
    description: "Five-star Google reviews from weddings and events across the UK and Europe. Trusted by couples at Babington House, Devon, London, Monaco, Norfolk, Suffolk and beyond.",
  },
};

export default function TestimonialsPage() {
  const ratingValue = "5";
  const reviewCount = testimonials.length;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylishentertainment.co.uk";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/testi/#localbusiness`,
    "name": "STYLISH Entertainment",
    "url": baseUrl,
    "description": "Premium wedding and event entertainment. DJs and musicians UK-wide; lighting and styling in the South West and beyond.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "88 Weymouth Road",
      "addressLocality": "Frome",
      "addressRegion": "Somerset",
      "postalCode": "BA11 1HJ",
      "addressCountry": "GB"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "bestRating": "5",
      "worstRating": "1",
      "reviewCount": reviewCount
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TestimonialsClient />
    </>
  );
}
