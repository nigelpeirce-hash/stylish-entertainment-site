import { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "West Country Wedding Services | Lighting Design & Venue Styling | Stylish Entertainment",
  description: "Professional wedding lighting design and venue styling services across the West Country including London, Somerset, Bath, Bristol, Dorset, and Devon. Transform your wedding venue with our expert team.",
  alternates: {
    canonical: "https://stylishentertainment.co.uk/services",
  },
};

export default function Services() {
  return <ServicesClient />;
}
