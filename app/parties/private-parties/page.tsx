import { Metadata } from "next";
import PrivatePartiesClient from "./PrivatePartiesClient";

export const metadata: Metadata = {
  title: "Private Parties With Atmosphere | DJs, Lighting & Production | Stylish Entertainment",
  description:
    "Luxury private party DJs, lighting and production for milestone birthdays, house parties, marquee parties and private celebrations across the South West, London and UK-wide. Trusted at Babington House since 2003.",
  keywords: [
    "private party DJ",
    "birthday party entertainment",
    "luxury private party",
    "house party production",
    "party lighting hire",
    "milestone birthday party ideas",
    "50th birthday party entertainment",
    "60th birthday party entertainment",
    "marquee party production",
    "garden party lighting",
    "private party Somerset",
    "private party South West",
  ],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Private Parties With Atmosphere | Stylish Entertainment",
    description:
      "DJs, lighting and production for milestone birthdays, house parties and private celebrations — one experienced team from first idea to last dance.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you provide DJs for private parties?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We supply career private party DJs who read the room without mic-hype or forced classics — from house parties and barns to marquees and black-tie celebrations. Music, sound and production are planned together from the first conversation.",
      },
    },
    {
      "@type": "Question",
      name: "Can you provide lighting as well as music?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Party lighting hire is a core part of what we do — uplighting, festoon, fairy lights and dancefloor production designed to flatter the space and the guests, not just fill a room with equipment.",
      },
    },
    {
      "@type": "Question",
      name: "Do you work in private homes and marquees?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We regularly produce house parties, barn parties, marquee parties and garden celebrations — adapting sound levels, layout and lighting to each setting so production feels effortless.",
      },
    },
    {
      "@type": "Question",
      name: "Can you help with 50th and 60th birthdays?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Milestone birthdays are one of our specialities. We help shape the atmosphere, music flow and production for 50th and 60th birthday party entertainment that feels personal, not generic.",
      },
    },
    {
      "@type": "Question",
      name: "Do you travel outside Somerset and Wiltshire?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our heartland is the South West and Cotswolds, but we work across London, the Home Counties and UK-wide by arrangement for the right celebration.",
      },
    },
    {
      "@type": "Question",
      name: "Can you provide fire pits or outdoor lighting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Garden party lighting, festoon and fire pit hire keep outdoor spaces connected to the party — so guests drift outside for one more drink without the energy dropping.",
      },
    },
    {
      "@type": "Question",
      name: "How early should we enquire?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Popular dates — especially milestone birthdays and summer weekends — book early. Enquire as soon as you have a date and venue in mind; we will reply with honest ideas and a clear next step.",
      },
    },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "STYLISH Entertainment",
  description:
    "Private party DJs, lighting and production for milestone birthdays, house parties and luxury private celebrations across the South West and UK-wide.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "88 Weymouth Road",
    addressLocality: "Frome",
    addressRegion: "Somerset",
    postalCode: "BA11 1HJ",
    addressCountry: "GB",
  },
  areaServed: [
    { "@type": "Place", name: "South West England" },
    { "@type": "Place", name: "Cotswolds" },
    { "@type": "Place", name: "London" },
    { "@type": "Place", name: "Home Counties" },
    { "@type": "Country", name: "United Kingdom" },
  ],
  serviceType: [
    "Private Party DJ",
    "Party Lighting Hire",
    "House Party Production",
    "Marquee Party Production",
    "Birthday Party Entertainment",
  ],
};

export default function PrivateParties() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PrivatePartiesClient />
    </>
  );
}
