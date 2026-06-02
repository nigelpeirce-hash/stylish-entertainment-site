export const dynamic = "force-dynamic";
export const dynamicParams = true;

import type { Metadata } from "next";
import BabingtonLearningsBlogWrapper from "@/components/blog/BabingtonLearningsBlogWrapper";
import { buildBlogPostingJsonLd } from "@/lib/blog-jsonld";
import { createMetadata } from "@/lib/metadata";

export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

export async function generateStaticParams() {
  return [];
}

const SLUG = "10-things-weve-learned-from-hundreds-of-babington-house-weddings";
const PATHNAME = `about/journal/${SLUG}`;
const HEADLINE = "10 Things We've Learned From Hundreds Of Babington House Weddings";
const DESCRIPTION =
  "After hundreds of Babington House weddings since 2003, DJ Nige shares what makes the venue work so well — from the bar and terrace to lighting, music and guest flow.";
const HERO_IMAGE =
  "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768740393/Albert-Palmer-Photography-002_rpgfzf.jpg";

export const metadata: Metadata = createMetadata({
  title: HEADLINE,
  description: DESCRIPTION,
  pathname: PATHNAME,
  titleAbsolute: true,
  keywords: [
    "Babington House weddings",
    "Babington House wedding DJ",
    "Babington House wedding entertainment",
    "Babington House wedding lighting",
    "Babington House wedding guide",
    "Soho House wedding venue",
    "DJ Nige Babington House",
    "Babington House terrace",
    "Babington House Orangery",
  ],
  openGraph: {
    images: [
      {
        url: HERO_IMAGE,
        width: 1200,
        height: 800,
        alt: "Babington House wedding guests on the Croquet Lawn — summer estate celebration",
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
  datePublished: "2026-06-01T18:00:00Z",
  dateModified: "2026-06-01T18:00:00Z",
  author: {
    name: "DJ Nige",
    url: "https://www.stylishentertainment.co.uk/artists/djs/dj-nige/",
    type: "Person",
  },
});

export default function JournalPostBabingtonLearnings() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <BabingtonLearningsBlogWrapper />
    </>
  );
}
