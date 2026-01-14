"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Mail,
  Inbox,
  Star,
  Archive,
  Search,
  Filter,
  Reply,
  Trash2,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";

interface EmailThread {
  id: string;
  subject: string;
  fromEmail: string;
  fromName: string | null;
  toEmail: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  lastMessageAt: string;
  inbox: { id: string; name: string; email: string };
  booking: { id: string; name: string; eventType: string; eventDate: string } | null;
  user: { id: string; name: string; email: string } | null;
  _count: { emails: number };
}

export default function AdminInbox() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [inboxes, setInboxes] = useState<any[]>([]);
  const [selectedInbox, setSelectedInbox] = useState<string>("all");
  const [filter, setFilter] = useState<"all" | "unread" | "starred" | "archived">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [sending, setSending] = useState(false);
  const [composeData, setComposeData] = useState<{
    inboxId: string;
    to: string;
    subject: string;
    body: string;
    signature: "none" | "ali" | "nige";
  }>({
    inboxId: "",
    to: "",
    subject: "",
    body: "",
    signature: "none",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      fetchInboxes();
      fetchThreads();
    }
  }, [status, session, selectedInbox, filter]);

  const fetchInboxes = async () => {
    try {
      const response = await fetch("/api/admin/inboxes");
      if (response.ok) {
        const data = await response.json();
        setInboxes(data.inboxes || []);
        if (!composeData.inboxId && data.inboxes && data.inboxes.length > 0) {
          setComposeData((prev) => ({ ...prev, inboxId: data.inboxes[0].id }));
        }
      }
    } catch (error) {
      console.error("Error fetching inboxes:", error);
    }
  };

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedInbox !== "all") params.append("inboxId", selectedInbox);
      if (filter === "unread") params.append("isRead", "false");
      if (filter === "starred") params.append("isStarred", "true");
      if (filter === "archived") params.append("isArchived", "true");
      if (search) params.append("search", search);

      const response = await fetch(`/api/admin/threads?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setThreads(data.threads || []);
      }
    } catch (error) {
      console.error("Error fetching threads:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSignatureHtml = (key: "ali" | "nige") => {
    const baseStyles =
      "font-family: Arial, sans-serif; font-size: 13px; color: #222222; line-height: 1.5;";
    const logoImg =
      '<img src="https://stylishentertainment.co.uk/favicon.svg" alt="Stylish Entertainment" style="width:32px;height:32px;margin-right:8px;vertical-align:middle;" />';
    const socials =
      '<div style="margin-top:6px;"><a href="https://www.facebook.com/StylishEntertainment" style="margin-right:8px;color:#D4AF37;text-decoration:none;">Facebook</a><a href="https://www.youtube.com/@stylishentertainment937/playlists" style="margin-right:8px;color:#D4AF37;text-decoration:none;">YouTube</a><a href="https://www.instagram.com/stylishentertainment/" style="color:#D4AF37;text-decoration:none;">Instagram</a></div>';
    const disclaimer =
      '<p style="margin-top:10px;font-size:11px;color:#777777;max-width:480px;">The content of this email is confidential and intended for the recipient specified in this message only. It is strictly forbidden to share any part of this message with any third party without the written consent of the sender. If you received this message by mistake, please reply to this message and then delete it so that we can ensure such a mistake does not occur in the future.</p>';

    if (key === "nige") {
      return `
        <div style="${baseStyles}">
          <div style="margin-bottom:6px;">
            ${logoImg}
            <span style="font-weight:bold;font-size:14px;">Nigel Peirce</span>
          </div>
          <div>Director | <a href="https://stylishentertainment.co.uk" style="color:#D4AF37;text-decoration:none;">stylishentertainment.co.uk</a></div>
          <div style="margin-top:4px;">
            <strong>M:</strong> <a href="tel:+447970793177" style="color:#222222;text-decoration:none;">07970 793177</a><br />
            <strong>E:</strong> <a href="mailto:nigel@stylishentertainment.co.uk" style="color:#222222;text-decoration:none;">nigel@stylishentertainment.co.uk</a><br />
            <strong>A:</strong> Stylish Entertainment Ltd, 88 Weymouth Road, Frome, BA11 1HJ
          </div>
          ${socials}
          ${disclaimer}
        </div>
      `;
    }

    return `
      <div style="${baseStyles}">
        <div style="margin-bottom:6px;">
          ${logoImg}
          <span style="font-weight:bold;font-size:14px;">Ali Peirce</span>
        </div>
        <div>Stylish Entertainment | <a href="https://stylishentertainment.co.uk" style="color:#D4AF37;text-decoration:none;">stylishentertainment.co.uk</a></div>
        <div style="margin-top:4px;">
          <strong>M:</strong> <a href="tel:+447711117916" style="color:#222222;text-decoration:none;">07711 117916</a><br />
          <strong>E:</strong> <a href="mailto:ali@stylishent.co.uk" style="color:#222222;text-decoration:none;">ali@stylishent.co.uk</a><br />
          <strong>A:</strong> Stylish Entertainment Ltd, 88 Weymouth Road, Frome, BA11 1HJ
        </div>
        ${socials}
        ${disclaimer}
      </div>
    `;
  };

  const handleSendNewEmail = async () => {
    if (!composeData.inboxId || !composeData.to || !composeData.subject || !composeData.body.trim()) {
      alert("Please fill in From inbox, To, Subject and Message.");
      return;
    }

    const signatureHtml =
      composeData.signature === "none" ? "" : getSignatureHtml(composeData.signature);
    const html = signatureHtml
      ? `${composeData.body}<br/><br/>${signatureHtml}`
      : composeData.body;
    const text = html.replace(/<[^>]*>/g, "");

    setSending(true);
    try {
      const response = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inboxId: composeData.inboxId,
          to: composeData.to,
          subject: composeData.subject,
          html,
          text,
        }),
      });

      if (response.ok) {
        alert("Email sent.");
        setComposeData((prev) => ({
          ...prev,
          to: "",
          subject: "",
          body: "",
          signature: "none",
        }));
        setComposing(false);
        fetchThreads();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending the email");
    } finally {
      setSending(false);
    }
  };

  const handleToggleStar = async (threadId: string, currentStarred: boolean) => {
    try {
      const response = await fetch(`/api/admin/threads/${threadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isStarred: !currentStarred }),
      });

      if (response.ok) {
        fetchThreads();
      }
    } catch (error) {
      console.error("Error toggling star:", error);
    }
  };

  const handleToggleArchive = async (threadId: string, currentArchived: boolean) => {
    try {
      const response = await fetch(`/api/admin/threads/${threadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: !currentArchived }),
      });

      if (response.ok) {
        fetchThreads();
      }
    } catch (error) {
      console.error("Error toggling archive:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session || (session?.user as any)?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Email Inbox</h1>
              <p className="text-gray-400">Manage all email communications</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setComposing((prev) => !prev)}
                className="bg-champagne-gold text-black hover:bg-gold-light"
              >
                <Mail className="w-4 h-4 mr-2" />
                {composing ? "Close" : "New Email"}
              </Button>
              <Link href="/admin">
                <Button variant="outline" className="border-champagne-gold text-champagne-gold">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    // Debounce search
                    setTimeout(() => fetchThreads(), 500);
                  }}
                  placeholder="Search emails..."
                  className="bg-gray-800 text-white border-gray-700 pl-10"
                />
              </div>
            </div>

            <select
              value={selectedInbox}
              onChange={(e) => setSelectedInbox(e.target.value)}
              className="bg-gray-800 text-white border border-gray-700 rounded px-4 py-2"
            >
              <option value="all">All Inboxes</option>
              {inboxes.map((inbox) => (
                <option key={inbox.id} value={inbox.id}>
                  {inbox.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <Button
                onClick={() => setFilter("all")}
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
              >
                All
              </Button>
              <Button
                onClick={() => setFilter("unread")}
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
              >
                Unread
              </Button>
              <Button
                onClick={() => setFilter("starred")}
                variant={filter === "starred" ? "default" : "outline"}
                size="sm"
              >
                Starred
              </Button>
              <Button
                onClick={() => setFilter("archived")}
                variant={filter === "archived" ? "default" : "outline"}
                size="sm"
              >
                Archived
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Compose New Email */}
        {composing && (
          <div className="mb-8">
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle>New Email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">From Inbox</label>
                    <select
                      value={composeData.inboxId}
                      onChange={(e) =>
                        setComposeData((prev) => ({ ...prev, inboxId: e.target.value }))
                      }
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    >
                      <option value="">Select inbox...</option>
                      {inboxes.map((inbox) => (
                        <option key={inbox.id} value={inbox.id}>
                          {inbox.name} ({inbox.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Signature</label>
                    <select
                      value={composeData.signature}
                      onChange={(e) =>
                        setComposeData((prev) => ({
                          ...prev,
                          signature: e.target.value as "none" | "ali" | "nige",
                        }))
                      }
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    >
                      <option value="none">No signature</option>
                      <option value="ali">Ali signature</option>
                      <option value="nige">Nige signature</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-300">To</label>
                  <Input
                    value={composeData.to}
                    onChange={(e) =>
                      setComposeData((prev) => ({ ...prev, to: e.target.value }))
                    }
                    placeholder="client@example.com"
                    className="bg-gray-900 text-white border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Subject</label>
                  <Input
                    value={composeData.subject}
                    onChange={(e) =>
                      setComposeData((prev) => ({ ...prev, subject: e.target.value }))
                    }
                    className="bg-gray-900 text-white border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Message</label>
                  <textarea
                    value={composeData.body}
                    onChange={(e) =>
                      setComposeData((prev) => ({ ...prev, body: e.target.value }))
                    }
                    rows={10}
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-md p-3 font-mono text-sm"
                    placeholder="Type your message..."
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSendNewEmail}
                    disabled={sending}
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    {sending ? "Sending..." : "Send Email"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => {
                      setComposing(false);
                      setComposeData({
                        inboxId: composeData.inboxId,
                        to: "",
                        subject: "",
                        body: "",
                        signature: "none",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Threads List */}
        <div className="space-y-2">
          {threads.length === 0 ? (
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardContent className="p-12 text-center">
                <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-lg">No emails found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {inboxes.length === 0
                    ? "Configure email inboxes in Settings first"
                    : "Emails will appear here once synced"}
                </p>
              </CardContent>
            </Card>
          ) : (
            threads.map((thread) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Link href={`/admin/inbox/${thread.id}`}>
                  <Card
                    className={`bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer ${
                      !thread.isRead ? "border-l-4 border-l-champagne-gold" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-champagne-gold" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <h3
                              className={`font-semibold truncate ${
                                !thread.isRead ? "text-white" : "text-gray-300"
                              }`}
                            >
                              {thread.fromName || thread.fromEmail}
                            </h3>
                            {thread.isStarred && (
                              <Star className="w-4 h-4 text-champagne-gold fill-champagne-gold" />
                            )}
                            {thread.booking && (
                              <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-500/30">
                                <Calendar className="w-3 h-3 inline mr-1" />
                                {thread.booking.eventType}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(thread.lastMessageAt).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-sm text-gray-400 mb-2 truncate">
                          {thread.subject}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{thread.inbox.name}</span>
                          <span>•</span>
                          <span>{thread._count.emails} message{thread._count.emails !== 1 ? "s" : ""}</span>
                          {thread.booking && (
                            <>
                              <span>•</span>
                              <Link
                                href={`/admin/bookings?bookingId=${thread.booking.id}`}
                                className="text-champagne-gold hover:text-gold-light"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View Booking
                              </Link>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStar(thread.id, thread.isStarred);
                          }}
                          variant="ghost"
                          size="sm"
                          className={thread.isStarred ? "text-champagne-gold" : "text-gray-400"}
                        >
                          <Star
                            className={`w-4 h-4 ${thread.isStarred ? "fill-current" : ""}`}
                          />
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleArchive(thread.id, thread.isArchived);
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400"
                        >
                          <Archive className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/inbox/${thread.id}`);
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-champagne-gold"
                        >
                          <Reply className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
