import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import CorporateClient from "./CorporateClient";

const PAGE_URL = "https://www.stylishentertainment.co.uk/parties/corporate/";

export const metadata: Metadata = createMetadata({
  title: "Corporate Event Production & Entertainment | UK Specialist",
  description:
    "Brand event production for product launches, awards nights, client entertaining and Christmas parties. Corporate entertainment, sound, lighting and DJs — Somerset, London and UK-wide.",
  path: "parties/corporate",
  keywords: [
    "corporate event production",
    "corporate entertainment",
    "corporate event DJ",
    "brand event production",
    "product launch entertainment",
    "awards night production",
    "Christmas party DJ",
    "summer party entertainment",
    "corporate party lighting",
    "live music for corporate events",
    "event sound and lighting",
    "corporate events South West",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you provide DJs for corporate events?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our corporate event DJs are selected for audience, tone and brand fit. Music, sound and guest experience are planned for the event purpose, whether that is client entertaining or a Christmas party dancefloor.",
      },
    },
    {
      "@type": "Question",
      name: "Can you provide PA and microphones for speeches?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Clear speech reinforcement, reliable playback and balanced music levels are standard — from boardroom presentations to awards-night programmes with multiple speakers and walk-up music.",
      },
    },
    {
      "@type": "Question",
      name: "Can you support awards nights and presentations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We regularly support awards nights with sound, lighting, walk-up music and technical coordination so presentations feel polished and the celebration afterwards has proper production behind it.",
      },
    },
    {
      "@type": "Question",
      name: "Can you provide lighting in brand colours?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Intelligent lighting can support presentations, brand colours, dinner atmosphere and party energy. The brief determines whether lighting stays discreet or becomes part of the celebration.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide live musicians as well as DJs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Live musicians, sax and percussion can be added where the audience and setting suit them — curated for the event purpose, not added for the sake of it.",
      },
    },
    {
      "@type": "Question",
      name: "Can you work with our event planner or agency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We coordinate with in-house teams, agencies and venues regularly — providing RAMS, technical riders and professional crews so production slots into a wider event plan without friction.",
      },
    },
    {
      "@type": "Question",
      name: "Are you insured and able to provide RAMS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We carry £10m public liability insurance, PAT-tested equipment, detailed RAMS and professional technical riders for every corporate booking.",
      },
    },
    {
      "@type": "Question",
      name: "Do you travel outside the South West?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We are based in Somerset and work across London, the Home Counties and UK-wide for corporate events, product launches and brand hospitality.",
      },
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Corporate Event Production & Entertainment",
  url: PAGE_URL,
  description:
    "Brand event production for product launches, awards nights, client entertaining and company celebrations. Corporate entertainment, sound, lighting and production across the UK.",
  serviceType: "Corporate Event Production",
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
  audience: { "@type": "BusinessAudience", name: "Corporate clients" },
};

export default function CorporateParties() {
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
      <CorporateClient />
    </>
  );
}
