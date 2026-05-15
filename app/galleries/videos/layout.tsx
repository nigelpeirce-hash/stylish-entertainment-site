import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Video Gallery | Wedding Lighting & Event Production Showreels",
  description:
    "Watch our YouTube showreels: wedding lighting, dance-floor production, venue transformations and live DJ sets from Stylish Entertainment events across the UK.",
  path: "galleries/videos",
  keywords: [
    "Wedding Video Showreel",
    "Event Production Videos",
    "Wedding Lighting Video",
    "DJ Showreel UK",
  ],
});

export default function VideosGalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
