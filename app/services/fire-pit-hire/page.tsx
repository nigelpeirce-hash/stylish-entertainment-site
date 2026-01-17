import { Metadata } from "next";
import FirePitClient from "./FirePitClient";

export const metadata: Metadata = {
  title: "Fire Pit Hire | Wedding Fire Pit Hire Somerset | Outdoor Party Heating West Country | Stylish Entertainment",
  description: "Outdoor fire pit hire for wedding venues across the West Country. Wedding Fire Pit Hire Somerset. Create a warm, inviting atmosphere with our professional fire pit installations. Perfect for outdoor receptions and chilly Somerset nights.",
  keywords: [
    "Wedding Fire Pit Hire Somerset",
    "Outdoor Party Heating West Country",
    "Fire Pit Hire",
    "Wedding Fire Pits",
    "Outdoor Fire Pit Hire",
    "Somerset Fire Pit Hire",
    "Wedding Reception Heating",
    "Outdoor Wedding Heating",
    "Fire Pit Rental",
    "Party Fire Pits",
    "West Country Fire Pit Hire",
  ],
};

export default function FirePitHireService() {
  return <FirePitClient />;
}
