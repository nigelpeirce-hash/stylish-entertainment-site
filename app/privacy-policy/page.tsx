import { Metadata } from "next";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | Stylish Entertainment",
  description: "Privacy Policy for Stylish Entertainment. Learn how we collect, use, and protect your personal data in accordance with GDPR and UK data protection laws. We never sell your details to third parties.",
};

export default function PrivacyPolicy() {
  return <PrivacyPolicyClient />;
}
