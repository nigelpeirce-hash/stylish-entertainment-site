import { Metadata } from "next";
import TestimonialsClient from "./TestimonialsClient";
import { testimonials } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Client Reviews & Testimonials | STYLISH Entertainment",
  description: "Read 5-star reviews from our clients at Babington House, Kin House, and across the West Country. Discover why we are the top-rated wedding DJs in Somerset.",
  keywords: ["Wedding DJ Testimonials", "Babington House Reviews", "Wedding Entertainment Reviews", "Party DJ Testimonials", "Somerset Wedding DJs"],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Client Reviews & Testimonials | STYLISH Entertainment",
    description: "Read 5-star reviews from our clients at Babington House, Kin House, and across the West Country. Discover why we are the top-rated wedding DJs in Somerset.",
  },
};

export default function TestimonialsPage() {
  const ratingValue = "5";
  const reviewCount = testimonials.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "STYLISH Entertainment",
    "description": "Premium wedding and event entertainment across Somerset, Wiltshire, and the West Country.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "STYLISH Entertainment",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "88 Weymouth Road",
        "addressLocality": "Frome",
        "addressRegion": "Somerset",
        "postalCode": "BA11 1HJ",
        "addressCountry": "GB"
      }
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
