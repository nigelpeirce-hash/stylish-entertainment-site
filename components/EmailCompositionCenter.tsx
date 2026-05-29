"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Send, Loader2, Eye, Mail } from "lucide-react";
import {
  toVenueDisplay,
  toFeeDisplay,
  toDepositDisplay,
  toTalentDisplayList,
  toSafeDisplayString,
  toSafeReactChild,
} from "@/lib/transformers/booking-transformer";
import { SafeText } from "@/components/SafeText";

// sessionStorage-backed idempotency key for quote sends, scoped per booking.
// Lives in sessionStorage (not component state) so it survives modal close/open,
// page refresh and route remount within the same tab. A retry after a lost
// response therefore reuses the same key, letting the server dedupe the send.
// sessionStorage is per-tab, so two separate tabs remain independent by design.
const QUOTE_IDEMPOTENCY_PREFIX = "quote-send-idempotency:";

function getOrCreateQuoteIdempotencyKey(bookingId: string): string {
  if (typeof window === "undefined") return "";
  const storageKey = `${QUOTE_IDEMPOTENCY_PREFIX}${bookingId}`;
  let key = window.sessionStorage.getItem(storageKey);
  if (!key) {
    key =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem(storageKey, key);
  }
  return key;
}

function resetQuoteIdempotencyKey(bookingId: string): void {
  if (typeof window === "undefined") return;
  const storageKey = `${QUOTE_IDEMPOTENCY_PREFIX}${bookingId}`;
  window.sessionStorage.removeItem(storageKey);
  // Generate a fresh key so the next deliberate send/revision is a new attempt.
  getOrCreateQuoteIdempotencyKey(bookingId);
}

interface EmailCompositionCenterProps {
  bookingId: string;
  clientEmail: string;
  clientName: string;
  venueName: string;
  venueAddress?: string;
  venuePostcode?: string;
  eventDate: string;
  onSend?: () => void;
  bookingFee?: unknown;
  finalBalance?: unknown;
  depositReceived?: boolean | null;
  depositReceivedManual?: boolean | null;
  staffAssignments?: Array<{ id?: string; staff?: { name?: string }; role?: string }>;
}

interface DJ {
  id: string;
  name: string;
}

interface TemplateBlocks {
  intro: string;
  djSection: string;
  lightingSection: string;
  stylingSection: string;
  personalNote: string;
  closing: string;
}

