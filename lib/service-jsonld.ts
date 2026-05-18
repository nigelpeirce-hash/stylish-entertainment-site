/**
 * Service JSON-LD builder for wedding-DJ location landing pages.
 *
 * Produces a schema.org `Service` object enriched with:
 *   - stable `@id` per page,
 *   - canonical `url`,
 *   - `provider` cross-linked to the LocalBusiness defined on the homepage
 *     (id `${SITE_URL}/#localbusiness`, see app/page.tsx),
 *   - `areaServed` (single City/AdministrativeArea or array),
 *   - optional hero `image`,
 *   - `offers` as an AggregateOffer with GBP low/high price range so the
 *     pricing band is eligible for rich-result display.
 *
 * Why richer than the previous inline `serviceSchema`:
 *   - The previous version had no `url`, no `@id`, no price, no image.
 *     Without `offers` Google can index the Service but cannot show a
 *     pricing rich result. Without `@id` Google cannot reconcile the
 *     same logical Service across re-crawls.
 *
 * Defaults reflect the live business as of May 2026: typical wedding DJ
 * spend at Stylish Entertainment is £600–£1200 depending on the artist
 * and lineup. Override per-page if a region needs a different range.
 */

const SITE_URL = "https://www.stylishentertainment.co.uk";
const LOCAL_BUSINESS_ID = `${SITE_URL}/#localbusiness`;
const PROVIDER_NAME = "Stylish Entertainment";

export type AreaServedNode = {
  "@type": "City" | "AdministrativeArea" | "Country" | "State";
  name: string;
  containedInPlace?: { "@type": "AdministrativeArea" | "Country"; name: string };
};

export interface WeddingDjServiceInput {
  /** Path segment after baseUrl, e.g. `"wedding-dj-bath"` (no slashes) */
  slug: string;
  /** Canonical service name, e.g. `"Wedding DJ Bath"` */
  name: string;
  /** 1–2 sentence marketing description (will be visible in rich results) */
  description: string;
  /** schema.org area-served node, or array of them for multi-region pages */
  areaServed: AreaServedNode | AreaServedNode[];
  /** Optional absolute hero image URL (must be absolute, not site-relative) */
  image?: string;
  /** Low end of price range, defaults to 600 (GBP) */
  lowPrice?: number;
  /** High end of price range, defaults to 1200 (GBP) */
  highPrice?: number;
}

/**
 * Build a schema.org Service JSON-LD object for a wedding-DJ location page.
 * Caller is responsible for `JSON.stringify` and rendering inside
 * `<script type="application/ld+json">`.
 */
export function buildWeddingDjServiceJsonLd(input: WeddingDjServiceInput) {
  const url = `${SITE_URL}/${input.slug}/`;
  const lowPrice = input.lowPrice ?? 600;
  const highPrice = input.highPrice ?? 1200;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: input.name,
    url,
    description: input.description,
    serviceType: "Wedding DJ",
    category: "Wedding Entertainment",
    provider: {
      "@type": "Organization",
      "@id": LOCAL_BUSINESS_ID,
      name: PROVIDER_NAME,
      url: SITE_URL,
    },
    areaServed: input.areaServed,
    ...(input.image ? { image: input.image } : {}),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "GBP",
      lowPrice,
      highPrice,
      url,
      availability: "https://schema.org/InStock",
      offeredBy: {
        "@type": "Organization",
        "@id": LOCAL_BUSINESS_ID,
        name: PROVIDER_NAME,
      },
    },
  };
}
