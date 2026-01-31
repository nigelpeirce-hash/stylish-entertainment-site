"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, RefreshCw } from "lucide-react";
import Footer from "@/components/Footer";
import FooterRefactored from "@/components/FooterRefactored";

/**
 * Footer Sandbox Demo
 *
 * Test the refactored footer (shorter copy, postal address moved to bottom bar)
 * in context before applying to the live site.
 *
 * Access: Admin → Sandbox → Footer demo
 * URL: /admin/sandbox/footer-demo
 */
export default function FooterDemoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<"original" | "refactored">("refactored");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-champagne-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin bar - fixed at top */}
      <div className="sticky top-0 z-50 bg-gray-900 text-white py-2 px-4 border-b border-champagne-gold/30">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-champagne-gold hover:underline text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to admin
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Compare:</span>
            <button
              onClick={() => setVariant("original")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                variant === "original" ? "bg-champagne-gold text-black" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Original
            </button>
            <button
              onClick={() => setVariant("refactored")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                variant === "refactored" ? "bg-champagne-gold text-black" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Refactored
            </button>
          </div>
        </div>
      </div>

      {/* Simulated page content - mimics client-facing layout */}
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Footer Demo – Client-facing context
          </h1>
          <p className="text-gray-600 mb-6">
            This page simulates how the footer appears on a typical client-facing page. Use the toggle above to compare <strong>Original</strong> (current) vs <strong>Refactored</strong> (shorter copy, postal address moved to bottom bar).
          </p>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Sample page content</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Professional DJs, musicians, lighting and venue styling. Every gathering deserves to be extraordinary.
            </p>
          </div>
        </div>
      </main>

      {/* Footer - switches based on variant */}
      {variant === "original" ? <Footer /> : <FooterRefactored />}
    </div>
  );
}
