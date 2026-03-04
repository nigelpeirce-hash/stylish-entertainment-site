import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Galleries",
  description:
    "Photo and video galleries: wedding lighting, party production and event styling.",
  pathname: "galleries",
});

export default function GalleriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
