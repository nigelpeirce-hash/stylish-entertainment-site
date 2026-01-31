import { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "UK-wide Wedding Services | Lighting Design & Venue Styling",
  description: "Professional wedding lighting design and venue styling services across the UK. Transform your wedding venue with our expert team.",
  alternates: {
    canonical: "https://stylishentertainment.co.uk/services",
  },
};

export default function Services() {
  return <ServicesClient />;
}
