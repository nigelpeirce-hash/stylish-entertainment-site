import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Terms and Conditions",
  description:
    "Terms and conditions for STYLISH Entertainment services and bookings.",
  pathname: "terms-and-conditions",
});

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
