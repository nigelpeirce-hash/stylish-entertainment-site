"use client";

/**
 * Demo page: Guest Requests Workflow
 *
 * Tests the full flow: Client (nigelpeirce@me.com) → share link → Guest receives → Guest adds songs.
 * Use this to verify all guest request APIs work correctly.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Users,
  Music,
  Link2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DemoLinks {
  bookingId: string;
  clientName: string;
  email: string;
  eventDate: string;
  venueName: string | null;
  eventType: string | null;
  guestRequestsEnabled: boolean;
  links: {
    clientPortal: string;
    guestRequestPage: string;
  };
}

interface ApiTest {
  name: string;
  status: "pending" | "ok" | "fail";
  message?: string;
}

export default function DemoGuestRequestsWorkflowPage() {
  const router = useRouter();
  const [email, setEmail] = useState("nigelpeirce@me.com");
  const [data, setData] = useState<DemoLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<"portal" | "guest" | null>(null);
  const [apiTests, setApiTests] = useState<ApiTest[]>([]);

  const fetchLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/demo/guest-requests-links/?email=${encodeURIComponent(email)}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = json?.hint || json?.error || (res.status === 404 ? "No booking found for this email." : "Failed to load");
        setError(msg);
        setData(null);
        return;
      }
      setData(json);
    } catch (e) {
      setError((e as Error).message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const copyToClipboard = async (text: string, key: "portal" | "guest") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  const runApiTests = async () => {
    if (!data) return;
    const tests: ApiTest[] = [
      { name: "GET /api/guest-requests/[token]", status: "pending" },
      { name: "POST /api/guest-requests/[token]/songs", status: "pending" },
      { name: "GET /api/client/bookings/[id]/guest-requests", status: "pending" },
    ];
    setApiTests(tests);

    const token = data.links.guestRequestPage.split("/requests/")[1];
    const portalToken = new URL(data.links.clientPortal).searchParams.get("token");

    // Test 1: GET guest-requests (public)
    try {
      const r1 = await fetch(`/api/guest-requests/${token}`);
      const d1 = await r1.json();
      tests[0].status = r1.ok ? "ok" : "fail";
      tests[0].message = r1.ok ? `${d1.coupleName} – ${d1.totalRequests} requests` : d1.error;
    } catch (e) {
      tests[0].status = "fail";
      tests[0].message = (e as Error).message;
    }
    setApiTests([...tests]);

    // Test 2: POST a song (then we'd need to delete - skip or do a quick POST)
    if (data.guestRequestsEnabled) {
      try {
        const r2 = await fetch(`/api/guest-requests/${token}/songs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trackName: `Test Song (Demo ${Date.now()})`,
            artistName: "Test Artist",
            guestName: "Nigel (Demo)",
            note: "Delete me - demo test",
          }),
        });
        const d2 = await r2.json();
        tests[1].status = r2.ok ? "ok" : "fail";
        tests[1].message = r2.ok ? "Created" : d2.error;
      } catch (e) {
        tests[1].status = "fail";
        tests[1].message = (e as Error).message;
      }
    } else {
      tests[1].status = "fail";
      tests[1].message = "Guest requests disabled for this booking";
    }
    setApiTests([...tests]);

    // Test 3: GET client guest-requests (needs portal token)
    if (portalToken) {
      try {
        const r3 = await fetch(
          `/api/client/bookings/${data.bookingId}/guest-requests?token=${encodeURIComponent(portalToken)}`
        );
        const d3 = await r3.json();
        tests[2].status = r3.ok ? "ok" : "fail";
        tests[2].message = r3.ok ? `${(d3.requests || []).length} requests` : d3.error;
      } catch (e) {
        tests[2].status = "fail";
        tests[2].message = (e as Error).message;
      }
    } else {
      tests[2].status = "fail";
      tests[2].message = "No portal token";
    }
    setApiTests([...tests]);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-champagne-gold hover:underline text-sm"
          >
            ← Back to admin
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Guest Requests Workflow Demo</h1>
          <p className="text-gray-400">
            Test the full flow: Client sends link → Guest receives → Guest adds songs. APIs must be working.
          </p>
        </div>

        {/* Email selector */}
        <Card className="bg-gray-900 border-champagne-gold/30 mb-6">
          <CardContent className="pt-6">
            <Label htmlFor="email" className="text-gray-400 text-sm">
              Booking email (default: nigelpeirce@me.com)
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button
                onClick={fetchLinks}
                disabled={loading}
                className="bg-champagne-gold text-black shrink-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-champagne-gold animate-spin" />
          </div>
        )}

        {error && (
          <Card className="bg-red-900/20 border-red-500/30 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-300">{error}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Create a booking in admin with this email, or use an existing client email.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {data && !loading && (
          <>
            {/* Booking info */}
            <Card className="bg-gray-900 border-champagne-gold/30 mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Booking found</CardTitle>
                <CardDescription className="text-gray-400">
                  {data.clientName} · {data.venueName || "No venue"} · {new Date(data.eventDate).toLocaleDateString("en-GB")}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Flow diagram */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-champagne-gold" />
                <span>Client (you)</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 rotate-90 md:rotate-0" />
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-champagne-gold" />
                <span>Share link</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 rotate-90 md:rotate-0" />
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-champagne-gold" />
                <span>Guest adds songs</span>
              </div>
            </div>

            {/* Client Portal link */}
            <Card className="bg-gray-900 border-champagne-gold/30 mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-champagne-gold" />
                  1. Client Portal (as {email})
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Open as the client. View & share the guest request link. Toggle guest requests on/off.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={data.links.clientPortal}
                    readOnly
                    className="bg-gray-800 border-gray-700 text-white text-sm font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 border-champagne-gold text-champagne-gold"
                    onClick={() => copyToClipboard(data.links.clientPortal, "portal")}
                  >
                    {copied === "portal" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button asChild className="shrink-0 bg-champagne-gold text-black">
                    <a href={data.links.clientPortal} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Guest link */}
            <Card className="bg-gray-900 border-champagne-gold/30 mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Music className="w-5 h-5 text-champagne-gold" />
                  2. Guest Request Page (share with guests)
                </CardTitle>
                <CardDescription className="text-gray-400">
                  This is the link the client shares. Guests open it to add song requests (up to 3 each).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <Input
                    value={data.links.guestRequestPage}
                    readOnly
                    className="bg-gray-800 border-gray-700 text-white text-sm font-mono flex-1 min-w-0"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 border-champagne-gold text-champagne-gold"
                    onClick={() => copyToClipboard(data.links.guestRequestPage, "guest")}
                  >
                    {copied === "guest" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button asChild className="shrink-0 bg-champagne-gold text-black">
                    <a href={data.links.guestRequestPage} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open as guest
                    </a>
                  </Button>
                </div>
                {!data.guestRequestsEnabled && (
                  <p className="text-amber-400 text-sm">
                    Guest requests are currently closed for this booking. Enable them in the client portal.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* API tests */}
            <Card className="bg-gray-900 border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="text-lg">API health check</CardTitle>
                <CardDescription className="text-gray-400">
                  Verify guest-requests and client portal APIs respond correctly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={runApiTests}
                  variant="outline"
                  className="mb-4 border-champagne-gold text-champagne-gold"
                >
                  Run API tests
                </Button>
                {apiTests.length > 0 && (
                  <div className="space-y-2">
                    {apiTests.map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
                      >
                        <span className="text-sm font-mono">{t.name}</span>
                        <span className="flex items-center gap-2">
                          {t.status === "pending" && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
                          {t.status === "ok" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {t.status === "fail" && <AlertCircle className="w-4 h-4 text-red-400" />}
                          {t.message && (
                            <span
                              className={
                                t.status === "ok"
                                  ? "text-emerald-400 text-xs"
                                  : t.status === "fail"
                                  ? "text-red-400 text-xs"
                                  : "text-gray-500 text-xs"
                              }
                            >
                              {t.message}
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
