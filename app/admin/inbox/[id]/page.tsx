"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  Reply,
  Send,
  User,
  Calendar,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";

interface Email {
  id: string;
  subject: string;
  from: string;
  fromEmail: string;
  fromName: string | null;
  to: string;
  toEmail: string;
  bodyText: string | null;
  bodyHtml: string | null;
  textContent: string | null;
  htmlContent: string | null;
  direction: string;
  receivedAt: string;
  sentByUser: { name: string; email: string } | null;
  messageId?: string | null;
}

interface EmailThread {
  id: string;
  subject: string;
  fromEmail: string;
  fromName: string | null;
  toEmail: string;
  inbox: { id: string; name: string; email: string };
  booking: { 
    id: string; 
    name: string; 
    eventType: string; 
    eventDate: string; 
    venueName: string;
    preferredDJ?: string | null;
    djStartTime?: string | null;
    djFinishTime?: string | null;
  } | null;
  user: { id: string; name: string; email: string } | null;
  emails: Email[];
}

function getSignatureHtml(key: "ali" | "nige") {
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

  // ali
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
}

export default function ThreadDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const threadId = params.id as string;

  const [thread, setThread] = useState<EmailThread | null>(null);
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [djFee, setDjFee] = useState<string>("");
  const [signatureKey, setSignatureKey] = useState<"none" | "ali" | "nige">("none");
  const [replyAll, setReplyAll] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin" && threadId) {
      fetchThread();
      fetchTemplates();
    }
  }, [status, session, threadId]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/admin/email-templates?isActive=true");
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const fetchThread = async () => {
    try {
      const response = await fetch(`/api/admin/threads/${threadId}`);
      if (response.ok) {
        const data = await response.json();
        setThread(data.thread);
      }
    } catch (error) {
      console.error("Error fetching thread:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = async (templateId: string) => {
    if (!templateId) {
      setReplyText("");
      return;
    }

    try {
      const response = await fetch(`/api/admin/email-templates/${templateId}`);
      if (response.ok) {
        const data = await response.json();
        const template = data.template;
        
        // Prepare variables
        const variables: any = {};
        if (thread?.booking) {
          const eventDate = new Date(thread.booking.eventDate).toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          variables.eventDate = eventDate;
          variables.venueName = thread.booking.venueName;
          variables.clientName = thread.booking.name;
          variables.eventType = thread.booking.eventType;
          variables.djName = thread.booking.preferredDJ || "TBC";
          if (thread.booking.djStartTime && thread.booking.djFinishTime) {
            variables.eventTimings = `${thread.booking.djStartTime} - ${thread.booking.djFinishTime}`;
          }
        }
        if (djFee) {
          variables.djFee = djFee;
        }

        // Simple variable replacement
        let processedHtml = template.bodyHtml;
        Object.keys(variables).forEach((key) => {
          const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
          processedHtml = processedHtml.replace(regex, variables[key] || "");
        });
        processedHtml = processedHtml.replace(/\{\{[^}]+\}\}/g, "");

        setReplyText(processedHtml);
      }
    } catch (error) {
      console.error("Error loading template:", error);
    }
  };

  const handleReply = async () => {
    if (!thread || !replyText.trim()) return;

    const signatureHtml =
      signatureKey === "none" ? "" : getSignatureHtml(signatureKey);
    const html = signatureHtml
      ? `${replyText}<br/><br/>${signatureHtml}`
      : replyText;
    const text = html.replace(/<[^>]*>/g, "");

    // Build recipient list
    const lastEmail = thread.emails[thread.emails.length - 1];
    let to = thread.fromEmail;
    let cc: string[] | undefined = undefined;

    if (replyAll && lastEmail) {
      const addresses = new Set<string>();

      const pushIfValid = (value?: string | null) => {
        if (value && value.includes("@")) {
          addresses.add(value.toLowerCase());
        }
      };

      // Original participants
      pushIfValid(lastEmail.fromEmail || lastEmail.from);
      pushIfValid(lastEmail.toEmail);

      // Thread-level participants
      pushIfValid(thread.fromEmail);
      pushIfValid(thread.toEmail);
      pushIfValid(thread.user?.email || null);

      // Remove inbox's own address to avoid emailing yourself twice
      addresses.delete(thread.inbox.email.toLowerCase());

      const allRecipients = Array.from(addresses);
      if (allRecipients.length > 0) {
        to = allRecipients[0];
        if (allRecipients.length > 1) {
          cc = allRecipients.slice(1);
        }
      }
    }

    setSending(true);
    try {
      const response = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inboxId: thread.inbox.id,
          to,
          cc,
          subject: `Re: ${thread.subject}`,
          html,
          text,
          threadId: thread.id,
          replyToMessageId: thread.emails[thread.emails.length - 1]?.messageId,
          templateId: selectedTemplateId || undefined,
          bookingId: thread.booking?.id || undefined,
          djFee: djFee || undefined,
        }),
      });

      if (response.ok) {
        setReplyText("");
        setReplying(false);
        setSignatureKey("none");
        setReplyAll(false);
        await fetchThread();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to send reply");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("An error occurred");
    } finally {
      setSending(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session || (session?.user as any)?.role !== "admin" || !thread) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link href="/admin/inbox">
            <Button variant="outline" className="border-champagne-gold text-champagne-gold mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Inbox
            </Button>
          </Link>

          {thread.booking && (
            <Link href={`/admin/bookings?bookingId=${thread.booking.id}`}>
              <Card className="bg-gray-800 border-champagne-gold/30 mb-4 cursor-pointer hover:border-champagne-gold/60">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-champagne-gold" />
                    <div>
                      <p className="font-semibold text-white">{thread.booking.eventType}</p>
                      <p className="text-sm text-gray-400">
                        {thread.booking.venueName} • {new Date(thread.booking.eventDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>

        <Card className="bg-gray-800 border-champagne-gold/30 mb-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{thread.subject}</span>
              {!replying && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setReplyAll(false);
                      setReplying(true);
                    }}
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                  <Button
                    onClick={() => {
                      setReplyAll(true);
                      setReplying(true);
                    }}
                    variant="outline"
                    className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
                  >
                    <Reply className="w-4 h-4 mr-2 rotate-180" />
                    Reply All
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 mb-4 text-sm">
              <p className="text-gray-400">
                <strong>From:</strong> {thread.fromName || thread.fromEmail}
              </p>
              <p className="text-gray-400">
                <strong>To:</strong> {thread.toEmail}
              </p>
              <p className="text-gray-400">
                <strong>Inbox:</strong> {thread.inbox.name}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reply Form */}
        {replying && (
          <Card className="bg-gray-800 border-champagne-gold/30 mb-4">
            <CardHeader>
              <CardTitle>Reply</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>To</Label>
                <Input
                  value={thread.fromEmail}
                  disabled
                  className="bg-gray-900 text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label>Signature</Label>
                <select
                  value={signatureKey}
                  onChange={(e) =>
                    setSignatureKey(e.target.value as "none" | "ali" | "nige")
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                >
                  <option value="none">No signature</option>
                  <option value="ali">Ali signature</option>
                  <option value="nige">Nige signature</option>
                </select>
              </div>

              {/* Template Selector */}
              <div className="space-y-2">
                <Label>Use Template (optional)</Label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => {
                    setSelectedTemplateId(e.target.value);
                    handleTemplateSelect(e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                >
                  <option value="">Select a template...</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DJ Fee Input (if template selected or booking exists) */}
              {(selectedTemplateId || thread.booking) && (
                <div className="space-y-2">
                  <Label>DJ Fee (e.g., "£1100 + accommodation")</Label>
                  <Input
                    value={djFee}
                    onChange={async (e) => {
                      setDjFee(e.target.value);
                      // Re-process template if one is selected
                      if (selectedTemplateId) {
                        await handleTemplateSelect(selectedTemplateId);
                      }
                    }}
                    placeholder="£1100 + accommodation"
                    className="bg-gray-900 text-white border-gray-700"
                  />
                  <p className="text-xs text-gray-400">
                    This will replace {"{{djFee}}"} in the template
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={12}
                  placeholder="Type your reply or select a template above..."
                  className="bg-gray-900 text-white border-gray-700 font-mono text-sm"
                />
                <p className="text-xs text-gray-400">
                  You can edit the template content before sending. Variables like {"{{djFee}}"}, {"{{eventDate}}"} will be replaced automatically.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleReply}
                  disabled={sending || !replyText.trim()}
                  className="bg-champagne-gold text-black hover:bg-gold-light"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sending ? "Sending..." : "Send Reply"}
                </Button>
                <Button
                  onClick={() => {
                    setReplying(false);
                    setReplyText("");
                    setSelectedTemplateId("");
                    setDjFee("");
                    setSignatureKey("none");
                  }}
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Email Messages */}
        <div className="space-y-4">
          {thread.emails.map((email, index) => (
            <motion.div
              key={email.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`${
                  email.direction === "outbound"
                    ? "bg-champagne-gold/10 border-champagne-gold/50"
                    : "bg-gray-800 border-gray-700"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-white">
                        {email.direction === "outbound"
                          ? `You (${email.fromEmail || email.from})`
                          : email.fromName || email.fromEmail || email.from}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(email.receivedAt).toLocaleString()}
                      </p>
                    </div>
                    {email.sentByUser && (
                      <span className="text-xs text-gray-500">
                        Sent by {email.sentByUser.name}
                      </span>
                    )}
                  </div>

                  {email.htmlContent || email.bodyHtml ? (
                    <div
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: email.htmlContent || email.bodyHtml || "" }}
                    />
                  ) : (
                    <p className="text-white whitespace-pre-wrap">{email.textContent || email.bodyText}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
