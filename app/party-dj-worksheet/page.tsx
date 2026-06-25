import type { Metadata } from "next";
import PartyDjWorksheetClient from "./PartyDjWorksheetClient";

export const metadata: Metadata = {
  title: "Party & Event DJ Worksheet | STYLISH Entertainment",
  description:
    "Party and event DJ worksheet: timings, music, payment and venue details. Save a draft, print, or submit to STYLISH Entertainment.",
  robots: { index: false, follow: false },
};

export default function PartyDJWorksheetPage() {
  return <PartyDjWorksheetClient />;
}
