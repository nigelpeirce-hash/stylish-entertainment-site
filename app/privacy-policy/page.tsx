import { Metadata } from "next";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

const baseUrl = "https://www.stylishentertainment.co.uk";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How STYLISH Entertainment collects, uses and protects your data. GDPR and UK data protection. We never sell your details.",
  alternates: { canonical: `${baseUrl}/privacy-policy/` },
  openGraph: {
    title: "Privacy Policy",
    description:
      "How STYLISH Entertainment collects, uses and protects your data. GDPR and UK data protection. We never sell your details.",
    type: "website",
    url: `${baseUrl}/privacy-policy/`,
  },
};

export default function PrivacyPolicy() {
  return <PrivacyPolicyClient />;
}
