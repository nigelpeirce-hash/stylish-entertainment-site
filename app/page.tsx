import { createMetadata } from "@/lib/metadata";
import HomeClient from "./HomeClient";

export const metadata = createMetadata({
  title: "Stylish Entertainment & Production | Professional DJs, Lighting Design & Venue Styling",
  description: "Exceptional entertainment for weddings, parties and events. Professional DJs and musicians UK-wide; lighting design and venue styling in the South West and beyond. Strictly no YMCA.",
  pathname: "",
});

export default function HomePage() {
  return <HomeClient />;
}
