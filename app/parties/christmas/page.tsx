import { Metadata } from "next";
import ChristmasClient from "./ChristmasClient";

export const metadata: Metadata = {
  title: "Winter Celebrations & Christmas Galas | Luxury Corporate Christmas Party Production",
  description: "High-end luxury entertainment for unforgettable seasonal celebrations. Corporate Christmas party production, luxury winter ball entertainment, DJs, lighting, and full event planning in the South West and beyond.",
  keywords: [
    "Corporate Christmas Party Production",
    "Luxury Winter Ball Entertainment",
    "Christmas Party Planning",
    "Winter Celebration Entertainment",
    "Corporate Christmas Events",
    "Luxury Christmas Galas",
    "Winter Ball Production",
    "Christmas Party DJs",
    "Festive Entertainment",
    "Christmas Lighting Design",
    "Party Planning Somerset",
    "Event Production South West",
  ],
};

export default function ChristmasParties() {
  return <ChristmasClient />;
}
