import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Lighting Design",
  description:
    "Bespoke lighting design for weddings and events. Create the right atmosphere.",
  pathname: "services/lighting-design",
});

export default function LightingDesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
