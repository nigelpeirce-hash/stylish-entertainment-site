import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Equipment & Sound",
  description:
    "DJ and band sound equipment, PA and technical kit for events.",
  pathname: "what-we-do/equipment-dj-band-sound-kit",
});

export default function EquipmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
