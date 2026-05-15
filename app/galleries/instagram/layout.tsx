import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Instagram Feed | Latest Events, Lighting & Behind-the-Scenes",
  description:
    "Follow our latest work on Instagram: event highlights, behind-the-scenes photos and stunning venue transformations from Stylish Entertainment.",
  path: "galleries/instagram",
  keywords: [
    "Stylish Entertainment Instagram",
    "Wedding Lighting Instagram",
    "Event Styling Behind the Scenes",
  ],
});

export default function InstagramGalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
