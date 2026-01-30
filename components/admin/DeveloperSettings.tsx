"use client";

import React, { useState } from "react";

/**
 * DeveloperSettings – collapsible "engine room". Keeps dev tools and Auth Bypassed warning
 * out of sight unless explicitly toggled. Subtle when hidden; expands to show notice + grid.
 */

export interface DeveloperSettingsProps {
  children: React.ReactNode;
  /** When true, show "Auth Bypassed" warning at top of expanded content */
  authBypassed?: boolean;
}

export function DeveloperSettings({ children, authBypassed }: DeveloperSettingsProps) {
  const [showDev, setShowDev] = useState(false);

  return (
    <div
      className="mt-20 pt-5 border-t-2 border-dashed border-gray-600 transition-opacity duration-200"
      style={{ opacity: showDev ? 1 : 0.3 }}
    >
      <button
        type="button"
        onClick={() => setShowDev(!showDev)}
        className="text-[10px] text-gray-500 bg-transparent border-none cursor-pointer hover:text-gray-400 font-medium uppercase tracking-wider"
      >
        {showDev ? "▼ Hide Developer Tools" : "▶ Show Developer Tools"}
      </button>

      {showDev && (
        <>
          {authBypassed && (
            <p className="mt-4 mb-3 text-xs text-yellow-400/90 font-medium">
              Auth Bypassed (development)
            </p>
          )}
          <div className={authBypassed ? "mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
            {children}
          </div>
        </>
      )}
    </div>
  );
}
