import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import ChristmasClient from "./ChristmasClient";

const PAGE_URL = "https://www.stylishentertainment.co.uk/parties/christmas/";

export const metadata: Metadata = createMetadata({
  title: "Christmas Party Production | Corporate & Winter Celebrations",
  description:
    "Christmas party production for company Christmas parties, office celebrations and winter galas. DJs, live bands, festive lighting and full event production — Somerset, Wiltshire and UK-wide.",
  path: "parties/christmas",
  keywords: [
    "corporate Christmas party",
    "office Christmas party",
    "Christmas party entertainment",
    "Christmas party production",
    "Christmas party DJ",
    "Christmas party band",
    "winter gala entertainment",
    "company Christmas party",
    "festive event production",
    "Christmas party lighting",
    "Christmas party themes",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you provide DJs and bands for Christmas parties?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our Christmas party DJs and live bands are chosen for audience and atmosphere — company Christmas parties, office celebrations and private festive events, with music and production planned together.",
      },
    },
    {
      "@type": "Question",
      name: "Can you provide sound for speeches and awards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. PA, microphones and playback for speeches, awards and presentations — essential for corporate Christmas parties and winter galas.",
      },
    },
    {
      "@type": "Question",
      name: "Can you provide festive lighting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Warm amber uplighting, fairy lights, mirror balls, dining atmosphere and dancefloor energy — experience-led Christmas party lighting, not an equipment catalogue.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide live musicians?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Live musicians, bands and performers where the brief suits — curated for the audience, alongside DJs and production when needed.",
      },
    },
    {
      "@type": "Question",
      name: "Can you support corporate Christmas parties?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We produce corporate Christmas parties and company celebrations regularly — Christmas is often the most important date in the corporate calendar.",
      },
    },
    {
      "@type": "Question",
      name: "Can you help with private Christmas parties?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Luxury private Christmas parties at home, in marquees and festive venues — production shaped for your guest list, not a generic package.",
      },
    },
    {
      "@type": "Question",
      name: "Do you travel outside Somerset and Wiltshire?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We work across London, the Home Counties and UK-wide for Christmas parties and winter galas.",
      },
    },
    {
      "@type": "Question",
      name: "How early should we book our Christmas party?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Popular Friday and Saturday dates in November and December fill quickly. Enquire as soon as your venue and date are confirmed.",
      },
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Christmas Party Production",
  url: PAGE_URL,
  description:
    "Christmas party production for company celebrations, winter galas and festive events. DJs, live bands, lighting and full production across the UK.",
  serviceType: "Christmas Party Production",
  category: "Corporate Events",
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

export default function ChristmasParties() {
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
      <ChristmasClient />
    </>
  );
}
