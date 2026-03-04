import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Parties & Corporate Events",
  description:
    "Party lighting, private parties and corporate event entertainment. Professional DJs and production across the UK.",
  pathname: "parties",
});

export default function PartiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
