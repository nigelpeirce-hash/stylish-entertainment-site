import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: "Wedding DJs UK | Babington House Resident",
    description:
      "Boutique wedding DJs across Somerset, the South West, London and the Home Counties. Founder DJ Nige has been the resident DJ at Babington House since 2003.",
    path: "artists/djs",
    keywords: [
      "wedding DJs UK",
      "wedding DJ Somerset",
      "wedding DJ South West",
      "wedding DJ London",
      "Babington House DJ",
      "boutique wedding DJ",
      "luxury wedding DJ",
      "event DJ UK",
      "corporate DJ",
      "private party DJ",
      "live DJ acts",
    ],
  });
}

export default function DJsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
