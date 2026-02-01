"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Music, 
  Copy, 
  Check, 
  MessageSquare,
  User,
  Loader2,
  Share2,
  Lock,
  Mail,
  Upload,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface GuestRequest {
  id: string;
  guestName: string | null;
  note: string | null;
  trackName: string;
  artistName: string;
  albumArtUrl: string | null;
  spotifyUrl: string | null;
  status?: string;
  createdAt: string;
}

interface GuestRequestsViewProps {
  bookingId: string;
  guestRequestToken: string | null;
  guestRequestsEnabled: boolean;
  eventDate: Date;
  baseUrl: string;
  eventPassed: boolean;
  portalToken?: string | null;
  venueName?: string | null;
  coupleName?: string | null;
  eventType?: string | null;
  onToggleEnabled?: (enabled: boolean) => Promise<void>;
}

export default function GuestRequestsView({
  bookingId,
  guestRequestToken,
  guestRequestsEnabled,
  eventDate,
  baseUrl,
  eventPassed,
  portalToken,
  venueName,
  coupleName,
  eventType,
  onToggleEnabled,
}: GuestRequestsViewProps) {
  const [requests, setRequests] = useState<GuestRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [enabled, setEnabled] = useState(guestRequestsEnabled);
  const [toggling, setToggling] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<{ valid: string[]; invalid: string[] } | null>(null);
  const [sendingInvites, setSendingInvites] = useState(false);
  const [inviteResult, setInviteResult] = useState<{ sent: number; error?: string } | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const approvedCount = requests.filter((r) => (r.status || "pending") === "approved").length;
  const today = new Date().toDateString();
  const suggestedToday = requests.filter((r) => new Date(r.createdAt).toDateString() === today).length;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Build shareable link (server-safe: use baseUrl prop, no window)
  const shareableLink = baseUrl && guestRequestToken
    ? `${baseUrl.replace(/\/$/, "")}/requests/${guestRequestToken}`
    : null;

  // Fetch guest requests (supports portal token for magic-link access)
  useEffect(() => {
    async function fetchRequests() {
      try {
        const url = portalToken
          ? `/api/client/bookings/${bookingId}/guest-requests?token=${encodeURIComponent(portalToken)}`
          : `/api/client/bookings/${bookingId}/guest-requests`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setRequests(data.requests || []);
        }
      } catch (err) {
        console.error("Failed to fetch guest requests:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, [bookingId, portalToken]);

  // Copy link to clipboard
  const copyLink = async () => {
    if (!shareableLink) return;
    
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = shareableLink;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Toggle guest requests
  const handleToggle = async () => {
    if (!onToggleEnabled) return;
    
    setToggling(true);
    try {
      await onToggleEnabled(!enabled);
      setEnabled(!enabled);
    } catch (err) {
      console.error("Failed to toggle guest requests:", err);
    } finally {
      setToggling(false);
    }
  };

  // Email invite (mailto)
  const emailSubject = venueName
    ? `Add your song requests for ${coupleName || "our"} wedding at ${venueName}`
    : coupleName
    ? `Add your song requests for ${coupleName}'s wedding`
    : "Add your song requests!";
  const emailBody = `Help us build the perfect playlist — add up to 3 song ideas:\n\n${shareableLink || ""}\n\nNothing plays without the couple's approval.`;
  const openEmail = () => {
    if (!shareableLink) return;
    const mailto = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailto;
  };

  // Share via native share API (mobile)
  const shareLink = async () => {
    if (!shareableLink || !navigator.share) return;
    
    try {
      await navigator.share({
        title: "Add your song requests!",
        text: "Help us build the perfect playlist - add your song requests!",
        url: shareableLink,
      });
    } catch (err) {
      // User cancelled or not supported
      copyLink();
    }
  };

  // CSV preview (client-side parse to show count before send)
  const parseCsvForPreview = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    const valid: string[] = [];
    const invalid: string[] = [];
    const seen = new Set<string>();
    let emailColIndex = -1;

    if (lines.length > 0) {
      const header = lines[0].toLowerCase();
      const cols = header.split(/[,;\t]/).map((c) => c.trim().toLowerCase());
      if (cols.some((c) => ["email", "e-mail", "guest_email", "guest email"].includes(c))) {
        emailColIndex = cols.findIndex((c) => ["email", "e-mail", "guest_email", "guest email"].includes(c));
      }
    }

    const extractEmails = (line: string): string[] => {
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      if (emailColIndex >= 0 && parts[emailColIndex]) {
        return [parts[emailColIndex]];
      }
      return parts.filter((p) => emailRegex.test(p));
    };

    for (let i = emailColIndex >= 0 ? 1 : 0; i < lines.length; i++) {
      const emails = extractEmails(lines[i]);
      for (const e of emails) {
        const lower = e.toLowerCase();
        if (emailRegex.test(e) && !seen.has(lower)) {
          seen.add(lower);
          if (valid.length < 200) valid.push(e);
        } else if (e && !emailRegex.test(e)) {
          invalid.push(e);
        }
      }
    }
    return { valid, invalid };
  };

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    setCsvFile(null);
    setCsvPreview(null);
    setInviteResult(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setInviteResult({ sent: 0, error: "Please upload a CSV file." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const { valid, invalid } = parseCsvForPreview(text);
      setCsvFile(file);
      setCsvPreview({ valid, invalid });
    };
    reader.readAsText(file);
  };

  const toggleRequestStatus = async (requestId: string, currentStatus: string) => {
    const next = currentStatus === "approved" ? "pending" : "approved";
    setTogglingId(requestId);
    try {
      const url = portalToken
        ? `/api/client/bookings/${bookingId}/guest-requests/${requestId}?token=${encodeURIComponent(portalToken)}`
        : `/api/client/bookings/${bookingId}/guest-requests/${requestId}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: next } : r))
        );
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    } finally {
      setTogglingId(null);
    }
  };

  const sendCsvInvites = async () => {
    if (!csvFile || !csvPreview || csvPreview.valid.length === 0) return;
    setSendingInvites(true);
    setInviteResult(null);
    try {
      const fd = new FormData();
      fd.append("file", csvFile);
      const url = portalToken
        ? `/api/client/bookings/${bookingId}/send-guest-invites/?token=${encodeURIComponent(portalToken)}`
        : `/api/client/bookings/${bookingId}/send-guest-invites/`;
      const res = await fetch(url, { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setInviteResult({ sent: data.sent ?? 0 });
        setCsvFile(null);
        setCsvPreview(null);
      } else {
        setInviteResult({ sent: 0, error: data.error ?? "Failed to send invites." });
      }
    } catch (err) {
      setInviteResult({ sent: 0, error: "Failed to send invites." });
    } finally {
      setSendingInvites(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-champagne-gold/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5 text-champagne-gold" />
            What your guests want to hear
          </CardTitle>
          <div className="flex items-center gap-2">
            {eventPassed ? (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Closed (event passed)
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <Label htmlFor="guest-toggle" className="text-sm text-gray-400">
                  {enabled ? "Open" : "Closed"}
                </Label>
                <Switch
                  id="guest-toggle"
                  checked={enabled}
                  onCheckedChange={handleToggle}
                  disabled={toggling || eventPassed}
                />
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Share Link Section - only after mount to avoid hydration mismatch (shareableLink, navigator.share) */}
        {mounted && shareableLink && enabled && !eventPassed && (
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-4">
            <p className="text-sm text-gray-400">
              Guests can suggest, but you&apos;re the DJ-in-chief — nothing goes live without your stamp of approval 💌
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              <Input
                value={shareableLink}
                readOnly
                className="bg-gray-800 border-gray-700 text-white text-sm flex-1 min-w-[200px]"
              />
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={copyLink}
                  variant="outline"
                  size="sm"
                  className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 flex-shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                  {copied ? "Copied" : "Copy link"}
                </Button>
                <Button
                  onClick={openEmail}
                  variant="outline"
                  size="sm"
                  className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 flex-shrink-0"
                >
                  <Mail className="w-4 h-4 mr-1.5" />
                  Email
                </Button>
                {typeof navigator !== "undefined" && navigator.share && (
                  <Button
                    onClick={shareLink}
                    variant="outline"
                    size="sm"
                    className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 flex-shrink-0"
                  >
                    <Share2 className="w-4 h-4 mr-1.5" />
                    Share
                  </Button>
                )}
              </div>
            </div>

            {/* CSV bulk send */}
            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm font-medium text-gray-300 mb-2">Send invites by email</p>
              <p className="text-xs text-gray-500 mb-2">
                Upload a CSV with an &quot;email&quot; column, or emails in the first column (up to 200).
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                <input
                  ref={csvInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCsvChange}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => csvInputRef.current?.click()}
                  className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
                >
                  <Upload className="w-4 h-4 mr-1.5" />
                  Upload CSV
                </Button>
                {csvPreview && csvPreview.valid.length > 0 && (
                  <>
                    <span className="text-sm text-gray-400">
                      {csvPreview.valid.length} valid email{csvPreview.valid.length !== 1 ? "s" : ""} found
                    </span>
                    <Button
                      size="sm"
                      onClick={sendCsvInvites}
                      disabled={sendingInvites}
                      className="bg-champagne-gold text-black hover:bg-champagne-gold/90"
                    >
                      {sendingInvites ? (
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      ) : null}
                      {sendingInvites ? "Sending…" : `Send invites to ${csvPreview.valid.length} guests`}
                    </Button>
                  </>
                )}
              </div>
              {inviteResult && (
                <p className={`text-sm mt-2 ${inviteResult.error ? "text-red-400" : "text-emerald-400"}`}>
                  {inviteResult.error ?? `Invites sent to ${inviteResult.sent} guests.`}
                </p>
              )}
            </div>

            <p className="text-xs text-gray-500">
              Tap approve on any suggestion you like. The link closes automatically after your event.
            </p>
          </div>
        )}

        {/* Requests List */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Music className="w-4 h-4" />
              {requests.length} suggestion{requests.length !== 1 ? "s" : ""} from your guests
            </h3>
            {requests.length > 0 && (
              <div className="flex items-center gap-3 text-xs">
                {suggestedToday > 0 && (
                  <span className="text-champagne-gold/80 bg-champagne-gold/10 px-2 py-1 rounded-full">
                    {suggestedToday} suggested today!
                  </span>
                )}
                <span className="text-gray-400">
                  You&apos;ve approved {approvedCount}/{requests.length}
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-champagne-gold animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No suggestions yet</p>
              <p className="text-sm">Share the link above and see what your guests want to hear.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              <AnimatePresence>
                {requests.map((request, index) => {
                  const isApproved = (request.status || "pending") === "approved";
                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      className={`flex gap-3 p-3 rounded-lg border transition-all duration-300 ${
                        isApproved
                          ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                          : "bg-gray-900/50 border-gray-700"
                      }`}
                    >
                      <div className={`w-14 h-14 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                        isApproved ? "bg-emerald-500/20" : "bg-champagne-gold/10"
                      }`}>
                        <Music className={`w-6 h-6 ${isApproved ? "text-emerald-400" : "text-champagne-gold"}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">{request.trackName}</p>
                          <p className="text-gray-400 text-sm truncate">{request.artistName}</p>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          <span className="flex items-center gap-1 text-champagne-gold">
                            <User className="w-3 h-3" />
                            {request.guestName || "Anonymous"}
                          </span>
                          {request.note && (
                            <span className="flex items-center gap-1 text-gray-400">
                              <MessageSquare className="w-3 h-3" />
                              &quot;{request.note}&quot;
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleRequestStatus(request.id, request.status || "pending")}
                        disabled={!!togglingId}
                        className={`flex-shrink-0 self-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                          isApproved
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 animate-[pulse_2.5s_ease-in-out_infinite]"
                        }`}
                      >
                        {togglingId === request.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : isApproved ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approved
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" />
                            Pending
                          </>
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
