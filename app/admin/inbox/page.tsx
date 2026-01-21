"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  Settings,
  X,
  FileText,
  Inbox,
  Folder,
  RefreshCw,
} from "lucide-react";
import { isSuperAdmin } from "@/lib/admin-permissions";
import Link from "next/link";

interface EmailThread {
  id: string;
  subject: string;
  fromEmail: string;
  fromName: string | null;
  toEmail: string;
  source?: string; // "imap" or "portal"
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  lastMessageAt: string;
  inbox: { id: string; name: string; email: string };
  booking: { 
    id: string; 
    name: string; 
    eventType: string; 
    eventDate: string;
    status: string;
  } | null;
  user: { id: string; name: string; email: string } | null;
  _count: { emails: number };
  emails: Array<{
    id: string;
    subject: string;
    fromEmail: string;
    fromName: string | null;
    toEmail: string;
    textContent: string | null;
    htmlContent: string | null;
    bodyText: string | null;
    bodyHtml: string | null;
    direction: string;
    receivedAt: string;
  }>;
}

interface EmailTemplate {
  id: string;
  name: string;
  bodyHtml: string;
}

type FolderType = "unified" | "new-enquiries" | "ongoing-bookings" | "staff-comms" | "sent" | "all";
type ViewMode = "unified" | "account";

