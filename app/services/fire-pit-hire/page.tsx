import { Metadata } from "next";
import FirePitClient from "./FirePitClient";

export const metadata: Metadata = {
  title: "Fire Pit Hire | Wedding Fire Pit Hire Somerset | Outdoor Party Heating",
  description: "Outdoor fire pit hire for wedding venues in the South West and beyond. Wedding Fire Pit Hire Somerset. Create a warm, inviting atmosphere with our professional fire pit installations. Perfect for outdoor receptions and chilly Somerset nights.",
  keywords: [
    "Wedding Fire Pit Hire Somerset",
    "Outdoor Party Heating",
    "Fire Pit Hire",
    "Wedding Fire Pits",
    "Outdoor Fire Pit Hire",
    "Somerset Fire Pit Hire",
    "Wedding Reception Heating",
    "Outdoor Wedding Heating",
    "Fire Pit Rental",
    "Party Fire Pits",
    "Fire Pit Hire South West",
  ],
};

export default function FirePitHireService() {
  return <FirePitClient />;
}
