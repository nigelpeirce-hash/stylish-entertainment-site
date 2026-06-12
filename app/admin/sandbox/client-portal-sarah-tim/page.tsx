"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

/**
 * Client Portal Demo – Sarah & Tim
 *
 * Opens the static HTML demo (client-portal-demo.html) in a new tab.
 * Shows how the client portal looks for Sarah & Tim with sample booking data.
 *
 * Access: Admin → Sandbox → Client portal (Sarah & Tim)
 * URL: /admin/sandbox/client-portal-sarah-tim
 */
export default function ClientPortalSarahTimPage() {
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
        <div className="animate-spin w-8 h-8 border-2 border-champagne-gold border-t-transparent rounded-full" />
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
        <div className="bg-gray-800/50 border border-champagne-gold/30 rounded-xl p-8 space-y-6">
          <h1 className="text-2xl font-bold text-white mb-2">Client Portal Demo – Sarah & Tim</h1>
          <p className="text-gray-400">
            Visual demo of the client portal as it would appear for Sarah & Tim. Includes welcome header, quick actions (New Booking, Profile, Messages), and a sample wedding booking at Priston Mill with tabs: Overview, Music, Budget, Contract.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/client-portal-demo.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-champagne-gold text-black font-semibold rounded-lg hover:bg-champagne-gold/90 transition-colors"
            >
              Open static demo <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              href="/admin/sandbox/client-portal-hero-demo/"
              className="inline-flex items-center gap-2 px-6 py-3 border border-champagne-gold/50 text-champagne-gold font-semibold rounded-lg hover:bg-champagne-gold/10 transition-colors"
            >
              Hero photo demo <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
