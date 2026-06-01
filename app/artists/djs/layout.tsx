import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: "DJs Who Read The Room | Wedding, Party & Corporate DJs",
    titleAbsolute: true,
    description:
      "Luxury wedding DJs and party DJs who read the room — non-cheesy wedding DJs for weddings, private parties and corporate events. Trusted at Babington House since 2003.",
    path: "artists/djs",
    keywords: [
      "luxury wedding DJs",
      "non-cheesy wedding DJs",
      "wedding DJs who read the room",
      "party DJs",
      "corporate DJs",
      "wedding DJs",
      "private party DJ",
      "Babington House DJ",
      "wedding DJ South West",
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
