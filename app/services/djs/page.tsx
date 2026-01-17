import { Metadata } from "next";
import DJsServiceClient from "./DJsServiceClient";

export const metadata: Metadata = {
  title: "DJ Services | Professional Wedding DJs | Stylish Entertainment",
  description: "Professional DJ services for weddings across the West Country. Premium sound systems, wireless microphones, and seamless mixing for your special day.",
  alternates: {
    canonical: "https://stylishentertainment.co.uk/services/djs",
  },
};

export default function DJsService() {
  return <DJsServiceClient />;
}
