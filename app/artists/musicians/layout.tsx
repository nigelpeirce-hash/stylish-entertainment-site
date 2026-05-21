import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

const SITE_URL = "https://www.stylishentertainment.co.uk";
const PAGE_URL = `${SITE_URL}/artists/musicians/`;

export const metadata: Metadata = createMetadata({
  title: "Live Wedding Musicians UK | Quartets, Pianists & Bands",
  description:
    "Live musicians for weddings and events: string quartets, pianists, sax players, festival trios and bands for ceremonies, drinks and dinner UK-wide.",
  path: "artists/musicians",
  keywords: [
    "wedding musicians UK",
    "wedding string quartet",
    "wedding pianist",
    "wedding harpist",
    "wedding saxophonist",
    "festival trio",
    "wedding ceremony music",
    "drinks reception music",
    "Bristol string quartet",
    "wedding musicians Somerset",
    "wedding musicians South West",
    "live wedding entertainment",
  ],
});

// CollectionPage JSON-LD. We can't enumerate individual musicians yet (the
// page is still client-rendered) — that ships when we build the musician
// [slug]/ profile-page infrastructure. Until then the page-level schema at
// least tells Google this is a curated listing of musical acts.
const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${PAGE_URL}#collection`,
  name: "Stylish Entertainment Live Musicians",
  url: PAGE_URL,
  description:
    "Curated live musicians for weddings and events: string quartets, pianists, sax players, festival trios and bands across the UK.",
  isPartOf: {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Stylish Entertainment",
    url: SITE_URL,
  },
  about: {
    "@type": "Service",
    name: "Live Wedding Music",
    serviceType: "Live Wedding Music",
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#localbusiness`,
      name: "Stylish Entertainment",
    },
  },
};

export default function MusiciansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      {children}
    </>
  );
}
