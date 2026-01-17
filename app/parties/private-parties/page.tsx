import { Metadata } from "next";
import PrivatePartiesClient from "./PrivatePartiesClient";

export const metadata: Metadata = {
  title: "Private Parties | Bespoke Party Planning & Technical Production | Stylish Entertainment",
  description: "Full party planning and production services. Creative DJs, bands, entertainment, and beautiful lighting for private parties across Somerset, Wiltshire, Dorset, BANES, Mendip, and Bristol. Trusted by Babington House for 20+ years.",
};

export default function PrivateParties() {
  return <PrivatePartiesClient />;
}
