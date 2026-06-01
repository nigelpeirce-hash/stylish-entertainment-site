export const dynamic = "force-dynamic";
export const dynamicParams = true;

import type { Metadata } from "next";
import DancefloorFullBlogWrapper from "@/components/blog/DancefloorFullBlogWrapper";
import { buildBlogPostingJsonLd } from "@/lib/blog-jsonld";
import { createMetadata } from "@/lib/metadata";

export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

export async function generateStaticParams() {
  return [];
}

const SLUG = "how-to-keep-a-wedding-dancefloor-full";
const PATHNAME = `about/journal/${SLUG}`;
const HEADLINE = "How To Keep A Wedding Dancefloor Full";
const DESCRIPTION =
  "What keeps a wedding dancefloor full all night? Practical advice from DJ Nige, resident at Babington House since 2003 and performer at hundreds of weddings across the UK.";
const HERO_IMAGE =
  "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768737146/full-dance-floor300x200_iglsa1.jpg";

export const metadata: Metadata = createMetadata({
  title: "How To Keep A Wedding Dancefloor Full | Expert Wedding DJ Advice",
  description: DESCRIPTION,
  pathname: PATHNAME,
  titleAbsolute: true,
  keywords: [
    "wedding dancefloor ideas",
    "how to keep a wedding dancefloor full",
    "wedding DJ advice",
    "wedding music tips",
    "wedding entertainment ideas",
    "how to get guests dancing",
    "wedding reception music",
    "wedding DJ guide",
  ],
  openGraph: {
    images: [
      {
        url: HERO_IMAGE,
        width: 1200,
        height: 800,
        alt: "Packed wedding dancefloor with guests dancing at a formal reception",
      },
    ],
  },
});

const blogPostingJsonLd = buildBlogPostingJsonLd({
  slug: SLUG,
  pathname: PATHNAME,
  headline: HEADLINE,
  description: DESCRIPTION,
  image: HERO_IMAGE,
  datePublished: "2026-06-01T14:00:00Z",
  dateModified: "2026-06-01T14:00:00Z",
  author: {
    name: "DJ Nige",
    url: "https://www.stylishentertainment.co.uk/artists/djs/dj-nige/",
    type: "Person",
  },
});

export default function JournalPostDancefloorFull() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <DancefloorFullBlogWrapper />
    </>
  );
}
