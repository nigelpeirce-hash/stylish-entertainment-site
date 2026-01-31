"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Mail, Loader2, ChevronRight } from "lucide-react";

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
  const [selectedEmail, setSelectedEmail] = useState<ClientEmailItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/admin/enquiries/${bookingId}/emails/`)
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
    <>
      <Card className={`bg-gray-800 border-champagne-gold/30 ${bg} transition-colors`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-champagne-gold" />
            Client emails
          </CardTitle>
          <p className="text-sm text-gray-400">
            Emails to and from this client (enquiry, 1st touch, quotes, portal invite, etc.). Click to read full email.
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
            <div className="space-y-2">
              {emails.map((email) => (
                <button
                  key={email.id}
                  type="button"
                  onClick={() => setSelectedEmail(email)}
                  className="w-full text-left p-3 rounded-lg border border-gray-600 bg-gray-700/50 hover:bg-gray-700/80 hover:border-champagne-gold/40 transition-colors flex items-center gap-2 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <p className="text-white font-semibold truncate flex-1">{email.subject || "(No subject)"}</p>
                      <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                        {formatDate(email.createdAt || email.receivedAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {email.direction === "outbound"
                        ? `Sent to ${email.toEmail || clientEmail || "—"}`
                        : `Received from ${email.fromEmail || "—"}`}
                    </p>
                    {(email.textContent || email.htmlContent) && (
                      <p className="text-sm text-gray-400 line-clamp-1 mt-1">
                        {plainSnippet(email.htmlContent, email.textContent, 120)}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-champagne-gold shrink-0" />
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full email viewer – 3/4 screen */}
      <Sheet open={!!selectedEmail} onOpenChange={(open) => !open && setSelectedEmail(null)}>
        <SheetContent
          side="right"
          className="w-[75vw] max-w-[75vw] sm:w-[75vw] sm:max-w-[75vw] flex flex-col p-0"
        >
          {selectedEmail && (
            <>
              <SheetHeader className="px-6 py-4 border-b border-gray-700 shrink-0">
                <div className="flex items-start justify-between gap-4 pr-8">
                  <SheetTitle className="text-xl font-semibold text-white break-words">
                    {selectedEmail.subject || "(No subject)"}
                  </SheetTitle>
                </div>
                <div className="mt-3 space-y-1.5 text-sm">
                  <p className="text-gray-300">
                    <span className="text-gray-500">From:</span>{" "}
                    {selectedEmail.direction === "inbound" ? selectedEmail.fromEmail : "Stylish Entertainment"}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-500">To:</span>{" "}
                    {selectedEmail.direction === "outbound" ? selectedEmail.toEmail : (clientEmail || selectedEmail.toEmail)}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {formatDate(selectedEmail.createdAt || selectedEmail.receivedAt)}
                    {selectedEmail.direction === "outbound" && (
                      <Badge className="ml-2 bg-green-600/20 text-green-400 border-green-500/50 text-xs">
                        Sent
                      </Badge>
                    )}
                  </p>
                </div>
              </SheetHeader>
              <div className="flex-1 min-h-0 overflow-auto px-6 py-4">
                {selectedEmail.htmlContent && selectedEmail.htmlContent.trim() ? (
                  <div
                    className="email-body prose prose-invert prose-sm max-w-none text-gray-300 [&_img]:max-w-full [&_img]:h-auto [&_table]:max-w-full [&_iframe]:max-w-full"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.htmlContent }}
                    style={{ wordBreak: "break-word" }}
                  />
                ) : selectedEmail.textContent && selectedEmail.textContent.trim() ? (
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-300 break-words bg-gray-800/50 rounded-lg p-4">
                    {selectedEmail.textContent}
                  </pre>
                ) : (
                  <p className="text-gray-500 italic">No body content.</p>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
