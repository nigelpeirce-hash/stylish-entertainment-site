import { createMetadata } from "@/lib/metadata";
import KitHireClient from "./KitHireClient";

const PAGE_URL = "https://www.stylishentertainment.co.uk/services/kit-hire/";

export const metadata = createMetadata({
  title: "Sound, Lighting & Event Production | Technical Support",
  description:
    "Sound systems, wireless microphones, PA and technical support for weddings, parties and corporate events. PAT tested, professionally installed — event technical production across Somerset, the South West and UK-wide.",
  path: "services/kit-hire",
  keywords: [
    "event sound hire",
    "wedding sound system",
    "PA system hire",
    "wireless microphone hire",
    "wedding speech microphone",
    "corporate sound hire",
    "marquee sound system",
    "party sound system",
    "event technical production",
    "sound and lighting hire",
    "wedding sound system",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can you provide microphones for speeches?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Wireless microphone hire for speeches, toasts, awards and announcements — planned for room size and presenter movement.",
      },
    },
    {
      "@type": "Question",
      name: "Can you supply sound for a wedding ceremony?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Discreet PA and wireless microphones for ceremonies — vow audio, readings and music playback where required.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide PA systems for parties?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Party sound systems sized for guest numbers and dancefloor energy — professionally installed and supported.",
      },
    },
    {
      "@type": "Question",
      name: "Can you support bands and live musicians?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. PA, microphones and technical support for singers, musicians and bands.",
      },
    },
    {
      "@type": "Question",
      name: "Can you provide sound in a marquee or garden?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Marquee sound system hire and outdoor event production for temporary structures and gardens.",
      },
    },
    {
      "@type": "Question",
      name: "Can you provide lighting as well as sound?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, where the brief suits — dancefloor lighting, uplighting and production support alongside sound.",
      },
    },
    {
      "@type": "Question",
      name: "Do you install and operate the equipment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We install, test and operate equipment on the day when required.",
      },
    },
    {
      "@type": "Question",
      name: "Are you insured and PAT tested?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. PAT-tested equipment and £10m public liability insurance.",
      },
    },
    {
      "@type": "Question",
      name: "How do we know what equipment we need?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tell us your venue, guest numbers and what the day involves — we recommend honestly based on speeches, music and performance requirements.",
      },
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Sound, Lighting & Event Production",
  url: PAGE_URL,
  description:
    "Sound systems, wireless microphones, PA and technical support for weddings, parties and corporate events. Professional setup and operation across the UK.",
  serviceType: "Event Technical Production",
  category: "Sound & Technical Support",
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

export default function KitHireService() {
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
      <KitHireClient />
    </>
  );
}
