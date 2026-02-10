import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: "Professional Event & Wedding DJs",
    description:
      "Meet our world-class DJ roster. Professional wedding and event DJs with state-of-the-art equipment, seamless mixing and an unparalleled ability to read the room. Trusted by Babington House and premium venues across the UK.",
    pathname: "artists/djs",
    keywords: [
      "Wedding DJs",
      "Professional DJs UK",
      "Event DJs",
      "Babington House DJ",
      "Wedding Entertainment",
      "Party DJs",
      "Corporate DJs",
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
