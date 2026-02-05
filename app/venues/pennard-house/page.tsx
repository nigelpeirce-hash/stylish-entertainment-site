import { Metadata } from "next";
import PennardHouseClient from "@/app/pennard-house-lighting/PennardHouseClient";

export const metadata: Metadata = {
  title: "Pennard House Lighting | Wedding Lighting Design",
  description: "Professional wedding lighting design for Pennard House weddings. Stunning lighting installations inside and outside the Coach House. 3-day hire, early installation, and local expertise. Contact STYLISH Entertainment for your Pennard House wedding.",
  alternates: {
    canonical: "https://www.stylishentertainment.co.uk/venues/pennard-house/",
  },
};

export default function PennardHousePage() {
  return <PennardHouseClient />;
}
