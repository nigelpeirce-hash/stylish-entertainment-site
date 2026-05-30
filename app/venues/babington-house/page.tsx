import { Metadata } from "next";
import BabingtonClient from "@/app/babington-wedding-info/BabingtonClient";

export const metadata: Metadata = {
  title: "Babington House Wedding Entertainment, Lighting & DJ | Since 2003",
  description:
    "DJ Nige has been part of Babington House weddings since 2003. Stylish Entertainment provides wedding DJs, lighting design and production at Babington House — one experienced team trusted with your music and atmosphere. Check availability.",
  alternates: {
    canonical: "https://www.stylishentertainment.co.uk/venues/babington-house/",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Has DJ Nige been part of Babington House weddings since 2003?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Nigel (DJ Nige) has been part of Babington House weddings since 2003. Couples who book us benefit from his long experience of how the venue works — from the bar dancefloor to terrace lighting and the flow between spaces.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide wedding lighting at Babington House?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Stylish Entertainment is trusted to deliver Babington House wedding lighting — including options on the bar terrace such as Light and Shade tree lighting, Chill Out Camp, fairy-light canopies and more.",
      },
    },
    {
      "@type": "Question",
      name: "Can you help with both a band and a DJ in the bar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Many Babington weddings use a band followed by a DJ in the bar. We can advise on layout, sofa removal, sound and how to keep the atmosphere going when the band finishes.",
      },
    },
    {
      "@type": "Question",
      name: "When should we start planning entertainment and lighting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "As soon as your date is set. Popular summer dates fill quickly, and lighting choices benefit from an early conversation so we can align with your coordinator and other suppliers.",
      },
    },
    {
      "@type": "Question",
      name: "Do you supply live musicians at Babington?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We work with sax players, pianists, singers and other live acts who know Babington — from ceremony and drinks reception through to jamming alongside the DJ.",
      },
    },
    {
      "@type": "Question",
      name: "How do we check availability?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Contact us with your date and a brief outline of your plans. We reply within 24 hours with availability and tailored guidance for your Babington House wedding.",
      },
    },
  ],
};

export default function BabingtonHousePage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Stylish Entertainment",
    url: "https://www.stylishentertainment.co.uk",
    logo: "https://www.stylishentertainment.co.uk/logo-stylish-entertainment.png",
    sameAs: ["https://www.instagram.com/stylishentertainment"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "88 Weymouth Road",
      addressLocality: "Frome",
      addressRegion: "Somerset",
      postalCode: "BA11 1HJ",
      addressCountry: "UK",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+44-7970-793177",
      contactType: "Customer Service",
    },
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Babington House Wedding Entertainment, Lighting & Production",
    description:
      "Definitive guide to wedding entertainment, lighting and atmosphere at Babington House from DJ Nige and Stylish Entertainment — trusted at the venue since 2003.",
    author: {
      "@type": "Person",
      name: "Nigel Peirce",
      jobTitle: "Professional DJ & Event Producer",
      worksFor: {
        "@type": "Organization",
        name: "Stylish Entertainment",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "Stylish Entertainment",
      logo: {
        "@type": "ImageObject",
        url: "https://www.stylishentertainment.co.uk/logo-stylish-entertainment.png",
      },
    },
    datePublished: "2026-01-14T09:12:42Z",
    dateModified: "2026-05-30T00:00:00.000Z",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.stylishentertainment.co.uk/venues/babington-house/",
    },
    about: {
      "@type": "Place",
      name: "Babington House",
      description: "Luxury wedding venue in Somerset, UK",
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BabingtonClient />
    </>
  );
}
