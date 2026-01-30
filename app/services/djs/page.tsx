import { Metadata } from "next";
import DJsServiceClient from "./DJsServiceClient";

export const metadata: Metadata = {
  title: "DJ Services | Professional DJs for Weddings, Parties & Events",
  description: "Professional DJ services for weddings, parties and events across the UK and Wales. Premium sound systems, wireless microphones and seamless mixing for every celebration.",
  alternates: {
    canonical: "https://stylishentertainment.co.uk/services/djs",
  },
};

export default function DJsService() {
  return <DJsServiceClient />;
}
