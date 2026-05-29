"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "@/lib/motion";
import { Mail, ArrowLeft, Search, Calendar, Send, Paperclip, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  clientDashboardPath,
  clientMessageThreadPath,
  loginPath,
} from "@/lib/portal-paths";

interface EmailThread {
  id: string;
  subject: string;
  fromEmail: string;
  toEmail: string;
  lastMessageAt: string;
  _count: { emails: number };
  booking: { id: string; eventType: string; eventDate: string } | null;
}

export default function ClientMessages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(loginPath());
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchThreads();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, search]);

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);

      const response = await fetch(`/api/client/threads?${params.toString()}`);
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

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Messages</h1>
              <p className="text-gray-400">Your email conversations with us</p>
            </div>
            <Link href={clientDashboardPath()}>
              <Button variant="outline" className="border-champagne-gold text-champagne-gold">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setTimeout(() => fetchThreads(), 500);
              }}
              placeholder="Search messages..."
              className="bg-gray-800 text-white border-gray-700 pl-10"
            />
          </div>
        </motion.div>

        {/* Direct Message Component */}
        <DirectMessageForm bookingId={null} />

        <div className="space-y-2">
          {threads.length === 0 ? (
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardContent className="p-12 text-center">
                <Mail className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-lg">No messages yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Your email conversations will appear here
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
                <Link href={clientMessageThreadPath(thread.id)}>
                  <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-champagne-gold" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-white truncate">
                              {thread.subject}
                            </h3>
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(thread.lastMessageAt).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-sm text-gray-400 mb-2">
                            To: {thread.toEmail}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{thread._count.emails} message{thread._count.emails !== 1 ? "s" : ""}</span>
                            {thread.booking && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {thread.booking.eventType} - {new Date(thread.booking.eventDate).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
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

// Direct Message Form Component
function DirectMessageForm({ bookingId }: { bookingId: string | null }) {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<Array<{ file: File; preview?: string }>>([]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach((file) => {
      // Only allow PDFs and images
      if (
        file.type.startsWith("image/") ||
        file.type === "application/pdf" ||
        file.name.endsWith(".pdf")
      ) {
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum size is 10MB.`);
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachments((prev) => [
            ...prev,
            {
              file,
              preview: file.type.startsWith("image/") ? e.target?.result as string : undefined,
            },
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        alert(`${file.name} is not a supported file type. Please upload PDFs or images only.`);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) {
      alert("Please enter a message or attach a file");
      return;
    }

    setSending(true);
    setSuccess(false);

    try {
      // Convert attachments to base64
      const attachmentData = await Promise.all(
        attachments.map(async (att) => ({
          filename: att.file.name,
          contentType: att.file.type,
          size: att.file.size,
          data: await convertFileToBase64(att.file),
        }))
      );

      const response = await fetch("/api/client/portal-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          bookingId,
          attachments: attachmentData,
        }),
      });

      if (response.ok) {
        setMessage("");
        setAttachments([]);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          // Refresh threads
          window.location.reload();
        }, 2000);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred while sending your message");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-champagne-gold/30 mb-6">
      <CardHeader>
        <CardTitle className="text-xl text-white">Message the STYLISH Team</CardTitle>
        <p className="text-sm text-gray-400 mt-1">
          Send us a message directly through your portal. We'll respond as soon as possible.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows={6}
            className="bg-gray-900 text-white border-gray-700 placeholder:text-gray-500 resize-none"
          />
        </div>

        {/* File Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
            dragActive
              ? "border-champagne-gold bg-champagne-gold/10"
              : "border-gray-700 bg-gray-900/50"
          }`}
        >
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <Paperclip className="w-4 h-4" />
            <span>Drag and drop files here, or</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-champagne-gold hover:text-champagne-gold/80 underline"
            >
              browse
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            PDFs and images only. Maximum 10MB per file.
          </p>
        </div>

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Attachments:</p>
            <div className="flex flex-wrap gap-2">
              {attachments.map((att, index) => (
                <div
                  key={index}
                  className="relative bg-gray-900 border border-gray-700 rounded p-2 flex items-center gap-2"
                >
                  {att.preview ? (
                    <Image
                      src={att.preview}
                      alt={att.file.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <Paperclip className="w-8 h-8 text-gray-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{att.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(att.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {success && <span className="text-green-400">✓ Message sent successfully!</span>}
          </p>
          <Button
            onClick={handleSend}
            disabled={sending || (!message.trim() && attachments.length === 0)}
            className="bg-champagne-gold text-black hover:bg-gold-light"
          >
            <Send className="w-4 h-4 mr-2" />
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
