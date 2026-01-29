"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Loader2 } from "lucide-react";

export interface ClientEmailItem {
  id: string;
  threadId: string | null;
  subject: string;
  fromEmail: string;
  toEmail: string;
  direction: string;
  textContent: string | null;
  htmlContent: string | null;
  createdAt: string;
  receivedAt: string;
}

interface ClientEmailsCardProps {
  bookingId: string;
  clientName?: string;
  clientEmail?: string;
  getSectionBgColor?: () => string;
}

function formatDate(s: string): string {
  try {
    return new Date(s).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return s;
  }
}

function plainSnippet(html: string | null, text: string | null, maxLen: number): string {
  const raw = text || (typeof html === "string" ? html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "") || "";
  return raw.length > maxLen ? raw.slice(0, maxLen) + "…" : raw;
}

export default function ClientEmailsCard({
  bookingId,
  clientName,
  clientEmail,
  getSectionBgColor,
}: ClientEmailsCardProps) {
  const [emails, setEmails] = useState<ClientEmailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/admin/enquiries/${bookingId}/emails`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load emails");
        return res.json();
      })
      .then((data: { emails?: ClientEmailItem[] }) => {
        if (!cancelled && Array.isArray(data.emails)) setEmails(data.emails);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  const bg = getSectionBgColor?.() ?? "";

  return (
    <Card className={`bg-gray-800 border-champagne-gold/30 ${bg} transition-colors`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-champagne-gold" />
          Client emails
        </CardTitle>
        <p className="text-sm text-gray-400">
          Emails to and from this client (enquiry, 1st touch, quotes, portal invite, etc.)
        </p>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center gap-2 text-gray-400 py-4">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading…</span>
          </div>
        )}
        {error && (
          <p className="text-red-400 text-sm py-4">{error}</p>
        )}
        {!loading && !error && emails.length === 0 && (
          <p className="text-gray-400 text-sm py-4">No emails yet for this booking.</p>
        )}
        {!loading && !error && emails.length > 0 && (
          <div className="space-y-3">
            {emails.map((email) => (
              <div
                key={email.id}
                className="p-3 bg-gray-700/50 rounded-lg border border-gray-600"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-white font-semibold truncate flex-1">{email.subject || "(No subject)"}</p>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDate(email.createdAt || email.receivedAt)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {email.direction === "outbound"
                    ? `Sent to ${email.toEmail || clientEmail || "—"}`
                    : `Received from ${email.fromEmail || "—"}`}
                </p>
                {email.direction === "outbound" && (
                  <Badge className="bg-green-600/20 text-green-400 border-green-500/50 text-xs mt-1.5">
                    Sent
                  </Badge>
                )}
                {(email.textContent || email.htmlContent) && (
                  <p className="text-sm text-gray-300 line-clamp-2 mt-2">
                    {plainSnippet(email.htmlContent, email.textContent, 180)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
