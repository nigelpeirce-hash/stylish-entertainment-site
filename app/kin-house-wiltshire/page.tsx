import { Metadata } from "next";
import KinHouseClient from "./KinHouseClient";

export const metadata: Metadata = {
  title: "Kin House, Wiltshire | Wedding Lighting & Production | Stylish Entertainment",
  description: "Professional wedding lighting and production services for Kin House, Wiltshire. Mirrorball packages, stage supply, party lighting, and creative lighting solutions. Contact STYLISH Entertainment.",
};

export default function KinHouseWiltshire() {
  return <KinHouseClient />;
}
