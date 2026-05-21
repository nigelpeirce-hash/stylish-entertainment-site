import { fetchActiveDJsForRoster } from "@/lib/dj-data";
import DJsPageContent from "./DJsPageContent";

// Roster data is fetched server-side so the DJ cards + internal links to
// each /artists/djs/[slug]/ profile are present in the initial HTML for
// crawlers and LLMs. Metadata is defined in layout.tsx so it stays correct.

const SITE_URL = "https://www.stylishentertainment.co.uk";
const PAGE_URL = `${SITE_URL}/artists/djs/`;

export default async function DJsPage() {
  const djs = await fetchActiveDJsForRoster();

  // CollectionPage + ItemList JSON-LD. Each DJ is an ItemListElement pointing
  // at its individual /artists/djs/[slug]/ profile so Google can crawl the
  // roster as a structured set rather than parsing card markup.
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}#collection`,
    name: "Stylish Entertainment DJs",
    url: PAGE_URL,
    description:
      "Wedding and event DJs at Stylish Entertainment, including DJ Nige (22-year resident at Babington House), DJ James, James H and Rich S.",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Stylish Entertainment",
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: djs.length,
      itemListElement: djs.map((dj, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Person",
          "@id": `${SITE_URL}/artists/djs/${dj.slug}/#person`,
          name: dj.name,
          url: `${SITE_URL}/artists/djs/${dj.slug}/`,
          ...(dj.imageUrl ? { image: dj.imageUrl } : {}),
          ...(dj.strapLine ? { description: dj.strapLine } : {}),
          jobTitle: "DJ",
          worksFor: {
            "@type": "Organization",
            "@id": `${SITE_URL}/#localbusiness`,
            name: "Stylish Entertainment",
          },
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <DJsPageContent djs={djs} />
    </>
  );
}
