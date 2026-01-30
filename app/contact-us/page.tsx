import { Metadata } from "next";
import ContactUsClient from "./ContactUsClient";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Contact Us | West Country Wedding Entertainment Booking",
  description: "Get in touch to discuss your wedding entertainment requirements. Professional DJs, lighting design and venue styling across the UK and Wales.",
  pathname: "contact-us",
});

export default function ContactUs() {
  return <ContactUsClient />;
}
