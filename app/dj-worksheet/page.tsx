import type { Metadata } from "next";
import DjWorksheetClient from "./DjWorksheetClient";

export const metadata: Metadata = {
  title: "DJ Worksheet | STYLISH Entertainment",
  description:
    "Final DJ worksheet: venue, timings, music, payment and useful information. Save a draft, print, or submit to STYLISH Entertainment.",
  robots: { index: false, follow: false },
};

export default function DJWorksheetPage() {
  return <DjWorksheetClient />;
}