interface EmailInbox {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

// Account color mapping
function getAccountColor(inboxName: string, inboxEmail: string): { bg: string; border: string; name: string } {
  const nameLower = inboxName.toLowerCase();
  const emailLower = inboxEmail.toLowerCase();
  
  if (nameLower.includes("office") || emailLower.includes("office") || emailLower.includes("info@")) {
    return { bg: "bg-amber-50", border: "border-amber-400", name: "Gold" };
  }
  if (nameLower.includes("ali") || emailLower.includes("ali@")) {
    return { bg: "bg-gray-50", border: "border-gray-400", name: "Silver" };
  }
  if (nameLower.includes("enquir") || emailLower.includes("enquir")) {
    return { bg: "bg-orange-50", border: "border-orange-400", name: "Bronze" };
  }
  // Default
  return { bg: "bg-blue-50", border: "border-blue-400", name: "Blue" };
}

// Simplified status categories
function getEmailStatus(thread: EmailThread): "to-action" | "waiting-client" | "confirmed" {
  if (!thread.booking) return "to-action";
  
  const status = thread.booking.status.toLowerCase();
  if (status === "confirmed") return "confirmed";
  if (status === "pending" || status === "new") return "waiting-client";
  return "to-action";
}

// Categorize threads into folders
function categorizeThread(thread: EmailThread, folder: FolderType, accountId?: string | null): boolean {
  // Filter by account if specified
  if (accountId && thread.inbox.id !== accountId) return false;
  
  if (folder === "unified" || folder === "all") {
    // Unified inbox shows all threads from all accounts' INBOX folders
    return true;
  }
  if (folder === "sent") {
    // Check if last email is outbound
    const lastEmail = thread.emails?.[thread.emails.length - 1];
    return lastEmail?.direction === "outbound";
  }
  if (folder === "new-enquiries") {
    return !thread.booking || thread.booking.status === "pending";
  }
  if (folder === "ongoing-bookings") {
    return thread.booking !== null && thread.booking.status !== "confirmed";
  }
  if (folder === "staff-comms") {
    // Staff communications - could be based on sender domain or subject
    return thread.fromEmail.includes("@stylishentertainment") || 
           thread.subject.toLowerCase().includes("staff") ||
           thread.subject.toLowerCase().includes("brief");
  }
  return false;
}

export default function AdminInbox() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<FolderType>("unified");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [inboxes, setInboxes] = useState<EmailInbox[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pagination, setPagination] = useState({ skip: 0, take: 50, total: 0 });
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [replyInboxId, setReplyInboxId] = useState<string>("");
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [composing, setComposing] = useState(false);
  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    body: "",
    inboxId: "",
  });

  const isNigel = session?.user?.email && isSuperAdmin(session.user.email);

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
      fetchTemplates();
    }
  }, [status, session]);

  const fetchInboxes = async () => {
    try {
      const response = await fetch("/api/admin/inboxes");
      if (response.ok) {
        const data = await response.json();
        setInboxes(data.inboxes || []);
        // Auto-expand all accounts by default
        const accountIds = (data.inboxes || []).map((inbox: EmailInbox) => inbox.id);
        setExpandedAccounts(new Set(accountIds));
      }
    } catch (error) {
      console.error("Error fetching inboxes:", error);
    }
  };

  const fetchThreads = async (skip: number = 0, append: boolean = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    try {
      const response = await fetch(`/api/admin/threads?skip=${skip}&take=50`);
      if (response.ok) {
        const data = await response.json();
        const newThreads = (data.threads || []).map((thread: EmailThread) => ({
          ...thread,
          emails: [], // Will be loaded when thread is selected
        }));
        
        if (append) {
          setThreads((prev) => [...prev, ...newThreads]);
        } else {
          setThreads(newThreads);
        }
        
        if (data.pagination) {
          setPagination(data.pagination);
          setHasMore(data.pagination.hasMore || false);
        }
      }
    } catch (error) {
      console.error("Error fetching threads:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextSkip = pagination.skip + pagination.take;
    fetchThreads(nextSkip, true);
  };

  const fetchThreadDetails = async (threadId: string) => {
    try {
      const response = await fetch(`/api/admin/threads/${threadId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedThread(data.thread);
      }
    } catch (error) {
      console.error("Error fetching thread details:", error);
    }
  };

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

  const handleTemplateSelect = async (templateId: string) => {
    if (!templateId || !selectedThread) {
      setReplyText("");
      return;
    }

    try {
      const response = await fetch(`/api/admin/email-templates/${templateId}`);
      if (response.ok) {
        const data = await response.json();
        const template = data.template;
        
        // Prepare variables from booking if available
        const variables: any = {};
        if (selectedThread.booking) {
          const eventDate = new Date(selectedThread.booking.eventDate).toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          variables.eventDate = eventDate;
          variables.venueName = selectedThread.booking.name || "";
          variables.clientName = selectedThread.booking.name || "";
          variables.eventType = selectedThread.booking.eventType || "";
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
    if (!selectedThread || !replyText.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inboxId: replyInboxId || selectedThread.inbox.id, // Use smart-selected inbox
          to: replyTo || selectedThread.fromEmail,
          subject: replySubject || `Re: ${selectedThread.subject}`,
          html: replyText,
          text: replyText.replace(/<[^>]*>/g, ""),
          threadId: selectedThread.id,
          bookingId: selectedThread.booking?.id || undefined,
        }),
      });

      if (response.ok) {
        setReplying(false);
        setReplyText("");
        setReplySubject("");
        setReplyTo("");
        setSelectedTemplateId("");
        await fetchThreads();
        // Refresh selected thread
        const threadResponse = await fetch(`/api/admin/threads/${selectedThread.id}`);
        if (threadResponse.ok) {
          const threadData = await threadResponse.json();
          setSelectedThread(threadData.thread);
        }
      } else {
        const error = await response.json();
        alert(error.error || "Failed to send reply");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (threadId: string) => {
    try {
      const response = await fetch(`/api/admin/threads/${threadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: true }),
      });

      if (response.ok) {
        await fetchThreads();
        if (selectedThread?.id === threadId) {
          setSelectedThread(null);
        }
      }
    } catch (error) {
      console.error("Error archiving thread:", error);
    }
  };

  const filteredThreads = threads
    .filter((thread) => {
      // If unified view, show all threads
      if (selectedFolder === "unified") {
        return true;
      }
      // If account selected, filter by account
      if (selectedAccountId) {
        return categorizeThread(thread, selectedFolder, selectedAccountId);
      }
      return categorizeThread(thread, selectedFolder);
    })
    .filter((thread) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          thread.subject.toLowerCase().includes(query) ||
          thread.fromEmail.toLowerCase().includes(query) ||
          (thread.fromName && thread.fromName.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by last message date, newest first
      return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
    });

  const getStatusBadge = (status: "to-action" | "waiting-client" | "confirmed") => {
    const styles = {
      "to-action": "bg-orange-100 text-orange-700 border-orange-300",
      "waiting-client": "bg-blue-100 text-blue-700 border-blue-300",
      "confirmed": "bg-green-100 text-green-700 border-green-300",
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded border ${styles[status]}`}>
        {status === "to-action" ? "To Action" : status === "waiting-client" ? "Waiting for Client" : "Confirmed"}
      </span>
    );
  };

  const getEmailPreview = (thread: EmailThread): string => {
    // For preview, we'll use a simple placeholder since we don't load all emails in the list
    // The full content will be shown when thread is selected
    return "Click to view message...";
  };

  if ((status !== "authenticated" && status !== "unauthenticated") || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session || (session?.user as any)?.role !== "admin") {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">Mail</h1>
          {isNigel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Settings className="w-4 h-4 mr-2" />
              Advanced
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isNigel && showAdvanced && (
            <>
              <Link href="/admin/settings">
                <Button variant="ghost" size="sm" className="text-gray-600">
                  Sync Emails
                </Button>
              </Link>
              <Link href="/admin/email-audit">
                <Button variant="ghost" size="sm" className="text-gray-600">
                  Email Audit
                </Button>
              </Link>
            </>
          )}
          {composing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setComposing(false);
                setComposeData({ to: "", subject: "", body: "", inboxId: "" });
              }}
              className="text-gray-600"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setComposing(true);
                setSelectedThread(null);
                setReplying(false);
                // Default to first inbox
                if (inboxes.length > 0 && !composeData.inboxId) {
                  setComposeData({ ...composeData, inboxId: inboxes[0].id });
                }
              }}
              className="text-gray-600"
            >
              <Mail className="w-4 h-4 mr-2" />
              New Message
            </Button>
          )}
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
              onClick={() => {
                setSelectedFolder("unified");
                setSelectedAccountId(null);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-2 ${
                selectedFolder === "unified" && !selectedAccountId
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
              {inboxes.map((inbox) => {
                const isExpanded = expandedAccounts.has(inbox.id);
                const isSelected = selectedAccountId === inbox.id;
                const accountColor = getAccountColor(inbox.name, inbox.email);
                
                return (
                  <div key={inbox.id} className="mb-1">
                    <button
                      onClick={() => {
                        if (isExpanded) {
                          setExpandedAccounts((prev) => {
                            const next = new Set(prev);
                            next.delete(inbox.id);
                            return next;
                          });
                        } else {
                          setExpandedAccounts((prev) => new Set(prev).add(inbox.id));
                        }
                        setSelectedAccountId(inbox.id);
                        setSelectedFolder("all");
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            accountColor.bg.replace("bg-", "bg-").includes("amber")
                              ? "bg-amber-400"
                              : accountColor.bg.replace("bg-", "bg-").includes("gray")
                              ? "bg-gray-400"
                              : "bg-orange-400"
                          }`}
                          title={accountColor.name}
                        />
                        <span className="truncate">{inbox.name}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAccountId(inbox.id);
                            setSelectedFolder("all");
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                            isSelected && selectedFolder === "all"
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <Folder className="w-3 h-3 inline mr-2" />
                          Inbox
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAccountId(inbox.id);
                            setSelectedFolder("sent");
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                            isSelected && selectedFolder === "sent"
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <Folder className="w-3 h-3 inline mr-2" />
                          Sent
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Category Folders */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                Categories
              </div>
              <button
                onClick={() => {
                  setSelectedFolder("new-enquiries");
                  setSelectedAccountId(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFolder === "new-enquiries" && !selectedAccountId
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                New Enquiries
              </button>
              <button
                onClick={() => {
                  setSelectedFolder("ongoing-bookings");
                  setSelectedAccountId(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFolder === "ongoing-bookings" && !selectedAccountId
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Ongoing Bookings
              </button>
              <button
                onClick={() => {
                  setSelectedFolder("staff-comms");
                  setSelectedAccountId(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFolder === "staff-comms" && !selectedAccountId
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Staff Comms
              </button>
            </div>
          </nav>

          {/* Status Summary */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Status
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">To Action</span>
                <span className="text-gray-900 font-medium">
                  {threads.filter((t) => getEmailStatus(t) === "to-action").length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Waiting for Client</span>
                <span className="text-gray-900 font-medium">
                  {threads.filter((t) => getEmailStatus(t) === "waiting-client").length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Confirmed</span>
                <span className="text-gray-900 font-medium">
                  {threads.filter((t) => getEmailStatus(t) === "confirmed").length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Email List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-900">
              {filteredThreads.length} {filteredThreads.length === 1 ? "message" : "messages"}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                <Mail className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No messages</p>
              </div>
            ) : (
              <>
                {filteredThreads.map((thread) => {
                const emailStatus = getEmailStatus(thread);
                const preview = getEmailPreview(thread);
                
                return (
                  <button
                    key={thread.id}
                    onClick={() => {
                      fetchThreadDetails(thread.id);
                      setReplying(false);
                      // Smart reply: auto-select the inbox that received this email
                      setReplyInboxId(thread.inbox.id);
                    }}
                    className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors relative ${
                      selectedThread?.id === thread.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                    } ${!thread.isRead ? "bg-blue-50/50" : ""}`}
                  >
                    {/* Color indicator tab */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${
                        getAccountColor(thread.inbox.name, thread.inbox.email).bg.replace("bg-", "bg-").includes("amber")
                          ? "bg-amber-400"
                          : getAccountColor(thread.inbox.name, thread.inbox.email).bg.replace("bg-", "bg-").includes("gray")
                          ? "bg-gray-400"
                          : "bg-orange-400"
                      }`}
                      title={`${getAccountColor(thread.inbox.name, thread.inbox.email).name} - ${thread.inbox.name}`}
                    />
                    <div className="flex items-start justify-between mb-1 pl-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-sm font-semibold truncate ${
                            !thread.isRead ? "text-gray-900" : "text-gray-700"
                          }`}>
                            {thread.fromName || thread.fromEmail}
                          </span>
                          {thread.source === "portal" && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded border bg-purple-100 text-purple-700 border-purple-300">
                              Portal
                            </span>
                          )}
                          {getStatusBadge(emailStatus)}
                        </div>
                        <p className={`text-sm truncate mb-1 ${
                          !thread.isRead ? "text-gray-900 font-medium" : "text-gray-600"
                        }`}>
                          {thread.subject}
                        </p>
                        {preview && (
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {preview}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                        {new Date(thread.lastMessageAt).toLocaleDateString("en-GB", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </button>
                );
              })}
                {hasMore && (
                  <div className="p-4 border-t border-gray-200">
                    <Button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      variant="outline"
                      className="w-full text-sm"
                    >
                      {loadingMore ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Load More ({pagination.total - (pagination.skip + pagination.take)} remaining)
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Pane - Email Content */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden">
          {composing ? (
            /* Compose New Email */
            <div className="flex-1 flex flex-col">
              <div className="border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900">New Message</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-2xl space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">From</Label>
                    <select
                      value={composeData.inboxId}
                      onChange={(e) => setComposeData({ ...composeData, inboxId: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
                    >
                      <option value="">Select inbox...</option>
                      {inboxes.map((inbox) => (
                        <option key={inbox.id} value={inbox.id}>
                          {inbox.name} ({inbox.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">To</Label>
                    <Input
                      value={composeData.to}
                      onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                      placeholder="recipient@example.com"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">Subject</Label>
                    <Input
                      value={composeData.subject}
                      onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                      placeholder="Subject"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">Message</Label>
                    <Textarea
                      value={composeData.body}
                      onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                      rows={12}
                      className="text-sm font-sans"
                      placeholder="Type your message..."
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setComposing(false);
                        setComposeData({ to: "", subject: "", body: "", inboxId: "" });
                      }}
                      className="text-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={async () => {
                        if (!composeData.to || !composeData.subject || !composeData.body.trim()) {
                          alert("Please fill in all fields");
                          return;
                        }
                        // Use selected inbox or default to first inbox
                        const inboxId = composeData.inboxId || inboxes[0]?.id;
                        if (inboxId) {
                          const response = await fetch("/api/admin/email/send", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              inboxId,
                              to: composeData.to,
                              subject: composeData.subject,
                              html: composeData.body,
                              text: composeData.body.replace(/<[^>]*>/g, ""),
                            }),
                          });
                          if (response.ok) {
                            setComposing(false);
                            setComposeData({ to: "", subject: "", body: "", inboxId: "" });
                            await fetchThreads();
                          } else {
                            const error = await response.json();
                            alert(error.error || "Failed to send email");
                          }
                        } else {
                          alert("Please select an inbox to send from");
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedThread ? (
            <>
              {/* Email Header with Actions */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedThread.subject}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setReplying(true);
                        setReplyTo(selectedThread.fromEmail);
                        setReplySubject(`Re: ${selectedThread.subject}`);
                        // Smart reply: auto-select the inbox that received this email
                        setReplyInboxId(selectedThread.inbox.id);
                      }}
                      className="text-gray-700 hover:bg-gray-100"
                    >
                      <Reply className="w-4 h-4 mr-2" />
                      Reply
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-700 hover:bg-gray-100"
                    >
                      <Forward className="w-4 h-4 mr-2" />
                      Forward
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArchive(selectedThread.id)}
                      className="text-gray-700 hover:bg-gray-100"
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">From:</span> {selectedThread.fromName || selectedThread.fromEmail}
                  </p>
                  <p>
                    <span className="font-medium">To:</span> {selectedThread.toEmail}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(selectedThread.lastMessageAt).toLocaleString("en-GB", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Reply Compose Window */}
              {replying && (
                <div className="border-b border-gray-200 bg-gray-50 p-4">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-4 space-y-3">
                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">From</Label>
                        <select
                          value={replyInboxId}
                          onChange={(e) => setReplyInboxId(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
                        >
                          {inboxes.map((inbox) => (
                            <option key={inbox.id} value={inbox.id}>
                              {inbox.name} ({inbox.email})
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Automatically selected based on the inbox that received this email
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">To</Label>
                        <Input
                          value={replyTo}
                          onChange={(e) => setReplyTo(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">Subject</Label>
                        <Input
                          value={replySubject}
                          onChange={(e) => setReplySubject(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">Use Template</Label>
                        <select
                          value={selectedTemplateId}
                          onChange={(e) => {
                            setSelectedTemplateId(e.target.value);
                            handleTemplateSelect(e.target.value);
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
                        >
                          <option value="">None</option>
                          {templates.map((template) => (
                            <option key={template.id} value={template.id}>
                              {template.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">Message</Label>
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={8}
                          className="text-sm font-sans"
                          placeholder="Type your message..."
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setReplying(false);
                            setReplyText("");
                            setReplySubject("");
                            setSelectedTemplateId("");
                          }}
                          className="text-gray-700"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleReply}
                          disabled={!replyText.trim()}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-3xl space-y-6">
                  {selectedThread.emails && selectedThread.emails.length > 0 ? (
                    selectedThread.emails.map((email, index) => (
                    <div
                      key={email.id}
                      className={`p-4 rounded-lg border ${
                        email.direction === "outbound"
                          ? "bg-blue-50 border-blue-200"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {email.direction === "outbound"
                              ? "You"
                              : email.fromName || email.fromEmail}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(email.receivedAt).toLocaleString("en-GB")}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 prose prose-sm max-w-none">
                        {email.htmlContent || email.bodyHtml ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: email.htmlContent || email.bodyHtml || "",
                            }}
                          />
                        ) : (
                          <p className="whitespace-pre-wrap">
                            {email.textContent || email.bodyText}
                          </p>
                        )}
                      </div>
                    </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <p>Loading email content...</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Select a message to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
