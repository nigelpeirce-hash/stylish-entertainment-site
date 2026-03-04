import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Request a Quote",
  description:
    "Request a quote for wedding or event entertainment. Tell us your date and venue.",
  path: "new-inquiry",
  noindex: true,
});

export default function NewInquiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
