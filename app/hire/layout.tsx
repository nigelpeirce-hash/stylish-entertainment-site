import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Hire",
  description:
    "Hire DJ equipment, lighting and event kit from STYLISH Entertainment. Browse items and add to basket.",
  pathname: "hire",
});

export default function HireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
