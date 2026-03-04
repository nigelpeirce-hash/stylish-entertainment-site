import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Lighting",
  description:
    "Wedding and event lighting design. Ambient, feature and dance floor lighting.",
  pathname: "what-we-do/lighting",
});

export default function LightingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
