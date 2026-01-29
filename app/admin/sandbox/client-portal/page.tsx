"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";

export default function SandboxClientPortalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookingId, setBookingId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
  }, [status, router]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLink(null);
    setClientName(null);
    if (!bookingId.trim()) {
      setError("Enter a booking ID.");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/sandbox/client-portal/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: bookingId.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to generate link.");
        return;
      }
      setLink(data.link ?? null);
      setClientName(data.clientName ?? null);
    } catch {
      setError("Something went wrong.");
    } finally {
      setGenerating(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-champagne-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="container mx-auto max-w-xl">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-champagne-gold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to admin
          </Link>
        </div>

        <Card className="bg-gray-800 border-champagne-gold/30">
          <CardHeader>
            <CardTitle className="text-xl">Client portal sandbox</CardTitle>
            <CardDescription className="text-gray-400">
              Generate a magic-link to open the client portal as the client (no login). Use a real booking ID.
              Open in an incognito window to test the full flow: music details, final details, guest requests, and communication history.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bookingId">Booking ID *</Label>
                <Input
                  id="bookingId"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder="e.g. e983ae0d-b2dd-4eec-b15c-00795a621357"
                  className="bg-gray-900 border-gray-700 text-white font-mono text-sm placeholder:text-gray-500"
                />
              </div>
              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
              <Button
                type="submit"
                disabled={generating}
                className="bg-champagne-gold text-black hover:bg-champagne-gold/90"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating…
                  </>
                ) : (
                  "Generate portal link"
                )}
              </Button>
            </form>

            {link && (
              <div className="mt-6 p-4 rounded-lg bg-gray-900 border border-gray-700 space-y-3">
                <p className="text-sm font-medium text-champagne-gold">Client portal link</p>
                {clientName && (
                  <p className="text-sm text-gray-400">Booking: {clientName}</p>
                )}
                <p className="text-xs text-gray-400 break-all font-mono">{link}</p>
                <Button asChild size="sm" className="bg-champagne-gold text-black hover:bg-champagne-gold/90">
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in new tab
                  </a>
                </Button>
                <p className="text-xs text-gray-500">
                  Use incognito to test as the client. Music details flow into the DJ worksheet and Artist Worksheet. The portal now shows a Communication history section with all emails for this booking.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
