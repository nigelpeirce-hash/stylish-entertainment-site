import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import ThankYouClient from "./ThankYouClient";

export const metadata: Metadata = createMetadata({
  title: "Thank You",
  description: "Thank you for getting in touch. We'll respond within 24-48 hours.",
  pathname: "thank-you",
});

export default function ThankYouPage() {
  return <ThankYouClient />;
}
