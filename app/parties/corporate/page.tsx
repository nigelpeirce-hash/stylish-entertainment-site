import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import CorporateClient from "./CorporateClient";

const PAGE_URL = "https://www.stylishentertainment.co.uk/parties/corporate/";

// Title trimmed to 58 chars (was 107) and description to 152 (was 287) so
// neither truncates in Google SERPs. Long-tail keywords moved to `keywords`.
export const metadata: Metadata = createMetadata({
  title: "Corporate Event Production & Entertainment | UK Specialist",
  description:
    "Corporate event production for galas, conferences, product launches and team events. High-end DJ, lighting, sax and live entertainment across the UK.",
  path: "parties/corporate",
  keywords: [
    "corporate event production",
    "corporate event entertainment",
    "high-end corporate DJ",
    "brand launch entertainment",
    "corporate gala production",
    "corporate conference entertainment",
    "product launch entertainment",
    "team building events",
    "corporate event production Somerset",
    "corporate events South West",
    "Aston Martin event entertainment",
    "Red Bull event entertainment",
    "Soho House corporate entertainment",
  ],
});

// schema.org Service for the corporate offering. Cross-links to the homepage
// LocalBusiness via @id so Google can reconcile the provider entity across
// re-crawls. No offers/price band intentionally — corporate spend varies too
// widely (gala vs small product launch) to advertise a single range.
const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Corporate Event Production & Entertainment",
  url: PAGE_URL,
  description:
    "Corporate event production for galas, conferences, product launches and team events. High-end DJ, lighting, sax and live entertainment across the UK.",
  serviceType: "Corporate Event Entertainment",
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
      <CorporateClient />
    </>
  );
}
