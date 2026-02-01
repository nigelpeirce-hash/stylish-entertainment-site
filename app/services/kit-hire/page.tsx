import { Metadata } from "next";
import KitHireClient from "./KitHireClient";

export const metadata: Metadata = {
  title: "Professional Equipment & Technical Hire | Kit Hire | Wedding Equipment Hire",
  description: "Industry-standard sound, lighting and styling props for UK events. Professional equipment hire for weddings including PA systems, lighting rigs, DJ equipment and technical accessories. PAT tested and fully insured.",
  keywords: [
    "Professional Equipment Hire",
    "Technical Hire",
    "Kit Hire",
    "Wedding Equipment Hire",
    "Sound System Hire",
    "Lighting Equipment Hire",
    "DJ Equipment Hire",
    "PA System Hire",
    "Wireless Microphone Hire",
    "Event Equipment Hire",
    "PAT Tested Equipment",
    "Equipment Hire South West",
  ],
};

export default function KitHireService() {
  return <KitHireClient />;
}
