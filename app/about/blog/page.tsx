import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { BLOG_POSTS } from "@/data/blog";
import BlogClient from "./BlogClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Ideas & Inspiration",
  description:
    "Real events, venue guides, wedding entertainment and lighting advice from more than twenty years of weddings, private parties and corporate celebrations.",
  pathname: "about/blog",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.stylishentertainment.co.uk";

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Stylish Entertainment — Ideas & Inspiration",
  description:
    "Wedding entertainment, wedding lighting, venue guides, party planning and real event case studies from STYLISH Entertainment.",
  url: `${baseUrl}/about/blog/`,
  publisher: {
    "@type": "Organization",
    name: "STYLISH Entertainment",
    url: baseUrl,
  },
  blogPost: BLOG_POSTS.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    url: `${baseUrl}/about/blog/${post.slug}/`,
    description: post.excerpt,
  })),
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <BlogClient />
    </>
  );
}
