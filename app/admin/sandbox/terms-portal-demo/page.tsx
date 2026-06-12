"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";

/**
 * T&C Portal Flow Demo
 *
 * Links to the terms-portal-flow-demo (opens in new tab).
 * X-Frame-Options: DENY prevents embedding; opening in new tab works.
 *
 * Access: Admin → Sandbox → Terms portal demo
 * URL: /admin/sandbox/terms-portal-demo
 */
export default function TermsPortalDemoPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login/");
      return;
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-champagne-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-xl">
        <Link
          href="/admin/"
          className="inline-flex items-center gap-2 text-champagne-gold hover:underline text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to admin
        </Link>
        <div className="bg-gray-800/50 border border-champagne-gold/30 rounded-xl p-8">
          <h1 className="text-2xl font-bold text-white mb-2">T&C Portal Flow Demo</h1>
          <p className="text-gray-400 mb-6">
            Visual demo of where and how the personalised T&C acceptance appears in the client portal.
          </p>
          <a
            href="/terms-portal-flow-demo/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-champagne-gold text-black font-semibold rounded-lg hover:bg-champagne-gold/90 transition-colors"
          >
            Open demo <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
