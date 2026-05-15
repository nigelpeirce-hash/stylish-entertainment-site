import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Room Transformation | Before & After Venue Styling",
  description:
    "See the dramatic before-and-after of a venue transformed by Stylish Entertainment. Professional styling, lighting and decorations for weddings and events in the South West.",
  path: "room-transformation",
  keywords: [
    "Room Transformation",
    "Before and After Venue",
    "Wedding Venue Styling",
    "Venue Decoration South West",
    "Event Styling Somerset",
  ],
});

export default function RoomTransformationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
