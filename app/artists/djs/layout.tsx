import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: "DJs & Live DJ Acts UK-Wide | Stylish Entertainment",
    description:
      "Boutique wedding DJs and live DJ acts for weddings, private parties and corporate events across the UK. South West, Cotswolds and nationwide.",
    pathname: "artists/djs",
    keywords: [
      "Wedding DJs",
      "Event DJs UK",
      "Party DJs",
      "Corporate DJs",
      "Wedding Entertainment",
      "Live DJ acts",
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
