import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Artists",
  description:
    "DJs and musicians for weddings and events. UK-wide entertainment from STYLISH Entertainment.",
  pathname: "artists",
});

export default function ArtistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
