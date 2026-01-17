import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import ThankYouClient from "./ThankYouClient";

export const metadata: Metadata = createMetadata({
  title: "Thank You | STYLISH Entertainment",
  description: "Thank you for contacting STYLISH Entertainment. We'll be in touch soon!",
  pathname: "thank-you",
});

export default function ThankYouPage() {
  return <ThankYouClient />;
}
