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

interface StaffOption {
  id: string;
  name: string;
}

export default function SandboxBookFromQuotePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookingId, setBookingId] = useState("");
  const [artistType, setArtistType] = useState<"dj" | "musician">("dj");
  const [staffId, setStaffId] = useState("");
  const [fee, setFee] = useState("");
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
  }, [status, router]);

  useEffect(() => {
    setStaffId("");
    setStaffOptions([]);
    if (!artistType) return;
    setLoadingStaff(true);
    const endpoint = artistType === "dj" ? "/api/admin/djs/" : "/api/admin/musicians/";
    fetch(endpoint)
      .then((r) => r.json())
      .then((data) => {
        const list = artistType === "dj" ? data.djs : data.musicians;
        setStaffOptions(Array.isArray(list) ? list.map((s: { id: string; name: string }) => ({ id: s.id, name: s.name })) : []);
      })
      .catch(() => setStaffOptions([]))
      .finally(() => setLoadingStaff(false));
  }, [artistType]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLink(null);
    if (!bookingId.trim()) {
      setError("Enter a booking ID.");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/sandbox/book-from-quote/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingId.trim(),
          artistType,
          staffId: staffId || undefined,
          fee: fee.trim() ? parseFloat(fee) : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to generate token.");
        return;
      }
      setLink(data.link ?? null);
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
            <CardTitle className="text-xl">Book-from-Quote sandbox</CardTitle>
            <CardDescription className="text-gray-400">
              Generate a test link for the Book-from-Quote flow. Use a real booking ID. The link
              opens the client-facing form with prefill. No emails are sent.
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
                  placeholder="e.g. clxx…"
                  className="bg-gray-900 border-gray-700 text-white font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Artist type</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="artistType"
                      checked={artistType === "dj"}
                      onChange={() => setArtistType("dj")}
                      className="text-champagne-gold"
                    />
                    DJ
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="artistType"
                      checked={artistType === "musician"}
                      onChange={() => setArtistType("musician")}
                      className="text-champagne-gold"
                    />
                    Musician
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="staffId">Staff (optional)</Label>
                <select
                  id="staffId"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                >
                  <option value="">— None —</option>
                  {loadingStaff ? (
                    <option disabled>Loading…</option>
                  ) : (
                    staffOptions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fee">Fee (optional)</Label>
                <Input
                  id="fee"
                  type="number"
                  min={0}
                  step={1}
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="e.g. 1200"
                  className="bg-gray-900 border-gray-700 text-white"
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
                  "Generate link"
                )}
              </Button>
            </form>

            {link && (
              <div className="mt-6 p-4 rounded-lg bg-gray-900 border border-gray-700 space-y-3">
                <p className="text-sm font-medium text-champagne-gold">Book-from-Quote link</p>
                <p className="text-xs text-gray-400 break-all font-mono">{link}</p>
                <Button asChild size="sm" className="bg-champagne-gold text-black hover:bg-champagne-gold/90">
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in new tab
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
