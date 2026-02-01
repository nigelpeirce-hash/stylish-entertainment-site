"use client";

import PortalDemoModal from "@/components/PortalDemoModal";

/**
 * Standalone portal demo page for iframe embedding.
 * Renders the refactored portal with warm, human copy — no modal chrome.
 */
export default function DemoClientPortalPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <PortalDemoModal embedded />
    </div>
  );
}
