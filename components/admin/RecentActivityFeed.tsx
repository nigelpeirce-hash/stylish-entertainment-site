"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bell,
  ArrowRight,
  Music,
  FileCheck,
  Mail,
  Banknote,
  Package,
  UserPlus,
  Send,
  MessageSquare,
  User,
  Users,
  Shield,
  Zap,
  Loader2,
} from "lucide-react";

interface ActivityItem {
  id: string;
  bookingId: string;
  action: string;
  description: string;
  performedBy?: string | null;
  actor?: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  bookingName?: string | null;
  venueName?: string | null;
  eventDate?: string | null;
  eventType?: string | null;
}

function getActionIcon(action: string) {
  if (action.includes("music") || action.includes("playlist")) return Music;
  if (action.includes("guest_request")) return Users;
  if (action.includes("terms") || action.includes("accept")) return FileCheck;
  if (action.includes("deposit") || action.includes("payment")) return Banknote;
  if (action.includes("hire_request")) return Package;
  if (action.includes("portal_message") || action.includes("message")) return MessageSquare;
  if (action.includes("dispatch") || action.includes("dispatched")) return Send;
  if (action.includes("artist_assigned") || action.includes("crew")) return UserPlus;
  if (action.includes("handoff")) return Zap;
  if (action.includes("quote_sent") || action.includes("brief")) return Mail;
  if (action.includes("notification_") && action.includes("_failed")) return Shield;
  return Bell;
}

function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    booking_request_received: "Booking request",
    quote_sent: "Quote sent",
    quote_confirmed: "Quote confirmed",
    deposit_paid: "Deposit paid",
    artist_assigned: "Artist assigned",
    handoff: "Handoff",
    dispatched: "Dispatched",
    portal_message: "Portal message",
    final_details_confirmed: "Final details",
    brief_sent: "Brief sent",
    terms_accepted: "T&Cs accepted",
    playlist_updated: "Playlist updated",
    guest_request_submitted: "Guest request",
    final_payment_sent: "Final payment confirmed",
    hire_request_confirmed: "Hire request",
    crew_removed: "Crew removed",
    crew_cancelled: "Crew cancelled",
    email_sent: "Email sent",
    portal_link_sent: "Portal link sent",
  };
  if (action.startsWith("notification_") && action.endsWith("_failed")) {
    return "Notification failed";
  }
  return labels[action] || action.replace(/_/g, " ");
}

function getActorColor(actor?: string): string {
  switch (actor) {
    case "client": return "bg-blue-500/20 text-blue-300 border-blue-500/40";
    case "guest": return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    case "admin": return "bg-champagne-gold/20 text-champagne-gold border-champagne-gold/40";
    case "system": return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/40";
  }
}

function formatRelative(date: Date): string {
  const now = new Date();
  const ms = now.getTime() - date.getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatExact(date: Date): string {
  return date.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function groupByDay(items: ActivityItem[]): Record<string, ActivityItem[]> {
  const groups: Record<string, ActivityItem[]> = {};
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  for (const item of items) {
    const d = new Date(item.createdAt);
    const key = d.toDateString();
    let label = key;
    if (key === today) label = "Today";
    else if (key === yesterday) label = "Yesterday";
    else label = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  }
  return groups;
}

export default function RecentActivityFeed() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/activity/?limit=50&days=14", { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (mounted && res.ok && Array.isArray(data.activity)) {
          setActivity(data.activity);
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-champagne-gold/60" />
      </div>
    );
  }

  const groups = groupByDay(activity);
  const hasActivity = activity.length > 0;

  return (
    <Card className="bg-gray-800/90 border border-gray-600">
      <CardHeader className="pb-2">
        <CardTitle className="font-serif text-lg flex items-center gap-2 text-white">
          <Bell className="w-5 h-5 text-champagne-gold/80" />
          Recent Activity
        </CardTitle>
        <p className="text-sm text-gray-400">
          Client, guest, admin and system actions – last 14 days
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="max-h-[400px] overflow-y-auto">
          {!hasActivity ? (
            <p className="py-8 text-center text-gray-500 text-sm">No recent activity</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(groups).map(([dayLabel, items]) => (
                <div key={dayLabel}>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 sticky top-0 bg-gray-800/95 py-1 z-10">
                    {dayLabel}
                  </h4>
                  <ul className="space-y-2">
                    {items.map((item) => {
                      const Icon = getActionIcon(item.action);
                      const actionLabel = getActionLabel(item.action);
                      const date = new Date(item.createdAt);
                      const meta = item.metadata;
                      const metaParts: string[] = [];
                      if (meta?.emailSubject && typeof meta.emailSubject === "string") metaParts.push(meta.emailSubject);
                      if (meta?.amount != null) metaParts.push(String(meta.amount));
                      if (meta?.songTitle && typeof meta.songTitle === "string") {
                        metaParts.push(`${meta.songTitle}${meta.songArtist ? ` – ${meta.songArtist}` : ""}`);
                      }
                      const metaStr = metaParts.length > 0 ? metaParts.join(" · ") : null;

                      return (
                        <li key={item.id}>
                          <Link
                            href={`/admin/bookings/${item.bookingId}`}
                            className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/60 border border-gray-700 hover:border-champagne-gold/40 hover:bg-gray-800/80 transition-all group"
                            title={formatExact(date)}
                          >
                            <span className="shrink-0 mt-0.5 p-1.5 rounded bg-champagne-gold/10 text-champagne-gold">
                              <Icon className="w-4 h-4" />
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-champagne-gold">
                                  {actionLabel}
                                </span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getActorColor(item.actor)}`}>
                                  {item.actor || "system"}
                                </span>
                              </div>
                              <p className="text-sm text-gray-300 truncate" title={item.description}>
                                {item.bookingName || "Booking"}{item.venueName ? ` · ${item.venueName}` : ""}
                              </p>
                              {metaStr && (
                                <p className="text-xs text-gray-500 mt-0.5 truncate" title={metaStr}>
                                  {metaStr}
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 shrink-0" title={formatExact(date)}>
                              {formatRelative(date)}
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-champagne-gold shrink-0 mt-1" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