export function EmailCompositionCenter({
  bookingId,
  clientEmail,
  clientName,
  venueName,
  venueAddress,
  venuePostcode,
  eventDate,
  onSend,
  bookingFee,
  finalBalance,
  depositReceived,
  depositReceivedManual,
  staffAssignments,
}: EmailCompositionCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [djs, setDjs] = useState<DJ[]>([]);
  const [selectedDJ, setSelectedDJ] = useState<string>("");
  const [fee, setFee] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Service checkboxes
  const [includeDJ, setIncludeDJ] = useState(false);
  const [includeLighting, setIncludeLighting] = useState(false);
  const [includeStyling, setIncludeStyling] = useState(false);

  // Safe date formatter - never render objects (avoids "Objects are not valid as React child")
  const formatEventDateSafe = (d: unknown): string => {
    if (d == null) return "";
    const date = typeof d === "string" || typeof d === "number" ? new Date(d) : new Date(String(d));
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  // Template blocks - use {{event_date}} placeholder (replaced at render via replaceVariables)
  const [templateBlocks, setTemplateBlocks] = useState<TemplateBlocks>({
    intro: `Dear {{client_name}},\n\nThank you for your enquiry for your event at {{venue}} on {{event_date}}.`,
    djSection: `**DJ Services**\n\nWe're delighted to offer our DJ services for your event. {{dj_name}} will be providing the music and entertainment, ensuring your guests have an unforgettable experience.\n\nDJ Fee: £{{fee}}`,
    lightingSection: `**Lighting Design**\n\nOur lighting design service will transform your venue with elegant, sophisticated lighting that complements your event's atmosphere. We'll work with you to create the perfect ambiance.\n\nLighting Fee: £{{fee}}`,
    stylingSection: `**Venue Styling**\n\nOur venue styling service includes elegant table settings, decorative elements and overall venue transformation to match your vision.\n\nStyling Fee: £{{fee}}`,
    personalNote: "",
    closing: `If you have any questions or would like to discuss any of these details further, please don't hesitate to get in touch.\n\nKind Regards, Ali & Nige`,
  });

  // Fetch DJs when dialog opens
  useEffect(() => {
    if (isOpen && djs.length === 0) {
      fetch("/api/djs")
        .then((res) => res.json())
        .then((data) => {
          if (data.djs) {
            setDjs(data.djs);
          }
        })
        .catch((err) => {
          console.error("Error fetching DJs:", err);
          setError("Failed to load DJs");
        });
    }
  }, [isOpen, djs.length]);

  // Sync fee state from bookingFee when dialog opens (always use safe string – never store objects)
  useEffect(() => {
    if (isOpen) {
      const safe = toFeeDisplay(bookingFee) || toSafeDisplayString(bookingFee) || "";
      setFee((prev) => (prev === "" ? safe : prev));
    }
  }, [isOpen, bookingFee]);

  // Ensure we never render objects as React children (avoids "Objects are not valid as React child")
  const safeStr = (v: unknown): string => toSafeDisplayString(v);
  // Never render an object as React child (e.g. booking.bookingFee as { fee } from API)
  const feeStr: string = typeof fee === "string" ? fee : (typeof fee === "number" ? String(fee) : safeStr(fee));

  // Replace variables in text - always use safeStr/safe formatters to avoid rendering objects
  const replaceVariables = (text: string): string => {
    return text
      .replace(/\{\{client_name\}\}/g, safeStr(clientName))
      .replace(/\{\{venue\}\}/g, safeStr(venueName))
      .replace(/\{\{dj_name\}\}/g, selectedDJ ? (djs.find((d) => d.id === selectedDJ)?.name || "TBC") : "TBC")
      .replace(/\{\{fee\}\}/g, feeStr || "0.00")
      .replace(/\{\{event_date\}\}/g, formatEventDateSafe(eventDate) || "your event date");
  };

  // Build the final email content
  const buildEmailContent = (): string => {
    let content = "";

    // Intro
    content += replaceVariables(templateBlocks.intro) + "\n\n";

    // DJ Section
    if (includeDJ) {
      content += replaceVariables(templateBlocks.djSection) + "\n\n";
    }

    // Lighting Section
    if (includeLighting) {
      content += replaceVariables(templateBlocks.lightingSection) + "\n\n";
    }

    // Styling Section
    if (includeStyling) {
      content += replaceVariables(templateBlocks.stylingSection) + "\n\n";
    }

    // Personal Note
    if (templateBlocks.personalNote.trim()) {
      content += replaceVariables(templateBlocks.personalNote) + "\n\n";
    }

    // Closing
    content += replaceVariables(templateBlocks.closing);

    return content;
  };

  // Convert markdown-style formatting to HTML
  const convertToHTML = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  };

  // Get preview HTML
  const getPreviewHTML = (): string => {
    const content = buildEmailContent();
    const htmlContent = convertToHTML(content);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              font-size: 16px;
              line-height: 1.6;
              color: #1A1A1A;
              background-color: #ffffff;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-top: 2px solid #000000;
              padding: 30px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #000000;
              color: #FFFFFF;
              text-decoration: none;
              border-radius: 2px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin: 20px 0;
            }
            .signature {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e5e5;
              font-size: 14px;
              color: #555555;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            ${htmlContent}
          </div>
        </body>
      </html>
    `;
  };

  // Send email
  const handleSend = async () => {
    const f = feeStr.trim();
    if (!f || parseFloat(f) <= 0) {
      setError("Please enter a valid fee");
      return;
    }

    setSending(true);
    setError("");

    try {
      // Reused across modal close/open, refresh and route remount within this tab.
      const idempotencyKey = getOrCreateQuoteIdempotencyKey(bookingId);
      const response = await fetch("/api/admin/send-composed-email/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          idempotencyKey,
          clientEmail,
          clientName,
          venueName,
          eventDate,
          selectedDJ,
          fee: parseFloat(f),
          emailContent: buildEmailContent(),
          emailHTML: getPreviewHTML(),
          services: {
            dj: includeDJ,
            lighting: includeLighting,
            styling: includeStyling,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email");
      }

      // Successful response: retire this attempt's key and mint a fresh one
      // so a future deliberate resend/revision is treated as a new send.
      resetQuoteIdempotencyKey(bookingId);
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        if (onSend) onSend();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
        >
          <Mail className="w-4 h-4 mr-2" />
          Email Composition Center
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-champagne-gold/30" aria-describedby="email-compose-desc">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-champagne-gold">
            Email Composition Center
          </DialogTitle>
          <DialogDescription id="email-compose-desc" className="sr-only">
            Compose and send a quoted email to the client with DJ, lighting, or styling options.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Left Column: Editor */}
          <div className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <Card className="bg-gray-800 border-gray-700 p-4">
                <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Client:</strong> <SafeText>{clientName ?? "N/A"}</SafeText></p>
                  <p><strong>Venue:</strong> <SafeText>{toVenueDisplay(venueName, venueAddress, venuePostcode) || "N/A"}</SafeText></p>
                  <p><strong>Date:</strong> <SafeText>{formatEventDateSafe(eventDate) || "—"}</SafeText></p>
                  <p><strong>Fee:</strong> {toSafeReactChild(bookingFee ?? fee ?? "N/A") || "—"}</p>
                  <p><strong>Deposit:</strong> {toDepositDisplay(depositReceived || depositReceivedManual, bookingFee ?? fee)}</p>
                  <div>
                    <strong>Talent Assigned:</strong>
                    {staffAssignments && staffAssignments.length > 0 ? (
                      <ul className="list-disc pl-4 mt-1">
                        {toTalentDisplayList(staffAssignments).map((t) => (
                          <li key={t.id}><SafeText>{t.name}</SafeText> (<SafeText>{t.role}</SafeText>)</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">No talent assigned</p>
                    )}
                  </div>
                </div>
              </Card>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-4">
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dj"
                    checked={includeDJ}
                    onCheckedChange={(checked) => setIncludeDJ(checked as boolean)}
                  />
                  <Label htmlFor="dj" className="cursor-pointer">Include DJ Services</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lighting"
                    checked={includeLighting}
                    onCheckedChange={(checked) => setIncludeLighting(checked as boolean)}
                  />
                  <Label htmlFor="lighting" className="cursor-pointer">Include Lighting Design</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="styling"
                    checked={includeStyling}
                    onCheckedChange={(checked) => setIncludeStyling(checked as boolean)}
                  />
                  <Label htmlFor="styling" className="cursor-pointer">Include Venue Styling</Label>
                </div>
              </div>
            </Card>

            {includeDJ && (
              <Card className="bg-gray-800 border-gray-700 p-4">
                <Label htmlFor="dj-select" className="text-sm font-medium mb-2 block">
                  Select DJ
                </Label>
                <select
                  id="dj-select"
                  value={selectedDJ}
                  onChange={(e) => setSelectedDJ(e.target.value)}
                  className="w-full h-10 rounded-md border border-gray-700 bg-gray-900 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                >
                  <option value="">Select a DJ</option>
                  {djs.map((dj) => (
                    <option key={dj.id} value={dj.id}>
                      {dj.name}
                    </option>
                  ))}
                </select>
              </Card>
            )}

            <Card className="bg-gray-800 border-gray-700 p-4">
              <Label htmlFor="fee" className="text-sm font-medium mb-2 block">
                Fee (£)
              </Label>
              <Input
                id="fee"
                type="text"
                inputMode="decimal"
                value={toSafeReactChild(feeStr)}
                onChange={(e) => setFee(String(e.target.value ?? ""))}
                placeholder="0.00"
                className="bg-gray-900 text-white border-gray-700"
              />
              <p className="text-xs text-gray-400 mt-1">
                This will replace {{fee}} in the email preview
              </p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-4">
              <Label htmlFor="personal-note" className="text-sm font-medium mb-2 block">
                Personal Note
              </Label>
              <Textarea
                id="personal-note"
                value={templateBlocks.personalNote}
                onChange={(e) =>
                  setTemplateBlocks({ ...templateBlocks, personalNote: e.target.value })
                }
                placeholder="Add any custom comments or notes about this client..."
                rows={6}
                className="bg-gray-900 text-white border-gray-700"
              />
            </Card>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-700 rounded text-red-300 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-900/20 border border-green-700 rounded text-green-300 text-sm">
                Email sent successfully! Quoted fee saved to booking.
              </div>
            )}

            <Button
              onClick={handleSend}
              disabled={sending || !feeStr.trim() || parseFloat(feeStr) <= 0}
              className="w-full bg-champagne-gold hover:bg-champagne-gold/80 text-gray-900"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>

          {/* Right Column: Live Preview */}
          <div className="space-y-4">
            <Card className="bg-gray-800 border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Live Preview</h3>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
              <div className="border border-gray-700 rounded-lg overflow-hidden bg-white">
                <iframe
                  srcDoc={getPreviewHTML()}
                  className="w-full h-[600px] border-0"
                  title="Email Preview"
                  sandbox="allow-same-origin"
                />
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
