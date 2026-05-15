import { generateCanonicalUrl } from "./metadata";

const SITE_URL = "https://www.stylishentertainment.co.uk";
const PUBLISHER_LOGO =
  "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw";

export interface BlogPostingInput {
  /** Path under /about/blog/, e.g. "bristol-university-spring-ball" */
  slug: string;
  /** Visible H1 / canonical post title */
  headline: string;
  description: string;
  /** Absolute URL of the hero/feature image */
  image: string;
  /** ISO 8601 publication date */
  datePublished: string;
  /** ISO 8601 last-modified date; defaults to datePublished */
  dateModified?: string;
}

/**
 * Build a schema.org BlogPosting JSON-LD object for a blog post.
 * Returns a plain JS object — caller is responsible for JSON.stringify
 * and rendering inside `<script type="application/ld+json">`.
 */
export function buildBlogPostingJsonLd(input: BlogPostingInput) {
  const url = generateCanonicalUrl(`about/blog/${input.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: input.headline,
    description: input.description,
    image: input.image,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    inLanguage: "en-GB",
    author: {
      "@type": "Organization",
      name: "Stylish Entertainment",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Stylish Entertainment",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: PUBLISHER_LOGO,
      },
    },
  };
}
