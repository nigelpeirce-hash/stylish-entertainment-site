import { Metadata } from "next";
import BabingtonClient from "./BabingtonClient";

export const metadata: Metadata = {
  title: "Babington House Wedding Info | Stylish Entertainment",
  description: "Comprehensive guide to planning your Babington House wedding. DJ Nige shares insights on the bar, terrace, orangery, and other areas of this stunning venue.",
};

export default function BabingtonWeddingInfo() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Stylish Entertainment",
    "url": "https://www.stylishentertainment.co.uk",
    "logo": "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/logo-header.svg",
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
        "url": "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/logo-header.svg"
      }
    },
    "datePublished": "2024-01-01",
    "dateModified": "2024-01-01",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.stylishentertainment.co.uk/babington-wedding-info"
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
