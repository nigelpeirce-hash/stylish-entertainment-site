import { Metadata } from "next";
import NorthCadburyCourtClient from "./NorthCadburyCourtClient";

export const metadata: Metadata = {
  title: "North Cadbury Court | Wedding Entertainment & Lighting",
  description: "Professional wedding entertainment, lighting design, and DJ services for weddings at North Cadbury Court. Trusted suppliers for elegant celebrations in Somerset.",
  alternates: {
    canonical: "https://stylishentertainment.co.uk/venues/north-cadbury-court",
  },
};

export default function NorthCadburyCourtPage() {
  return <NorthCadburyCourtClient />;
}
