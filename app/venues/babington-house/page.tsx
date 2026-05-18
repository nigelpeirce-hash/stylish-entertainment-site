import { Metadata } from "next";
import BabingtonClient from "@/app/babington-wedding-info/BabingtonClient";

export const metadata: Metadata = {
  title: "Babington House Wedding Info",
  description: "Comprehensive guide to planning your Babington House wedding. DJ Nige shares insights on the bar, terrace, orangery, and other areas of this stunning venue.",
  alternates: {
    canonical: "https://www.stylishentertainment.co.uk/venues/babington-house/",
  },
};

export default function BabingtonHousePage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Stylish Entertainment",
    "url": "https://www.stylishentertainment.co.uk",
    "logo": "https://www.stylishentertainment.co.uk/logo-stylish-entertainment.png",
    "sameAs": [
      "https://www.instagram.com/stylishentertainment",
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "88 Weymouth Road",
      "addressLocality": "Frome",
      "addressRegion": "Somerset",
      "postalCode": "BA11 1HJ",
      "addressCountry": "UK"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+44-7970-793177",
      "contactType": "Customer Service"
    }
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Babington House Wedding Guide",
    "description": "Comprehensive guide to planning your Babington House wedding with expert insights from DJ Nige",
    "author": {
      "@type": "Person",
      "name": "Nigel Peirce",
      "jobTitle": "Professional DJ & Event Producer",
      "worksFor": {
        "@type": "Organization",
        "name": "Stylish Entertainment"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Stylish Entertainment",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.stylishentertainment.co.uk/logo-stylish-entertainment.png"
      }
    },
    "datePublished": "2026-01-14T09:12:42Z",
    "dateModified": "2026-03-02T17:19:04Z",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.stylishentertainment.co.uk/venues/babington-house/"
    },
    "about": {
      "@type": "Place",
      "name": "Babington House",
      "description": "Luxury wedding venue in Somerset, UK"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BabingtonClient />
    </>
  );
}
