"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Calendar, Split, Image as ImageIcon, Download } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface CommsLog {
  id: string;
  direction: "inbound" | "outbound";
  message: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  mediaFileName: string | null;
  createdAt: string;
  contactName: string | null;
  sentByUser: {
    name: string | null;
  } | null;
}

interface WhatsAppThreadProps {
  bookingId: string;
  phoneNumber: string | null;
  eventDate: string;
  clientName: string;
}

export function WhatsAppThread({ bookingId, phoneNumber, eventDate, clientName }: WhatsAppThreadProps) {
  // Don't render if no phone number
  if (!phoneNumber) {
    return null;
  }
  const [messages, setMessages] = useState<CommsLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showSplitThread, setShowSplitThread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bookingId) {
      fetchMessages();
      // Poll for new messages every 5 seconds
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/whatsapp-messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching WhatsApp messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!replyText.trim() && !fileInputRef.current?.files?.[0]) return;
    if (!phoneNumber) {
      alert("Phone number not available");
      return;
    }

    setSending(true);
    try {
      const formData = new FormData();
      formData.append("message", replyText);
      formData.append("phoneNumber", phoneNumber);
      formData.append("bookingId", bookingId);

      const file = fileInputRef.current?.files?.[0];
      if (file) {
        formData.append("media", file);
      }

      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setReplyText("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        await fetchMessages();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to send message");
      }
    } catch (error: any) {
      alert(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleSplitThread = async () => {
    const newBookingId = prompt("Enter the Booking ID to move messages to:");
    if (!newBookingId) return;

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/split-whatsapp-thread`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newBookingId }),
      });

      if (response.ok) {
        alert("Messages moved successfully");
        await fetchMessages();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to split thread");
      }
    } catch (error: any) {
      alert(error.message || "Failed to split thread");
    }
  };

  const formatMessageTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return format(date, "HH:mm");
      } else if (diffInHours < 48) {
        return "Yesterday";
      } else {
        return format(date, "dd MMM yyyy");
      }
    } catch {
      return new Date(dateString).toLocaleTimeString();
    }
  };

  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "EEEE, d MMMM yyyy");
    } catch {
      return new Date(dateString).toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-800 border-champagne-gold/30">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">Loading WhatsApp messages...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-champagne-gold/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="w-5 h-5 text-green-500" />
            WhatsApp Conversation
          </CardTitle>
          {phoneNumber && (
            <Button
              onClick={handleSplitThread}
              variant="outline"
              size="sm"
              className="border-orange-500/50 text-orange-400 hover:bg-orange-900/20"
            >
              <Split className="w-4 h-4 mr-2" />
              Split Thread
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Date Anchor - Prominently displayed at top */}
        <div className="bg-gradient-to-r from-green-600/20 to-green-500/10 border-b border-green-500/30 p-4">
          <div className="flex items-center gap-2 text-green-400">
            <Calendar className="w-5 h-5" />
            <div>
              <p className="text-xs text-green-300/80 uppercase tracking-wide mb-1">Event Date</p>
              <p className="text-lg font-bold text-white">{formatEventDate(eventDate)}</p>
            </div>
          </div>
        </div>

        {/* Messages Container - WhatsApp Style */}
        <div className="h-[500px] overflow-y-auto bg-[#0b141a] p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-600" />
              <p>No WhatsApp messages yet</p>
              <p className="text-sm text-gray-600 mt-1">Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isOutbound = msg.direction === "outbound";
              const showDateSeparator =
                idx === 0 ||
                new Date(msg.createdAt).toDateString() !==
                  new Date(messages[idx - 1].createdAt).toDateString();

              return (
                <div key={msg.id}>
                  {showDateSeparator && (
                    <div className="text-center my-4">
                      <span className="bg-gray-700/50 text-gray-400 text-xs px-3 py-1 rounded-full">
                        {(() => {
                          try {
                            return format(new Date(msg.createdAt), "EEEE, d MMMM yyyy");
                          } catch {
                            return new Date(msg.createdAt).toLocaleDateString();
                          }
                        })()}
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex ${isOutbound ? "justify-end" : "justify-start"} mb-2`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 shadow-md ${
                        isOutbound
                          ? "bg-[#005c4b] text-white rounded-tr-none"
                          : "bg-[#202c33] text-white rounded-tl-none"
                      }`}
                    >
                      {/* Media Preview */}
                      {msg.mediaUrl && msg.mediaType === "image" && (
                        <div className="mb-2 rounded-lg overflow-hidden">
                          <a
                            href={msg.mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={msg.mediaUrl}
                              alt={msg.mediaFileName || "WhatsApp image"}
                              className="max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                              style={{ maxHeight: "300px" }}
                            />
                          </a>
                          {msg.mediaFileName && (
                            <div className="mt-1 text-xs opacity-75 flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              {msg.mediaFileName}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Message Text */}
                      {msg.message && (
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                      )}

                      {/* Timestamp and Status */}
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs opacity-70">
                          {formatMessageTime(msg.createdAt)}
                        </span>
                        {isOutbound && (
                          <span className="text-xs opacity-70">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Input - Large WhatsApp Reply Button */}
        <div className="border-t border-gray-700 p-4 bg-gray-900/50">
          <div className="space-y-3">
            {/* File Upload */}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    // File selected, can show preview if needed
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Add Image
              </Button>
              {fileInputRef.current?.files?.[0] && (
                <span className="text-xs text-gray-400">
                  {fileInputRef.current.files[0].name}
                </span>
              )}
            </div>

            {/* Message Input */}
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your message..."
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />

            {/* Send Button - Large and Prominent */}
            <Button
              onClick={handleSendMessage}
              disabled={sending || (!replyText.trim() && !fileInputRef.current?.files?.[0])}
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {sending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Reply via WhatsApp
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
