import { Metadata } from "next";
import ContactUsClient from "./ContactUsClient";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Contact Us | West Country Wedding Entertainment Booking | STYLISH Entertainment",
  description: "Get in touch to discuss your wedding entertainment requirements. Professional DJs, lighting design, and venue styling across the West Country including London, Somerset, Bath, Bristol, Dorset, and Devon.",
  pathname: "contact-us",
});

export default function ContactUs() {
  return <ContactUsClient />;
}
