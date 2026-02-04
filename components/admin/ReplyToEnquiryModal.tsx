"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { getGreetingName } from "@/lib/utils/name-helpers";

export interface ReplyEnquiry {
  id: string;
  name: string;
  email: string;
  eventDate: string;
  venueName?: string | null;
  venuePostcode?: string | null;
  source?: string;
  [key: string]: unknown;
}

interface ReplyToEnquiryModalProps {
  enquiry: ReplyEnquiry;
  open: boolean;
  onClose: () => void;
  onSent?: () => void;
}

const STANDARD_BODY_SNIPPET =
  "Thanks for your enquiry about [venue] on [date]. If you have any questions or would like to discuss further, please don't hesitate to get in touch.";

export function ReplyToEnquiryModal({
  enquiry,
  open,
  onClose,
  onSent,
}: ReplyToEnquiryModalProps) {
  const [customIntro, setCustomIntro] = useState("");
  const [sending, setSending] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewSubject, setPreviewSubject] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const { toast, toastState } = useToast();

  const greetingName = getGreetingName(enquiry.name || "") || "there";
  const venue = (enquiry.venueName || "your venue").trim();
  const dateStr = (() => {
    try {
      const d = new Date(enquiry.eventDate);
      return isNaN(d.getTime())
        ? "your event date"
        : d.toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
    } catch {
      return "your event date";
    }
  })();

  const handlePreview = useCallback(async () => {
    setLoadingPreview(true);
    setPreviewHtml(null);
    setPreviewSubject(null);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry.id}/reply/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customIntro }),
      });
      const data = await res.json();
      if (res.ok) {
        setPreviewHtml(data.html);
        setPreviewSubject(data.subject);
      } else {
        toast({
          title: "Preview failed",
          description: data.error || "Could not generate preview",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Preview failed",
        description: (e as Error)?.message ?? "Network error",
        variant: "destructive",
      });
    } finally {
      setLoadingPreview(false);
    }
  }, [enquiry.id, customIntro, toast]);

  const handleSend = useCallback(async () => {
    if (!enquiry.email?.trim()) {
      toast({
        title: "Cannot send",
        description: "Enquiry has no email address",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customIntro }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast({
          title: "Reply sent",
          description: `Email sent to ${enquiry.email}`,
        });
        setCustomIntro("");
        setPreviewHtml(null);
        setPreviewSubject(null);
        onClose();
        onSent?.();
      } else {
        toast({
          title: "Send failed",
          description: data.error || "Failed to send email",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Send failed",
        description: (e as Error)?.message ?? "Network error",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  }, [enquiry.id, enquiry.email, customIntro, onClose, onSent, toast]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-champagne-gold/30"
        aria-describedby="reply-enquiry-desc"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-champagne-gold">
            Reply to Enquiry
          </DialogTitle>
          <DialogDescription id="reply-enquiry-desc">
            Compose a reply to {enquiry.name} at {enquiry.email}. Your message will appear between
            the salutation and the standard reply.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Salutation preview */}
          <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Salutation</p>
            <p className="text-white font-medium">Hi {greetingName},</p>
          </div>

          {/* — Your message — */}
          <div>
            <p className="text-xs text-champagne-gold/90 font-medium mb-2">— Your message —</p>
            <Textarea
              value={customIntro}
              onChange={(e) => setCustomIntro(e.target.value)}
              placeholder="Add your personal message here (optional). Plain text only – line breaks are preserved."
              rows={5}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 resize-none"
            />
          </div>

          {/* — Standard reply — */}
          <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              — Standard reply —
            </p>
            <p className="text-sm text-gray-400 line-clamp-2">
              {STANDARD_BODY_SNIPPET.replace("[venue]", venue).replace("[date]", dateStr)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
              disabled={loadingPreview}
              className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
            >
              {loadingPreview ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              Preview
            </Button>
            <Button
              onClick={handleSend}
              disabled={sending || !enquiry.email?.trim()}
              className="bg-champagne-gold text-black hover:bg-champagne-gold/90"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send Reply
            </Button>
          </div>

          {/* Preview area */}
          {previewHtml && (
            <div className="mt-4 border border-gray-700 rounded-lg overflow-hidden">
              {previewSubject && (
                <p className="text-xs text-gray-500 px-3 py-2 bg-gray-800 border-b border-gray-700">
                  Subject: {previewSubject}
                </p>
              )}
              <iframe
                srcDoc={previewHtml}
                title="Email preview"
                className="w-full h-[400px] border-0 bg-white"
                sandbox="allow-same-origin"
              />
            </div>
          )}
        </div>

        <Toast toast={toastState} onClose={() => {}} />
      </DialogContent>
    </Dialog>
  );
}
