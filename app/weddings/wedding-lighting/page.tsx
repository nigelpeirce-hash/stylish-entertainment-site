import { Metadata } from "next";
import WeddingLightingClient from "./WeddingLightingClient";
import { createMetadata } from "@/lib/metadata";

const PAGE_URL = "https://www.stylishentertainment.co.uk/weddings/wedding-lighting/";

// Title 56 chars (was 74) and description 162 chars (was 178). `titleAbsolute`
// skips the root "%s | STYLISH Entertainment" template — without it the
// rendered title was 87 chars and would truncate in Google SERPs. The keyword
// stack already covers the value-prop; brand surfaces via JSON-LD provider.
export const metadata: Metadata = createMetadata({
  title: "Wedding Lighting Design | Uplighting, Festoon & Fairy Lights",
  titleAbsolute: true,
  description:
    "Bespoke wedding lighting design — uplighting, fairy-light canopies, festoon and dancefloor lighting for barns, marquees and estates. Trusted at Babington House since 2003.",
  path: "weddings/wedding-lighting",
  keywords: [
    "wedding lighting",
    "wedding lighting design",
    "fairy light canopy wedding",
    "festoon lighting wedding",
    "LED uplighting wedding",
    "gobo projection wedding",
    "wedding lighting Somerset",
    "wedding lighting South West",
    "wedding lighting Bath",
    "wedding lighting Bristol",
    "Babington House wedding lighting",
    "wedding lighting cost",
    "how much does wedding lighting cost",
  ],
});

// schema.org Service for wedding lighting design. Mirrors the structure used
// on the wedding-DJ location pages (lib/service-jsonld.ts) without a price
// band because lighting installations vary too widely (single uplighters vs
// full marquee canopy) to advertise a single range.
const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Wedding Lighting Design",
  url: PAGE_URL,
  description:
    "Bespoke wedding lighting design — uplighting, fairy-light canopies, festoon and dancefloor lighting for barns, marquees and country estates. Trusted at Babington House since 2003.",
  serviceType: "Wedding Lighting Design",
  category: "Wedding Lighting",
  provider: {
    "@type": "Organization",
    "@id": "https://www.stylishentertainment.co.uk/#localbusiness",
    name: "Stylish Entertainment",
    url: "https://www.stylishentertainment.co.uk",
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "South West England" },
    { "@type": "City", name: "London" },
    { "@type": "AdministrativeArea", name: "Home Counties" },
  ],
};

export default function WeddingLighting() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <WeddingLightingClient />
    </>
  );
}
