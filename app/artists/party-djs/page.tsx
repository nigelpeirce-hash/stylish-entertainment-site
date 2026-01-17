import { Metadata } from "next";
import PartyDJsClient from "./PartyDJsClient";

export const metadata: Metadata = {
  title: "Party DJs | Professional Wedding DJs | Stylish Entertainment",
  description: "Professional DJ services for weddings across the West Country. Premium sound systems, wireless microphones, and seamless mixing for your special day.",
};

export default function PartyDJs() {
  return <PartyDJsClient />;
}
