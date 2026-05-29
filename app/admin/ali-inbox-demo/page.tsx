"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Search,
  Reply,
  Forward,
  Archive,
  Send,
  ChevronDown,
  ChevronRight,
  Inbox,
  Folder,
  AlertCircle,
} from "lucide-react";
import { motion } from "@/lib/motion";

interface DemoEmailThread {
  id: string;
  subject: string;
  fromEmail: string;
  fromName: string;
  toEmail: string;
  source: "imap" | "portal";
  isRead: boolean;
  status: "to-action" | "waiting-client" | "confirmed";
  lastMessageAt: string;
  accountColor: "gold" | "silver" | "bronze";
  accountName: string;
  preview: string;
  fullContent: string;
  booking?: {
    name: string;
    eventDate: string;
    eventType: string;
  };
}

export default function AliInboxDemo() {
  const [selectedFolder, setSelectedFolder] = useState<"unified" | "new-enquiries" | "ongoing-bookings" | "staff-comms" | "sent">("unified");
  const [selectedThread, setSelectedThread] = useState<DemoEmailThread | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Demo email threads
  const demoThreads: DemoEmailThread[] = [
    {
      id: "1",
      subject: "Wedding DJ Quote Request - 15th June 2024",
      fromEmail: "sarah.johnson@example.com",
      fromName: "Sarah Johnson",
      toEmail: "info@stylishentertainment.co.uk",
      source: "imap",
      isRead: false,
      status: "to-action",
      lastMessageAt: new Date().toISOString(),
      accountColor: "gold",
      accountName: "Office",
      preview: "Hi, we're planning our wedding for June 15th at The Grand Hotel. Could you please send us a quote for a DJ? We're expecting around 120 guests...",
      fullContent: `Hi,

We're planning our wedding for June 15th, 2024 at The Grand Hotel in London. We're expecting around 120 guests and would love to have a professional DJ for the evening reception.

Could you please send us a quote? We're looking for:
- Music from 7pm until midnight
- Microphone for speeches
- Lighting package

Looking forward to hearing from you!

Best regards,
Sarah & James Johnson`,
      booking: {
        name: "Sarah & James Johnson",
        eventDate: "2024-06-15",
        eventType: "wedding",
      },
    },
    {
      id: "2",
      subject: "Re: Final Details for Smith Wedding",
      fromEmail: "emma.smith@example.com",
      fromName: "Emma Smith",
      toEmail: "info@stylishentertainment.co.uk",
      source: "imap",
      isRead: true,
      status: "waiting-client",
      lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
      accountColor: "gold",
      accountName: "Office",
      preview: "Thank you for the final details! Just confirming that our DJ will arrive at 5pm as discussed. We're so excited...",
      fullContent: `Hi Ali,

Thank you for the final details! Just confirming that our DJ will arrive at 5pm as discussed. We're so excited for our big day!

One quick question - will the DJ be able to play our first dance song from a USB stick? We have a specific version we'd like to use.

Thanks again!
Emma`,
      booking: {
        name: "Emma & Tom Smith",
        eventDate: "2024-05-20",
        eventType: "wedding",
      },
    },
    {
      id: "3",
      subject: "New Message from Client Portal",
      fromEmail: "michael.brown@example.com",
      fromName: "Michael Brown",
      toEmail: "info@stylishentertainment.co.uk",
      source: "portal",
      isRead: false,
      status: "to-action",
      lastMessageAt: new Date(Date.now() - 7200000).toISOString(),
      accountColor: "silver",
      accountName: "Ali Business",
      preview: "Hi, I've uploaded some inspiration photos to the portal. Could you take a look and let me know if the lighting style would work?",
      fullContent: `Hi STYLISH Team,

I've uploaded some inspiration photos to the portal showing the kind of lighting and atmosphere we're hoping for. Could you take a look and let me know if this style would work for our venue?

The photos show a warm, romantic feel with soft uplighting. We're getting married in a marquee so there's plenty of space for effects.

Thanks!
Michael`,
      booking: {
        name: "Michael & Lisa Brown",
        eventDate: "2024-07-10",
        eventType: "wedding",
      },
    },
    {
      id: "4",
      subject: "DJ Availability Confirmation",
      fromEmail: "dj.mike@example.com",
      fromName: "DJ Mike",
      toEmail: "info@stylishentertainment.co.uk",
      source: "imap",
      isRead: true,
      status: "confirmed",
      lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
      accountColor: "bronze",
      accountName: "Enquiries",
      preview: "Hi Ali, just confirming I'm available for the Johnson wedding on June 15th. I've reviewed the brief and everything looks good...",
      fullContent: `Hi Ali,

Just confirming I'm available for the Johnson wedding on June 15th. I've reviewed the brief and everything looks good. I'll arrive at 4pm to set up.

I've noted the first dance song and the do-not-play list. Looking forward to it!

Best,
Mike`,
    },
    {
      id: "5",
      subject: "Venue Floor Plan Attached",
      fromEmail: "rebecca.taylor@example.com",
      fromName: "Rebecca Taylor",
      toEmail: "info@stylishentertainment.co.uk",
      source: "portal",
      isRead: true,
      status: "waiting-client",
      lastMessageAt: new Date(Date.now() - 172800000).toISOString(),
      accountColor: "gold",
      accountName: "Office",
      preview: "I've attached the floor plan for the venue. The DJ setup area is marked in red. Please let me know if you need any adjustments...",
      fullContent: `Hi,

I've attached the floor plan for the venue. The DJ setup area is marked in red on the diagram. Please let me know if you need any adjustments or have questions about the layout.

The venue has confirmed that power outlets are available in that area, and there's parking available at the rear of the building.

Thanks!
Rebecca`,
      booking: {
        name: "Rebecca & David Taylor",
        eventDate: "2024-08-05",
        eventType: "wedding",
      },
    },
  ];

  const filteredThreads = demoThreads.filter((thread) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        thread.subject.toLowerCase().includes(query) ||
        thread.fromEmail.toLowerCase().includes(query) ||
        thread.fromName.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getStatusBadge = (status: "to-action" | "waiting-client" | "confirmed") => {
    const styles = {
      "to-action": "bg-orange-100 text-orange-700 border-orange-300",
      "waiting-client": "bg-blue-100 text-blue-700 border-blue-300",
      "confirmed": "bg-green-100 text-green-700 border-green-300",
    };
    const labels = {
      "to-action": "To Action",
      "waiting-client": "Waiting for Client",
      "confirmed": "Confirmed",
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getAccountColorDot = (color: "gold" | "silver" | "bronze") => {
    const colors = {
      gold: "bg-amber-400",
      silver: "bg-gray-400",
      bronze: "bg-orange-400",
    };
    return <div className={`w-2 h-2 rounded-full ${colors[color]} flex-shrink-0`} />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">Mail</h1>
          <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded">📋 Demo Mode</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => alert("This is a demo. In the real inbox, this would open a compose window.")}
            className="text-gray-600"
          >
            <Mail className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Folders */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="pl-9 bg-gray-50 border-gray-200 text-sm"
              />
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-2">
            {/* Unified Inbox */}
            <button
              onClick={() => setSelectedFolder("unified")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-2 ${
                selectedFolder === "unified"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Inbox className="w-4 h-4 inline mr-2" />
              Unified Inbox
            </button>

            {/* Account Grouping */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                Accounts
              </div>
              
              {/* Office Account */}
              <div className="mb-1">
                <button
                  onClick={() => {
                    const isExpanded = expandedAccounts.has("office");
                    setExpandedAccounts((prev) => {
                      const next = new Set(prev);
                      if (isExpanded) {
                        next.delete("office");
                      } else {
                        next.add("office");
                      }
                      return next;
                    });
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between text-gray-700 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" title="Gold" />
                    <span className="truncate">Office</span>
                  </div>
                  {expandedAccounts.has("office") ? (
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  )}
                </button>
                {expandedAccounts.has("office") && (
                  <div className="ml-4 mt-1 space-y-1">
                    <button className="w-full text-left px-3 py-1.5 rounded text-xs transition-colors text-gray-600 hover:bg-gray-50">
                      <Folder className="w-3 h-3 inline mr-2" />
                      Inbox
                    </button>
                    <button className="w-full text-left px-3 py-1.5 rounded text-xs transition-colors text-gray-600 hover:bg-gray-50">
                      <Folder className="w-3 h-3 inline mr-2" />
                      Sent
                    </button>
                  </div>
                )}
              </div>

              {/* Ali Business Account */}
              <div className="mb-1">
                <button
                  onClick={() => {
                    const isExpanded = expandedAccounts.has("ali");
                    setExpandedAccounts((prev) => {
                      const next = new Set(prev);
                      if (isExpanded) {
                        next.delete("ali");
                      } else {
                        next.add("ali");
                      }
                      return next;
                    });
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between text-gray-700 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" title="Silver" />
                    <span className="truncate">Ali Business</span>
                  </div>
                  {expandedAccounts.has("ali") ? (
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  )}
                </button>
                {expandedAccounts.has("ali") && (
                  <div className="ml-4 mt-1 space-y-1">
                    <button className="w-full text-left px-3 py-1.5 rounded text-xs transition-colors text-gray-600 hover:bg-gray-50">
                      <Folder className="w-3 h-3 inline mr-2" />
                      Inbox
                    </button>
                    <button className="w-full text-left px-3 py-1.5 rounded text-xs transition-colors text-gray-600 hover:bg-gray-50">
                      <Folder className="w-3 h-3 inline mr-2" />
                      Sent
                    </button>
                  </div>
                )}
              </div>

              {/* Enquiries Account */}
              <div className="mb-1">
                <button
                  onClick={() => {
                    const isExpanded = expandedAccounts.has("enquiries");
                    setExpandedAccounts((prev) => {
                      const next = new Set(prev);
                      if (isExpanded) {
                        next.delete("enquiries");
                      } else {
                        next.add("enquiries");
                      }
                      return next;
                    });
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between text-gray-700 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" title="Bronze" />
                    <span className="truncate">Enquiries</span>
                  </div>
                  {expandedAccounts.has("enquiries") ? (
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  )}
                </button>
                {expandedAccounts.has("enquiries") && (
                  <div className="ml-4 mt-1 space-y-1">
                    <button className="w-full text-left px-3 py-1.5 rounded text-xs transition-colors text-gray-600 hover:bg-gray-50">
                      <Folder className="w-3 h-3 inline mr-2" />
                      Inbox
                    </button>
                    <button className="w-full text-left px-3 py-1.5 rounded text-xs transition-colors text-gray-600 hover:bg-gray-50">
                      <Folder className="w-3 h-3 inline mr-2" />
                      Sent
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Category Folders */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                Categories
              </div>
              <button
                onClick={() => setSelectedFolder("new-enquiries")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedFolder === "new-enquiries"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                New Enquiries
              </button>
              <button
                onClick={() => setSelectedFolder("ongoing-bookings")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedFolder === "ongoing-bookings"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Ongoing Bookings
              </button>
              <button
                onClick={() => setSelectedFolder("staff-comms")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedFolder === "staff-comms"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Staff Comms
              </button>
              <button
                onClick={() => setSelectedFolder("sent")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedFolder === "sent"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Sent
              </button>
            </div>
          </nav>
        </div>

        {/* Middle Column - Email List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <div className="text-sm text-gray-600">
              {filteredThreads.length} {filteredThreads.length === 1 ? "message" : "messages"}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredThreads.map((thread) => (
              <motion.button
                key={thread.id}
                onClick={() => {
                  setSelectedThread(thread);
                  setReplying(false);
                }}
                className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedThread?.id === thread.id ? "bg-blue-50" : ""
                }`}
                whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
              >
                <div className="flex items-start gap-2 mb-1">
                  {getAccountColorDot(thread.accountColor)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-semibold truncate ${!thread.isRead ? "text-gray-900" : "text-gray-600"}`}>
                        {thread.fromName}
                      </span>
                      {thread.source === "portal" && (
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded border border-purple-300">
                          Portal
                        </span>
                      )}
                      {!thread.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className={`text-sm truncate mb-1 ${!thread.isRead ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                      {thread.subject}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {thread.preview}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(thread.status)}
                      <span className="text-xs text-gray-400">
                        {formatDate(thread.lastMessageAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Pane - Email Content */}
        <div className="flex-1 bg-white flex flex-col">
          {selectedThread ? (
            <>
              {/* Email Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedThread.subject}
                    </h2>
                    <div className="flex items-center gap-2 mb-2">
                      {getAccountColorDot(selectedThread.accountColor)}
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">{selectedThread.fromName}</span>
                        {" <"}
                        {selectedThread.fromEmail}
                        {">"}
                      </span>
                      {selectedThread.source === "portal" && (
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded border border-purple-300">
                          Portal
                        </span>
                      )}
                    </div>
                    {selectedThread.booking && (
                      <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <p className="text-xs text-blue-700">
                          <span className="font-medium">Booking:</span> {selectedThread.booking.name} - {selectedThread.booking.eventType} on{" "}
                          {new Date(selectedThread.booking.eventDate).toLocaleDateString("en-GB", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedThread.status)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplying(!replying);
                      if (!replying) {
                        setReplyText("");
                      }
                    }}
                    className="text-gray-700"
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert("This is a demo. Forward functionality would be available in the real inbox.")}
                    className="text-gray-700"
                  >
                    <Forward className="w-4 h-4 mr-2" />
                    Forward
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert("This is a demo. Archive functionality would be available in the real inbox.")}
                    className="text-gray-700"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </Button>
                </div>
              </div>

              {/* Email Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {selectedThread.fullContent}
                  </div>
                </div>
              </div>

              {/* Reply Section */}
              {replying && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="mb-4">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Reply to {selectedThread.fromName}
                    </Label>
                    <div className="mb-4">
                      <Label className="text-xs text-gray-600 mb-1 block">Use Template</Label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                        onChange={(e) => {
                          if (e.target.value) {
                            alert(`This is a demo. In the real inbox, this would load the "${e.target.value}" template.`);
                          }
                        }}
                      >
                        <option value="">Select a template...</option>
                        <option value="final-brief">Final Brief</option>
                        <option value="booking-confirmation">Booking Confirmation</option>
                        <option value="follow-up">Follow Up</option>
                      </select>
                    </div>
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      className="min-h-[200px] bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        alert("This is a demo. In the real inbox, this would send the reply.");
                        setReplying(false);
                        setReplyText("");
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setReplying(false);
                        setReplyText("");
                      }}
                      className="text-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Select an email to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
