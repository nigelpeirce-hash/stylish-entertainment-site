import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Musicians",
  description:
    "Live musicians for weddings and events. Soloists and bands UK-wide.",
  pathname: "artists/musicians",
});

export default function MusiciansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
