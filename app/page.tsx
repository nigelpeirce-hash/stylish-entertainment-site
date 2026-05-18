import { createMetadata } from "@/lib/metadata";
import HomeClient from "./HomeClient";

export const metadata = createMetadata({
  title: "Luxury DJs & Event Production",
  description:
    "Creative DJs, lighting and production for weddings and private parties across the UK.",
  pathname: "",
});

export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.stylishentertainment.co.uk";

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#localbusiness`,
    name: "Stylish Entertainment",
    url: baseUrl,
    description: "Creative entertainment and event production: Artists (DJs and musicians) UK-wide; lighting design, venue styling and technical production in the South West and beyond.",
    telephone: "+44 7970 793177",
    address: {
      "@type": "PostalAddress",
      streetAddress: "88 Weymouth Road",
      addressLocality: "Frome",
      addressRegion: "Somerset",
      postalCode: "BA11 1HJ",
      addressCountry: "GB",
    },
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <HomeClient />
    </>
  );
}
