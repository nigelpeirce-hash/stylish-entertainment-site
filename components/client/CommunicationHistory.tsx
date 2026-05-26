"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import { clientMessagesPath } from "@/lib/portal-paths";
import { sanitizeEmailHtml } from "@/lib/sanitize-email-html";

interface Email {
  id: string;
  subject?: string | null;
  fromEmail?: string | null;
  fromName?: string | null;
  toEmail?: string | null;
  toName?: string | null;
  textContent?: string | null;
  htmlContent?: string | null;
  direction?: string | null;
  receivedAt: string;
}

interface Thread {
  id: string;
  subject?: string | null;
  fromEmail?: string | null;
  fromName?: string | null;
  lastMessageAt?: string | null;
  emails: Email[];
}

interface CommunicationHistoryProps {
  bookingId: string;
  className?: string;
  compact?: boolean;
}

export default function CommunicationHistory({
  bookingId,
  className = "",
  compact = false,
}: CommunicationHistoryProps) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/client/bookings/${bookingId}/threads`)
      .then((res) => (res.ok ? res.json() : { threads: [] }))
      .then((data) => setThreads(data.threads || []))
      .catch(() => setThreads([]))
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) {
    return (
      <Card className={`bg-gray-800/50 border-champagne-gold/30 ${className}`}>
        <CardContent className="py-8">
          <p className="text-sm text-gray-500 text-center">Loading messages…</p>
        </CardContent>
      </Card>
    );
  }

  if (compact && threads.length === 0) {
    return (
      <Card className={`bg-gray-800/50 border-champagne-gold/30 ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-champagne-gold" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm mb-4">No messages yet. Emails we send about this booking will appear here.</p>
          <Link
            href={clientMessagesPath()}
            className="inline-flex items-center gap-2 text-champagne-gold hover:underline text-sm"
          >
            <Mail className="w-4 h-4" />
            View all messages
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gray-800/50 border-champagne-gold/30 ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-champagne-gold" />
          Messages
        </CardTitle>
        <p className="text-sm text-gray-400">
          Quotes, confirmations, reminders and replies we&apos;ve exchanged about this booking.
        </p>
      </CardHeader>
      <CardContent>
        {threads.length === 0 ? (
          <div className="py-6 text-center">
            <Mail className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-60" />
            <p className="text-gray-400 font-medium">No messages yet</p>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
              Emails we send about this booking (quotes, confirmations, reminders) will appear here.
            </p>
            <Link
              href={clientMessagesPath()}
              className="inline-flex items-center gap-2 mt-4 text-champagne-gold hover:underline text-sm"
            >
              <Mail className="w-4 h-4" />
              View all messages
            </Link>
          </div>
        ) : (
          <div className="space-y-6 max-h-80 overflow-y-auto">
            {threads.map((thread) => (
              <div key={thread.id} className="space-y-3">
                <p className="text-sm font-medium text-champagne-gold">{thread.subject}</p>
                <div className="space-y-3">
                  {thread.emails.map((email) => (
                    <div
                      key={email.id}
                      className={`rounded-lg p-3 ${
                        email.direction === "outbound"
                          ? "bg-champagne-gold/10 border border-champagne-gold/30"
                          : "bg-gray-900/50 border border-gray-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-medium text-white text-sm">
                          {email.direction === "outbound" ? "You" : email.fromName || email.fromEmail}
                        </p>
                        <p className="text-xs text-gray-500 shrink-0">
                          {new Date(email.receivedAt).toLocaleString("en-GB", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                      {(() => {
                        // Sanitize inbound email HTML; fall back to plain text on failure.
                        const sanitized = email.htmlContent
                          ? sanitizeEmailHtml(email.htmlContent)
                          : { ok: true, html: "" };
                        if (sanitized.ok && sanitized.html) {
                          return (
                            <div
                              className="prose prose-invert prose-sm max-w-none text-gray-300 text-xs line-clamp-4"
                              dangerouslySetInnerHTML={{ __html: sanitized.html }}
                            />
                          );
                        }
                        return (
                          <p className="text-sm text-gray-300 whitespace-pre-wrap line-clamp-4">
                            {email.textContent || "—"}
                          </p>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Link
              href={clientMessagesPath()}
              className="inline-flex items-center gap-2 text-champagne-gold hover:underline text-sm"
            >
              <Mail className="w-4 h-4" />
              View all messages
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
