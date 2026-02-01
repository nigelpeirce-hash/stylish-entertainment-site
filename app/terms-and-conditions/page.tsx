"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { FileText } from "lucide-react";
import {
  TERMS_SECTIONS,
  TERMS_LAST_UPDATED,
  PRIVACY_LINK_PLACEHOLDER,
} from "@/lib/terms-content";

export default function TermsAndConditionsPage() {
  useEffect(() => {
    document.title = "Terms and Conditions | Stylish Entertainment";
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <FileText className="w-8 h-8 text-champagne-gold" />
                Terms and Conditions
              </CardTitle>
              <p className="text-gray-400 mt-2">
                Last updated:{" "}
                {TERMS_LAST_UPDATED.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-invert max-w-none">
                {TERMS_SECTIONS.map((section) => (
                  <div key={section.id}>
                    <h2 className="text-2xl font-bold text-champagne-gold mt-6 mb-4">
                      {section.heading}
                    </h2>
                    {section.id === "data" &&
                    section.body.includes(PRIVACY_LINK_PLACEHOLDER) ? (
                      <p className="text-gray-300 leading-relaxed">
                        {section.body
                          .split(PRIVACY_LINK_PLACEHOLDER)[0]
                          .trim()}{" "}
                        <Link
                          href="/privacy-policy"
                          className="text-champagne-gold hover:text-gold-light underline"
                        >
                          Privacy Policy
                        </Link>{" "}
                        for more details.
                      </p>
                    ) : (
                      <p className="text-gray-300 leading-relaxed">
                        {section.body}
                      </p>
                    )}
                  </div>
                ))}

                <div className="mt-8 p-4 bg-champagne-gold/10 border border-champagne-gold/30 rounded-lg">
                  <p className="text-gray-300">
                    <strong className="text-champagne-gold">Questions?</strong>{" "}
                    Please contact us at{" "}
                    <a
                      href="tel:+447970793177"
                      className="text-champagne-gold hover:text-gold-light underline"
                    >
                      07970793177
                    </a>{" "}
                    or{" "}
                    <Link
                      href="/contact-us"
                      className="text-champagne-gold hover:text-gold-light underline"
                    >
                      use our contact form
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
