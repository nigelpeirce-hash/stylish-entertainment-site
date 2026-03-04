import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Venue Decoration",
  description:
    "Venue decoration and styling for weddings and private events.",
  pathname: "what-we-do/venue-decoration",
});

export default function VenueDecorationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
