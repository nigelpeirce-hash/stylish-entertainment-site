import { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "West Country Wedding Services | Lighting Design & Venue Styling",
  description: "Professional wedding lighting design and venue styling services across the UK and Wales. Transform your wedding venue with our expert team.",
  alternates: {
    canonical: "https://stylishentertainment.co.uk/services",
  },
};

export default function Services() {
  return <ServicesClient />;
}
