"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const [messages, setMessages] = useState<CommsLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showSplitThread, setShowSplitThread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use refs to track polling state and prevent duplicate intervals
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const bookingIdRef = useRef(bookingId);

  // Update ref when bookingId changes
  useEffect(() => {
    bookingIdRef.current = bookingId;
  }, [bookingId]);

  // Fetch messages function using ref to avoid dependency issues
  const fetchMessages = useCallback(async () => {
    const currentBookingId = bookingIdRef.current;
    if (!currentBookingId) return;

    try {
      const response = await fetch(`/api/admin/bookings/${currentBookingId}/whatsapp-messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching WhatsApp messages:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - uses ref instead

  useEffect(() => {
    if (!bookingId) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Initial fetch
    fetchMessages();

    // Poll for new messages every 30 seconds (increased to reduce load)
    intervalRef.current = setInterval(() => {
      fetchMessages();
    }, 30000); // 30 seconds instead of 10

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [bookingId, fetchMessages]); // Keep fetchMessages but it's stable now

  useEffect(() => {
    // Only scroll within the container, not the whole page
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      // Only auto-scroll if user is near the bottom (hasn't manually scrolled up) or if it's the first load
      if (isNearBottom || messages.length === 0) {
        // Use setTimeout to ensure DOM is updated
        setTimeout(() => {
          if (container) {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    // Scroll within the container, not the whole page
    if (messagesContainerRef.current && messagesEndRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
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

  // Don't render if no phone number (after all hooks are called)
  if (!phoneNumber) {
    return null;
  }

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
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader className="bg-green-600 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <MessageCircle className="w-5 h-5" />
            WhatsApp Conversation
          </CardTitle>
          {phoneNumber && (
            <Button
              onClick={handleSplitThread}
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/20 bg-white/10"
            >
              <Split className="w-4 h-4 mr-2" />
              Split Thread
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Date Anchor - Prominently displayed at top */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200 p-4">
          <div className="flex items-center gap-2 text-green-700">
            <Calendar className="w-5 h-5" />
            <div>
              <p className="text-xs text-green-600 uppercase tracking-wide mb-1">Event Date</p>
              <p className="text-lg font-bold text-gray-900">{formatEventDate(eventDate)}</p>
            </div>
          </div>
        </div>

        {/* Messages Container - WhatsApp Style */}
        <div 
          ref={messagesContainerRef}
          className="h-[calc(100vh-24rem)] min-h-[400px] max-h-[600px] overflow-y-auto bg-[#0b141a] p-4 space-y-3"
        >
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

        {/* Reply Input - Large WhatsApp Reply Button - Sticky at bottom */}
        <div className="sticky bottom-0 border-t border-gray-700 p-4 bg-gray-900/95 backdrop-blur-sm">
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
