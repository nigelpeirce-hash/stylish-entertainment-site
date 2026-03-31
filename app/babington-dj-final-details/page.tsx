import { Metadata } from "next";
import BabingtonDjFinalDetailsForm from "./BabingtonDjFinalDetailsForm";

export const metadata: Metadata = {
  title: "Babington — DJ final details",
  description:
    "Submit your Babington House wedding timings and music details to STYLISH Entertainment — ceremony time, first dance, last song, and music requests.",
  robots: { index: false, follow: false },
};

export default function BabingtonDjFinalDetailsPage() {
  return <BabingtonDjFinalDetailsForm />;
}
