import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | Stylish Entertainment | West Country Wedding Entertainment",
  description: "Learn about Stylish Entertainment. We are an entertainment business based in Frome, Somerset, with 20+ years of experience in the music and advertising industries. Trusted supplier at Babington House since 2003.",
};

const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Stylish Entertainment",
  "description": "High-end event production house with 20+ years of experience in the music and creative industries. Trusted supplier at Babington House since 2003.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "88 Weymouth Road",
    "addressLocality": "Frome",
    "addressRegion": "Somerset",
    "postalCode": "BA11 1HJ",
    "addressCountry": "GB"
  },
  "telephone": "+447970793177",
  "priceRange": "$$$",
  "serviceType": [
    "Professional DJs",
    "Lighting Design",
    "Venue Styling",
    "Live Musicians",
    "Event Production",
    "Special Effects"
  ],
  "areaServed": [
    "Somerset",
    "Wiltshire",
    "Dorset",
    "Devon",
    "Gloucestershire",
    "Bath",
    "Bristol",
    "London",
    "South West England"
  ],
  "foundingDate": "2004",
  "founders": [
    {
      "@type": "Person",
      "name": "Ali Peirce",
      "jobTitle": "Venue Styling & Artist Liaison"
    },
    {
      "@type": "Person",
      "name": "Nigel Peirce",
      "jobTitle": "Production & DJ"
    }
  ]
};

export default function About() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
      <AboutClient />
    </>
  );
}