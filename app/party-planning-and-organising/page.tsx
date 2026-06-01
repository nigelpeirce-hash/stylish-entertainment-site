import { Metadata } from "next";
import PartyPlanningClient from "./PartyPlanningClient";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Private Event Production | Party Planning Somerset & UK",
  description:
    "Creative direction, DJs, lighting, styling and production for milestone birthdays, marquee parties and estate celebrations. Private event production and luxury party planning across Somerset, Bath, Bristol, London and UK-wide. 20+ years at Babington House.",
  pathname: "party-planning-and-organising",
});

export default function PartyPlanning() {
  return <PartyPlanningClient />;
}
