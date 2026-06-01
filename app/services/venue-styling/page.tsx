import VenueStylingClient from "./VenueStylingClient";

const PAGE_URL = "https://www.stylishentertainment.co.uk/services/venue-styling/";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you provide full venue styling?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — from consultation and table styling through to draping, backdrops, outdoor areas and lighting coordination. Scope depends on the venue and brief.",
      },
    },
    {
      "@type": "Question",
      name: "Can you style weddings and private parties?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Wedding venue styling, milestone birthdays, garden parties and private celebrations across Somerset, the South West and UK-wide.",
      },
    },
    {
      "@type": "Question",
      name: "Can styling be combined with lighting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely — and it should be. We plan styling alongside wedding lighting and party lighting so texture, colour and light work as one vision.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide florals?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We coordinate florals and table styling with your chosen florist rather than supplying flowers directly.",
      },
    },
    {
      "@type": "Question",
      name: "Can you work with our florist or planner?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We are used to working alongside florists, planners and venue teams so styling, lighting and production stay coordinated.",
      },
    },
    {
      "@type": "Question",
      name: "Do you style marquees and barns?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Regularly. Marquees, barns, orangeries and country houses are among the spaces we style most.",
      },
    },
    {
      "@type": "Question",
      name: "Can you provide themed styling?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — alpine lodge, winter wonderland, Gatsby, disco and bespoke concepts where the brief suits.",
      },
    },
    {
      "@type": "Question",
      name: "How early should we enquire?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For peak wedding dates and December events, enquire as soon as your venue and date are confirmed — styling and lighting benefit from lead time.",
      },
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Venue Styling & Transformation",
  url: PAGE_URL,
  description:
    "Venue styling and transformation for weddings, private parties and events. Styling, lighting coordination and finishing touches across Somerset, the South West and UK-wide.",
  serviceType: "Venue Styling",
  category: "Event Styling",
  provider: {
    "@type": "Organization",
    "@id": "https://www.stylishentertainment.co.uk/#localbusiness",
    name: "Stylish Entertainment",
    url: "https://www.stylishentertainment.co.uk",
  },
  areaServed: {
    "@type": "Country",
    name: "United Kingdom",
  },
};

export default function VenueStylingService() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <VenueStylingClient />
    </>
  );
}
