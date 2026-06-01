import { Metadata } from "next";
import TestimonialsClient from "./TestimonialsClient";
import { testimonials } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Client Reviews & Testimonials | Wedding DJ & Event Production",
  description:
    "Wedding DJ reviews, wedding entertainment reviews and Babington House DJ reviews from real clients. Wedding lighting reviews, private party testimonials and event production feedback across the UK.",
  keywords: [
    "Wedding DJ Reviews",
    "Wedding Entertainment Reviews",
    "Babington House DJ Reviews",
    "Wedding Lighting Reviews",
    "Private Party Testimonials",
    "Event Production Reviews",
    "Babington House Reviews",
  ],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Client Reviews & Testimonials | Wedding DJ & Event Production",
    description:
      "Wedding DJ reviews, wedding entertainment reviews and Babington House DJ reviews from real clients. Wedding lighting reviews, private party testimonials and event production feedback across the UK.",
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
