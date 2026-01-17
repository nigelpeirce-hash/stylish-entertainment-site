import { Metadata } from "next";
import PartyPlanningClient from "./PartyPlanningClient";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Professional Party Planning & Event Organization | Bespoke Celebrations in Somerset, Wiltshire & West Country | STYLISH Entertainment",
  description: "Complete party planning and event organization services. From intimate celebrations to grand events, we handle every detail including entertainment, lighting, styling, and coordination across the West Country. 20+ years of experience.",
  pathname: "party-planning-and-organising",
});

export default function PartyPlanning() {
  return <PartyPlanningClient />;
}
