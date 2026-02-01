import { Metadata } from "next";
import ContactUsClient from "./ContactUsClient";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Contact Us | Wedding & Event Entertainment",
  description: "Get in touch to discuss your wedding entertainment. DJs and musicians UK-wide; lighting design and venue styling in the South West and beyond.",
  pathname: "contact-us",
});

export default function ContactUs() {
  return <ContactUsClient />;
}
