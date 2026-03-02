"use client";

import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import {
  TERMS_ABRIDGED,
  getTermsSectionsForDisplay,
  DEPOSIT_CLAUSE,
  COMPANY_NAME,
  COMPANY_ADDRESS,
  COMPANY_SIGNATORIES,
  TERMS_LAST_UPDATED,
  PRIVACY_LINK_PLACEHOLDER,
} from "@/lib/terms-content";

const EXPECTED_NAMES = ["sarah & james", "sarah and james"];

function normalizeName(s: string) {
  return String(s || "").trim().replace(/\s+/g, " ").toLowerCase();
}

export default function TermsPortalFlowDemoPage() {
  const [accepted, setAccepted] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [signName, setSignName] = useState("");
  const [nameError, setNameError] = useState("");
  const [acceptDate, setAcceptDate] = useState("");
  const [acceptTime, setAcceptTime] = useState("");
  const [signedName, setSignedName] = useState("");

  const handleAccept = useCallback(() => {
    setNameError("");
    const enteredNorm = normalizeName(signName);

    if (!checkbox) {
      setNameError("Please tick the checkbox to confirm you have read and accept the terms.");
      return;
    }
    if (!EXPECTED_NAMES.includes(enteredNorm)) {
      setNameError("Name must match booking (Sarah & James or Sarah and James)");
      return;
    }

    setAccepted(true);
    setSignedName(signName.trim());
    const now = new Date();
    setAcceptDate(now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
    setAcceptTime(now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
  }, [checkbox, signName]);

  useEffect(() => {
    document.title = "T&C Portal Flow Demo | Stylish Entertainment";
  }, []);

  const resetDemo = useCallback(() => {
    setAccepted(false);
    setCheckbox(false);
    setSignName("");
    setNameError("");
  }, []);

  const renderSectionBody = (section: { id: string; body: string }) => {
    if (section.id === "data" && section.body.includes(PRIVACY_LINK_PLACEHOLDER)) {
      const [before, after] = section.body.split(PRIVACY_LINK_PLACEHOLDER);
      return (
        <>
          {before.trim()}{" "}
          <Link href="/privacy-policy" className="text-champagne-gold hover:underline">
            Privacy Policy
          </Link>{" "}
          {after?.trim() || ""}
        </>
      );
    }
    return section.body;
  };

  const FullTermsDoc = () => (
    <div className="space-y-4 text-gray-300">
      <h3 className="text-base font-semibold text-champagne-gold">Booking Agreement – Personalised for Sarah & James</h3>
      <p className="text-sm text-gray-400">
        Last updated: {TERMS_LAST_UPDATED.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <div className="mb-4">
        <strong className="text-white">{COMPANY_NAME}</strong>
        <br />
        {COMPANY_ADDRESS}
      </div>
      <div className="mb-4">
        <strong className="text-white">Client</strong>
        <br />
        Sarah & James
        <br />
        sarah@example.com
      </div>
      <p className="mb-4">
        <strong className="text-white">Booking Details</strong>
        <br />
        This agreement is for the provision of <strong>DJ Nige</strong> at <strong>Priston Mill</strong> on{" "}
        <strong>Saturday, 15 June 2025</strong>.
      </p>
      <p className="mb-4">
        <strong>Summary of key terms</strong> <em>(abridged)</em>
        <br />
        <span className="whitespace-pre-line">{TERMS_ABRIDGED}</span>
      </p>
      <p className="mb-4">
        Full terms at{" "}
        <Link href="/terms-and-conditions" className="text-champagne-gold hover:underline">
          stylishentertainment.co.uk/terms-and-conditions
        </Link>
      </p>
      <div className="mb-4 space-y-4">
        {getTermsSectionsForDisplay(true).map((section) => (
          <div key={section.id}>
            <strong>{section.heading}</strong>
            <p className="mt-1">{renderSectionBody(section)}</p>
          </div>
        ))}
      </div>
      <p className="mb-4">
        <strong>{DEPOSIT_CLAUSE.heading}</strong>
        <br />
        {DEPOSIT_CLAUSE.body}
      </p>
      <p className="border-t border-gray-600 pt-4 mt-4">—</p>
      <p>
        <strong>For {COMPANY_NAME}</strong>
        <br />
        {COMPANY_ADDRESS}
        <br />
        Signed: {COMPANY_SIGNATORIES} <em>(pre-signed)</em>
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white mb-2">T&C Portal Flow Demo</h1>
          <p className="text-gray-400 text-sm">Where and how the personalised T&C acceptance appears in the client portal</p>
        </div>

        {/* Try it – Interactive */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-white border-b-2 border-champagne-gold pb-2 mb-4">
            Try it – Interactive demo
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Simulate the flow: tick the checkbox, type <strong>Sarah & James</strong>, then click Accept & Sign.
          </p>
          {accepted && (
            <div className="flex flex-wrap items-center gap-3 p-4 mb-6 rounded-xl bg-champagne-gold/10 border border-champagne-gold/40">
              <strong className="text-champagne-gold">✓ Accepted!</strong>
              <span className="text-gray-300">You can reset to try again.</span>
              <button
                type="button"
                onClick={resetDemo}
                className="px-4 py-2 bg-gray-800 text-champagne-gold border border-champagne-gold rounded-lg text-sm hover:bg-champagne-gold/20"
              >
                Reset demo
              </button>
            </div>
          )}
          <div className="bg-gray-900 rounded-xl border border-champagne-gold/30 overflow-hidden">
            <div className="px-4 py-2 text-xs uppercase tracking-wider bg-champagne-gold/15 text-champagne-gold border-b border-champagne-gold/20">
              Client portal – Contract tab (interactive)
            </div>
            <div className="p-6">
              <div className="flex gap-1 mb-6 pb-3 border-b border-gray-600">
                <span className="px-4 py-2 rounded-lg bg-gray-700 text-gray-400 text-sm">Overview</span>
                <span className={`px-4 py-2 rounded-lg text-sm ${!accepted ? "opacity-60" : ""}`}>Music</span>
                <span className={`px-4 py-2 rounded-lg text-sm ${!accepted ? "opacity-60" : ""}`}>Budget</span>
                <span className="px-4 py-2 rounded-lg bg-champagne-gold/20 text-champagne-gold text-sm">Contract</span>
              </div>
              {!accepted ? (
                <>
                  <div className="bg-gray-950 rounded-lg border border-gray-700 p-6 mb-6 max-h-[420px] overflow-y-auto text-sm leading-relaxed">
                    <FullTermsDoc />
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg">
                    <label className="block mb-4">
                      <input
                        type="checkbox"
                        checked={checkbox}
                        onChange={(e) => setCheckbox(e.target.checked)}
                        className="mr-2"
                      />
                      I have read and accept the Terms & Conditions. I agree that typing my name below constitutes my electronic signature.
                    </label>
                    <label className="block mb-2 text-sm text-gray-400">Type your full name to confirm:</label>
                    <input
                      type="text"
                      value={signName}
                      onChange={(e) => setSignName(e.target.value)}
                      placeholder="Sarah & James"
                      className={`w-full px-3 py-2.5 bg-gray-900 border rounded-lg text-white text-sm mb-2 ${nameError ? "border-red-500" : "border-gray-600"}`}
                    />
                    {nameError && <p className="text-red-400 text-xs mb-2">{nameError}</p>}
                    <button
                      type="button"
                      onClick={handleAccept}
                      className="px-6 py-3 bg-champagne-gold text-black font-semibold rounded-lg text-sm hover:bg-champagne-gold/90"
                    >
                      Accept & Sign
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <div className="p-4 mb-6 rounded-lg bg-green-500/10 border border-green-500/40">
                    <span className="inline-block px-3 py-1 rounded-full bg-green-500/30 text-green-400 text-xs font-semibold mb-2">
                      ✓ Confirmed
                    </span>
                    <p className="text-gray-300 text-sm">
                      Terms accepted on <strong>{acceptDate}</strong> at <strong>{acceptTime}</strong>
                    </p>
                    <p className="text-champagne-gold text-xs font-mono mt-2">Signed as: {signedName}</p>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    A confirmation email has been sent. You can view and print your signed agreement below.
                  </p>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-5 py-2.5 bg-gray-800 text-champagne-gold border border-champagne-gold rounded-lg text-sm hover:bg-champagne-gold/20"
                  >
                    🖨 Print / Download PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Static mockups – Pending with full terms */}
        <div className="mb-12" id="pending">
          <h2 className="text-lg font-semibold text-white border-b-2 border-champagne-gold pb-2 mb-4">
            3. Contract tab – Pending (full terms)
          </h2>
          <div className="bg-gray-900 rounded-xl border border-champagne-gold/30 overflow-hidden">
            <div className="px-4 py-2 text-xs uppercase tracking-wider bg-champagne-gold/15 text-champagne-gold border-b border-champagne-gold/20">
              Client portal – Contract tab (pending) – Full terms from lib/terms-content.ts
            </div>
            <div className="p-6">
              <div className="flex gap-1 mb-6 pb-3 border-b border-gray-600">
                <span className="px-4 py-2 rounded-lg bg-gray-700 text-gray-400 text-sm">Overview</span>
                <span className="px-4 py-2 rounded-lg text-sm opacity-60">Music</span>
                <span className="px-4 py-2 rounded-lg text-sm opacity-60">Budget</span>
                <span className="px-4 py-2 rounded-lg bg-champagne-gold/20 text-champagne-gold text-sm">Contract</span>
              </div>
              <div className="bg-gray-950 rounded-lg border border-gray-700 p-6 max-h-96 overflow-y-auto text-sm leading-relaxed">
                <FullTermsDoc />
              </div>
              <div className="mt-4 p-4 bg-black/30 rounded-lg">
                <label className="block mb-2 text-sm text-gray-400">
                  <input type="checkbox" disabled className="mr-2" /> I have read and accept…
                </label>
                <input
                  type="text"
                  placeholder="Sarah & James"
                  disabled
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-gray-500 text-sm mb-2"
                />
                <button
                  type="button"
                  disabled
                  className="px-6 py-3 bg-gray-700 text-gray-500 rounded-lg text-sm cursor-not-allowed"
                >
                  Accept & Sign
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-gray-500 text-xs">
          Stylish Entertainment Ltd · T&C Portal Module Flow Demo · Terms from lib/terms-content.ts (single source)
        </p>
      </div>
    </div>
  );
}
