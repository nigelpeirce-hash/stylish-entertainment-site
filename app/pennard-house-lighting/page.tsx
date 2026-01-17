import { Metadata } from "next";
import PennardHouseClient from "./PennardHouseClient";

export const metadata: Metadata = {
  title: "Pennard House Lighting | Wedding Lighting Design | Stylish Entertainment",
  description: "Professional wedding lighting design for Pennard House weddings. Stunning lighting installations inside and outside the Coach House. 3-day hire, early installation, and local expertise. Contact STYLISH Entertainment for your Pennard House wedding.",
};

export default function PennardHouseLighting() {
  return <PennardHouseClient />;
}
