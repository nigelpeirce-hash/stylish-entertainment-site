import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import BlogClient from "./BlogClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description:
    "Wedding and event entertainment tips, venue styling ideas and DJ insights from STYLISH Entertainment.",
  pathname: "about/blog",
});

export default function BlogPage() {
  return <BlogClient />;
}
