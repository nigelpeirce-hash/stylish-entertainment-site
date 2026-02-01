import { Metadata } from "next";
import TestimonialsClient from "./TestimonialsClient";
import { testimonials } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Client Reviews & Testimonials",
  description: "159+ 5-star wedding DJ reviews from Babington House, Devon, London, Monaco, Norfolk, Suffolk and across the UK and Europe. Discover why couples love our wedding entertainment.",
  keywords: ["Wedding DJ Testimonials", "Babington House Reviews", "Wedding Entertainment Reviews", "Party DJ Testimonials", "Somerset Wedding DJs"],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Client Reviews & Testimonials",
    description: "159+ 5-star wedding DJ reviews from Babington House, Devon, London, Monaco, Norfolk, Suffolk and across the UK and Europe. Discover why couples love our wedding entertainment.",
  },
};

export default function TestimonialsPage() {
  const ratingValue = "5";
  const reviewCount = testimonials.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "STYLISH Entertainment",
    "description": "Premium wedding and event entertainment. DJs and musicians UK-wide; lighting and styling in the South West and beyond.",
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
