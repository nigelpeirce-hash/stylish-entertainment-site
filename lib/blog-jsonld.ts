import { generateCanonicalUrl } from "./metadata";

const SITE_URL = "https://www.stylishentertainment.co.uk";
const PUBLISHER_LOGO =
  "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw";

export interface BlogPostingInput {
  /** Path under /about/blog/, e.g. "bristol-university-spring-ball" */
  slug: string;
  /** Full canonical path segment (no slashes), e.g. "about/journal/how-to-keep-a-wedding-dancefloor-full" */
  pathname?: string;
  /** Visible H1 / canonical post title */
  headline: string;
  description: string;
  /** Absolute URL of the hero/feature image */
  image: string;
  /** ISO 8601 publication date */
  datePublished: string;
  /** ISO 8601 last-modified date; defaults to datePublished */
  dateModified?: string;
  /** Override default Organization author — e.g. DJ Nige as Person */
  author?: { name: string; url?: string; type?: "Person" | "Organization" };
}

/**
 * Build a schema.org BlogPosting JSON-LD object for a blog post.
 * Returns a plain JS object — caller is responsible for JSON.stringify
 * and rendering inside `<script type="application/ld+json">`.
 */
export function buildBlogPostingJsonLd(input: BlogPostingInput) {
  const path = input.pathname ?? `about/blog/${input.slug}`;
  const url = generateCanonicalUrl(path);
  const author = input.author
    ? {
        "@type": input.author.type ?? "Person",
        name: input.author.name,
        ...(input.author.url ? { url: input.author.url } : {}),
      }
    : {
        "@type": "Organization" as const,
        name: "Stylish Entertainment",
        url: SITE_URL,
      };
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
    author,
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
