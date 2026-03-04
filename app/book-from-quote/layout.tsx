import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Book from Quote",
  description:
    "Complete your booking from your quote. Confirm details and pay deposit.",
  path: "book-from-quote",
  noindex: true,
});

export default function BookFromQuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
