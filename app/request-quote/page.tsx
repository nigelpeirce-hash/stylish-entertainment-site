import { createMetadata } from "@/lib/metadata";
import RequestQuoteClient from "./RequestQuoteClient";

export const metadata = createMetadata({
  title: "Request a Quote | Wedding & Event Entertainment",
  description: "Get a custom quote for lighting, DJ & kit, production, or hire. DJs and musicians UK-wide; lighting and styling in the South West and beyond. No payment now.",
  pathname: "request-quote",
});

export default function RequestQuotePage() {
  return <RequestQuoteClient />;
}
