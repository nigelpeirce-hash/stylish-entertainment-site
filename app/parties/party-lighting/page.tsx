import { Metadata } from "next";
import PartyLightingClient from "./PartyLightingClient";
import { createMetadata } from "@/lib/metadata";

const PAGE_URL = "https://www.stylishentertainment.co.uk/parties/party-lighting/";

export const metadata: Metadata = createMetadata({
  title: "Party Lighting | Dancefloor, Festoon & Event Lighting Design",
  titleAbsolute: true,
  description:
    "Party lighting hire and event lighting design — from simple dancefloor lighting and mirror balls to tree lighting, courtyard lighting, festoon and full venue transformations. Trusted at Babington House since 2003.",
  path: "parties/party-lighting",
  keywords: [
    "party lighting",
    "party lighting hire",
    "event lighting design",
    "dancefloor lighting",
    "outdoor party lighting",
    "garden party lighting",
    "courtyard lighting",
    "tree lighting",
    "marquee lighting",
    "architectural uplighting",
    "mirror ball hire",
    "festoon lighting",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can you provide simple dancefloor lighting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Not every party needs a full production. We regularly supply simple dancefloor lighting setups — mirror balls, DJ lighting and white dancefloor lighting — designed to give the floor energy without tacky disco effects.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide outdoor party lighting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Outdoor party lighting is a core part of what we do — festoon, tree lighting, courtyard lighting and garden lighting that keeps terraces and lawns connected to the party after dark.",
      },
    },
    {
      "@type": "Question",
      name: "Can you light trees, courtyards and gardens?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Tree lighting, courtyard lighting and garden party lighting are among our most requested services — especially for barn parties, marquee weekends and estate celebrations where guests move between indoor and outdoor spaces.",
      },
    },
    {
      "@type": "Question",
      name: "Can lighting be added to a DJ booking?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We often combine party lighting with DJ bookings so music and lighting are planned together — dancefloor lighting, mirror balls and atmospheric room light from one experienced team.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide lighting for marquees and barns?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Marquee lighting and barn lighting are regular requests — festoon, uplighting and fairy lights that turn a temporary structure or empty barn into a proper party room.",
      },
    },
    {
      "@type": "Question",
      name: "Do you install and remove the lighting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Delivery, installation and removal are included. We assess your venue, install before guests arrive and collect afterwards — so you focus on hosting, not cables and ladders.",
      },
    },
    {
      "@type": "Question",
      name: "How early should we enquire?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Popular summer dates and marquee weekends book early — especially when you need tree lighting, courtyard lighting or a full estate-wide design. Enquire as soon as you have a date and venue in mind.",
      },
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Party Lighting Design",
  url: PAGE_URL,
  description:
    "Party lighting hire and event lighting design — dancefloor lighting, mirror balls, architectural uplighting, festoon, tree lighting and courtyard lighting for private parties and celebrations.",
  serviceType: "Party Lighting Design",
  category: "Event Lighting",
  provider: {
    "@type": "Organization",
    "@id": "https://www.stylishentertainment.co.uk/#localbusiness",
    name: "Stylish Entertainment",
    url: "https://www.stylishentertainment.co.uk",
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "South West England" },
    { "@type": "AdministrativeArea", name: "Cotswolds" },
    { "@type": "City", name: "London" },
    { "@type": "AdministrativeArea", name: "Home Counties" },
  ],
};

export default function PartyLighting() {
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
      <PartyLightingClient />
    </>
  );
}
