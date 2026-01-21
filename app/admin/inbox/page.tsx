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
  FolderOpen,
  Move,
  Star,
  Flag,
} from "lucide-react";
import { isSuperAdmin } from "@/lib/admin-permissions";
import Link from "next/link";
import { Toast } from "@/components/ui/toast";

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
  inbox?: { id: string; name: string; email: string };
  EmailInbox?: { id: string; name: string; email: string };
  booking?: { 
    id: string; 
    name: string; 
    eventType: string; 
    eventDate: string;
    status: string;
  } | null;
  Booking?: { 
    id: string; 
    name: string; 
    eventType: string; 
    eventDate: string;
    status: string;
  } | null;
  user?: { id: string; name: string; email: string } | null;
  User?: { id: string; name: string; email: string } | null;
  _count?: { emails: number; Email?: number };
  emails?: Array<{
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
  Email?: Array<{
    id: string;
    subject: string;
    fromEmail: string;
    fromName: string | null;
    textContent: string | null;
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
  lastSyncedAt?: string | null;
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
  const booking = thread.Booking || thread.booking;
  if (!booking) return "to-action";
  
  const status = booking.status?.toLowerCase() || "";
  if (status === "confirmed") return "confirmed";
  if (status === "pending" || status === "new") return "waiting-client";
  return "to-action";
}

// Check if email is from a VIP/Venue
function isVenueEmail(thread: EmailThread): boolean {
  const email = thread.fromEmail.toLowerCase();
  return email.includes('sohohouse.com') || email.includes('babingtonhouse.co.uk');
}

// Recursive Folder Tree Component
function FolderTree({
  folders,
  onSelect,
  expandedFolders,
  setExpandedFolders,
  level = 0,
}: {
  folders: any[];
  onSelect: (folderId: string) => void;
  expandedFolders: Set<string>;
  setExpandedFolders: (setter: (prev: Set<string>) => Set<string>) => void;
  level?: number;
}) {
  return (
    <div className="space-y-1">
      {folders.map((folder) => {
        const hasChildren = folder.children && folder.children.length > 0;
        const isExpanded = expandedFolders.has(folder.id);
        
        return (
          <div key={folder.id}>
            <button
              onClick={() => {
                if (hasChildren) {
                  setExpandedFolders((prev) => {
                    const next = new Set(prev);
                    if (isExpanded) {
                      next.delete(folder.id);
                    } else {
                      next.add(folder.id);
                    }
                    return next;
                  });
                } else {
                  onSelect(folder.id);
                }
              }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                level > 0 ? `pl-${(level + 1) * 4}` : ""
              } ${
                hasChildren
                  ? "text-gray-300 hover:bg-[#252525]"
                  : "text-gray-400 hover:bg-[#252525] hover:text-white cursor-pointer"
              }`}
              style={{ paddingLeft: `${(level + 1) * 12}px` }}
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className="w-3 h-3 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                )
              ) : (
                <div className="w-3 h-3 flex-shrink-0" />
              )}
              {isExpanded && hasChildren ? (
                <FolderOpen className="w-4 h-4 flex-shrink-0" />
              ) : (
                <Folder className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="flex-1 truncate">{folder.name}</span>
              {folder.unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-[#D4AF37] text-black">
                  {folder.unreadCount}
                </span>
              )}
            </button>
            {hasChildren && isExpanded && (
              <FolderTree
                folders={folder.children}
                onSelect={onSelect}
                expandedFolders={expandedFolders}
                setExpandedFolders={setExpandedFolders}
                level={level + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Categorize threads into folders
function categorizeThread(thread: EmailThread, folder: FolderType, accountId?: string | null): boolean {
  // Filter by account if specified
  const inbox = thread.EmailInbox || thread.inbox;
  if (accountId && inbox?.id !== accountId) return false;
  
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
    const booking = thread.Booking || thread.booking;
    return !booking || booking.status === "pending";
  }
  if (folder === "ongoing-bookings") {
    const booking = thread.Booking || thread.booking;
    return booking !== null && booking.status !== "confirmed";
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
  const [toast, setToast] = useState<{ id: string; message: string; type: "success" | "error" | "info" } | null>(null);
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
  const [folders, setFolders] = useState<Record<string, any[]>>({}); // inboxId -> folder tree
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncingInboxId, setSyncingInboxId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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
      fetchThreads(0, false); // Reset to first page
      fetchTemplates();
    }
  }, [status, session]);

  // Fetch folders when inboxes are loaded
  useEffect(() => {
    if (inboxes.length > 0) {
      inboxes.forEach((inbox) => {
        fetchFolders(inbox.id);
      });
    }
  }, [inboxes]);

  // Reset pagination when filters change
  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      fetchThreads(0, false); // Reset to first page when filters change
    }
  }, [selectedFolder, selectedAccountId, searchQuery]);

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

  // Get the most recent sync time from all inboxes
  const getLastSyncTime = (): string | null => {
    const syncTimes = inboxes
      .filter(inbox => inbox.lastSyncedAt)
      .map(inbox => new Date(inbox.lastSyncedAt!).getTime())
      .sort((a, b) => b - a);
    
    if (syncTimes.length === 0) return null;
    
    const mostRecent = new Date(syncTimes[0]);
    const now = new Date();
    const diffMs = now.getTime() - mostRecent.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return mostRecent.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchThreads = async (skip: number = 0, append: boolean = false, showOverlay: boolean = false) => {
    if (append) {
      setLoadingMore(true);
    } else if (showOverlay) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      // Explicitly filter out archived threads
      const response = await fetch(`/api/admin/threads?skip=${skip}&take=50&isArchived=false`);
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
      setRefreshing(false);
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

  const fetchFolders = async (inboxId: string) => {
    try {
      const response = await fetch(`/api/admin/inboxes/${inboxId}/folders`);
      if (response.ok) {
        const data = await response.json();
        setFolders((prev) => ({ ...prev, [inboxId]: data.folders || [] }));
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const handleMoveToFolder = async (threadId: string, folderId: string) => {
    try {
      const response = await fetch(`/api/admin/threads/${threadId}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId }),
      });

      if (response.ok) {
        // Optimistic UI: update thread immediately
        setThreads((prev) =>
          prev.map((t) => (t.id === threadId ? { ...t, folderId } : t))
        );
        
        setToast({
          id: Date.now().toString(),
          message: "Message moved successfully",
          type: "success",
        });
        setShowMoveMenu(false);
        
        // Refresh folders to update counts
        if (selectedThread?.EmailInbox?.id || selectedThread?.inbox?.id) {
          const inboxId = selectedThread.EmailInbox?.id || selectedThread.inbox?.id;
          if (inboxId) fetchFolders(inboxId);
        }
      } else {
        setToast({
          id: Date.now().toString(),
          message: "Failed to move message",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error moving thread:", error);
      setToast({
        id: Date.now().toString(),
        message: "Error moving message",
        type: "error",
      });
    }
  };

  const handleSync = async (inboxId?: string, deepSync: boolean = false) => {
    // If no inboxId provided, sync all active inboxes
    const inboxesToSync = inboxId 
      ? [inboxes.find(i => i.id === inboxId)].filter(Boolean)
      : inboxes.filter(i => i.isActive && i.syncEnabled);

    if (inboxesToSync.length === 0) {
      setToast({
        id: Date.now().toString(),
        message: "No inboxes to sync",
        type: "error",
      });
      return;
    }

    setSyncing(true);
    
    try {
      const syncPromises = inboxesToSync.map(async (inbox) => {
        if (!inbox) return;
        setSyncingInboxId(inbox.id);
        
        const response = await fetch("/api/admin/email/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inboxId: inbox.id, deepSync }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(errorData.error || `Sync failed for ${inbox.name}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || `Sync failed for ${inbox.name}`);
        }

        return result;
      });

      const results = await Promise.all(syncPromises);
      const totalCount = results.reduce((sum, r) => sum + (r?.count || 0), 0);

      setToast({
        id: Date.now().toString(),
        message: `Inbox updated successfully${totalCount > 0 ? `: ${totalCount} emails synced` : ""}`,
        type: "success",
      });

      // Refresh data without redirecting - use overlay instead of clearing screen
      await fetchThreads(0, false, true);
      await fetchInboxes();
      
      // Refresh folders for all synced inboxes (including Ali's folders)
      for (const inbox of inboxesToSync) {
        if (inbox) {
          await fetchFolders(inbox.id);
        }
      }
      
      // Use router.refresh() for Next.js cache invalidation (no white flash)
      router.refresh();
    } catch (error: any) {
      console.error("Error syncing:", error);
      setToast({
        id: Date.now().toString(),
        message: error.message || "Failed to sync inboxes",
        type: "error",
      });
    } finally {
      setSyncing(false);
      setSyncingInboxId(null);
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
        const booking = selectedThread.Booking || selectedThread.booking;
        if (booking) {
          const eventDate = booking.eventDate ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }) : "";
          variables.eventDate = eventDate;
          variables.venueName = booking.name || "";
          variables.clientName = booking.name || "";
          variables.eventType = booking.eventType || "";
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
          inboxId: replyInboxId || (selectedThread.EmailInbox || selectedThread.inbox)?.id || "", // Use smart-selected inbox
          to: replyTo || selectedThread.fromEmail || "",
          subject: replySubject || `Re: ${selectedThread.subject || "No Subject"}`,
          html: replyText,
          text: replyText.replace(/<[^>]*>/g, ""),
          threadId: selectedThread.id,
          bookingId: (selectedThread.Booking || selectedThread.booking)?.id || undefined,
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
    // Optimistic UI: immediately update the UI before API call
    const previousThreads = threads;
    const previousSelectedThread = selectedThread;
    
    // Immediately remove from list
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
    
    // Immediately clear selection
    if (selectedThread?.id === threadId) {
      setSelectedThread(null);
    }
    
    try {
      const response = await fetch(`/api/admin/threads/${threadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: true }),
      });

      if (response.ok) {
        // Show success toast
        setToast({
          id: Date.now().toString(),
          message: "Message Archived",
          type: "success",
        });
        
        // Refresh threads list to update counts (optional, but ensures consistency)
        await fetchThreads(0, false);
      } else {
        // Revert optimistic update on error
        setThreads(previousThreads);
        setSelectedThread(previousSelectedThread);
        
        // Show error toast if archive failed
        setToast({
          id: Date.now().toString(),
          message: "Failed to archive message",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error archiving thread:", error);
      
      // Revert optimistic update on error
      setThreads(previousThreads);
      setSelectedThread(previousSelectedThread);
      
      setToast({
        id: Date.now().toString(),
        message: "Error archiving message",
        type: "error",
      });
    }
  };

  const filteredThreads = threads
    .filter((thread) => {
      // Always filter out archived threads
      if (thread.isArchived) {
        return false;
      }
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
      "to-action": "bg-[#D4AF37] text-black border-[#D4AF37]",
      "waiting-client": "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40",
      "confirmed": "bg-green-500/20 text-green-400 border-green-500/40",
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${styles[status]}`}>
        {status === "to-action" ? "To Action" : status === "waiting-client" ? "Waiting for Client" : "Confirmed"}
      </span>
    );
  };

  const getEmailPreview = (thread: EmailThread): string => {
    // Try to get snippet from the most recent email
    const lastEmail = thread.Email?.[0] || thread.emails?.[thread.emails.length - 1];
    if (lastEmail?.textContent) {
      const snippet = lastEmail.textContent.substring(0, 100).replace(/\s+/g, " ").trim();
      return snippet.length < lastEmail.textContent.length ? snippet + "..." : snippet;
    }
    // Fallback placeholder
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
    <div className="h-screen flex flex-col bg-[#1a1a1a]">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-white">Mail</h1>
          {isNigel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-gray-400 hover:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Advanced
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isNigel && showAdvanced && (
            <>
              <Link href="/admin/email-audit">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
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
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          ) : (
            <Button
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
              className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-semibold border border-[#D4AF37]"
            >
              <Mail className="w-4 h-4 mr-2" />
              New Message
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Folders */}
        <div className="w-64 bg-[#1a1a1a] border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by sender or subject..."
                className="pl-9 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500 text-sm focus:border-[#D4AF37] focus:ring-[#D4AF37]"
              />
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {/* Unified Inbox */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedFolder("unified");
                    setSelectedAccountId(null);
                  }}
                  className={`flex-1 text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedFolder === "unified" && !selectedAccountId
                      ? "bg-[#D4AF37]/20 text-white border border-[#D4AF37]/40"
                      : "text-gray-300 hover:bg-[#252525]"
                  }`}
                >
                  <Inbox className="w-4 h-4 flex-shrink-0" />
                  <span>Unified Inbox</span>
                </button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSync()}
                  disabled={syncing || refreshing}
                  className="p-2 h-8 w-8 text-[#D4AF37] hover:text-white hover:bg-[#D4AF37]/20 border border-transparent hover:border-[#D4AF37]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Sync Emails"
                >
                  <RefreshCw className={`w-4 h-4 ${syncing || refreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              {getLastSyncTime() && (
                <div className="px-3 text-xs text-gray-500">
                  Last synced: {getLastSyncTime()}
                </div>
              )}
            </div>

            {/* Account Grouping */}
            <div className="border-t border-gray-800 pt-3 mt-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 px-3">
                Accounts
              </div>
              <div className="space-y-1">
                {inboxes.map((inbox) => {
                  const isExpanded = expandedAccounts.has(inbox.id);
                  const isSelected = selectedAccountId === inbox.id;
                  const accountColor = getAccountColor(inbox.name, inbox.email);
                  
                  return (
                    <div key={inbox.id}>
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
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                          isSelected
                            ? "bg-[#D4AF37]/20 text-white border border-[#D4AF37]/40"
                            : "text-gray-300 hover:bg-[#252525]"
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
                        <div className="ml-4 mt-1 space-y-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAccountId(inbox.id);
                              setSelectedFolder("all");
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-2 ${
                              isSelected && selectedFolder === "all"
                                ? "bg-[#D4AF37]/20 text-white"
                                : "text-gray-400 hover:bg-[#252525]"
                            }`}
                          >
                            <Folder className="w-3 h-3 flex-shrink-0" />
                            <span>Inbox</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAccountId(inbox.id);
                              setSelectedFolder("sent");
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-2 ${
                              isSelected && selectedFolder === "sent"
                                ? "bg-[#D4AF37]/20 text-white"
                                : "text-gray-400 hover:bg-[#252525]"
                            }`}
                          >
                            <Folder className="w-3 h-3 flex-shrink-0" />
                            <span>Sent</span>
                          </button>
                          {/* Display actual folders from API - root folders only (parentId is null) */}
                          {(() => {
                            const accountFolders = folders[inbox.id] || [];
                            // Filter to show root folders (no parentId) and non-system folders
                            const rootFolders = accountFolders.filter(
                              (f: any) => !f.parentId && f.name.toLowerCase() !== "inbox" && f.name.toLowerCase() !== "sent"
                            );
                            
                            if (rootFolders.length > 0) {
                              return (
                                <FolderTree
                                  folders={rootFolders}
                                  onSelect={(folderId) => {
                                    setSelectedAccountId(inbox.id);
                                    setSelectedFolder(folderId);
                                  }}
                                  expandedFolders={expandedFolders}
                                  setExpandedFolders={setExpandedFolders}
                                  level={0}
                                />
                              );
                            }
                            return null;
                          })()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Folders */}
            <div className="border-t border-gray-800 pt-3 mt-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 px-3">
                Categories
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedFolder("new-enquiries");
                    setSelectedAccountId(null);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedFolder === "new-enquiries" && !selectedAccountId
                      ? "bg-[#D4AF37]/20 text-white border border-[#D4AF37]/40"
                      : "text-gray-300 hover:bg-[#252525]"
                  }`}
                >
                  New Enquiries
                </button>
                <button
                  onClick={() => {
                    setSelectedFolder("ongoing-bookings");
                    setSelectedAccountId(null);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedFolder === "staff-comms" && !selectedAccountId
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Staff Comms
                </button>
              </div>
            </div>
          </nav>

          {/* Status Summary */}
          <div className="p-4 border-t border-gray-800 space-y-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Status
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">To Action</span>
                <span className="text-white font-medium">
                  {threads.filter((t) => getEmailStatus(t) === "to-action").length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Waiting for Client</span>
                <span className="text-white font-medium">
                  {threads.filter((t) => getEmailStatus(t) === "waiting-client").length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Confirmed</span>
                <span className="text-white font-medium">
                  {threads.filter((t) => getEmailStatus(t) === "confirmed").length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Email List */}
        <div className="w-80 bg-[#1a1a1a] border-r border-gray-800 flex flex-col relative">
          {/* Glass Loading Overlay */}
          {(refreshing || syncing) && (
            <div className="absolute inset-0 bg-[#1a1a1a]/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
                <p className="text-sm text-gray-300 font-medium">
                  {syncing ? "Syncing emails..." : "Refreshing..."}
                </p>
              </div>
            </div>
          )}
          <div className="p-4 border-b border-gray-800 bg-[#1a1a1a]">
            <div className="text-sm font-semibold text-white">
              {filteredThreads.length} {filteredThreads.length === 1 ? "message" : "messages"}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-[#1a1a1a]">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                <Mail className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                <p className="text-gray-400">No messages</p>
              </div>
            ) : (
              <>
                {filteredThreads.map((thread) => {
                // Null safeguard at the top
                if (!thread) return null;
                
                const emailStatus = getEmailStatus(thread);
                const preview = getEmailPreview(thread);
                
                // Safe property access with defaults
                const inbox = thread.EmailInbox || thread.inbox;
                const inboxName = inbox?.name || 'Unknown Inbox';
                const inboxEmail = inbox?.email || '';
                const inboxId = inbox?.id || '';
                
                const subject = thread.subject || 'No Subject';
                const fromName = thread.fromName || 'Anonymous';
                const fromEmail = thread.fromEmail || '';
                const isSelected = selectedThread?.id === thread.id;
                
                return (
                  <button
                    key={thread.id}
                    onClick={() => {
                      fetchThreadDetails(thread.id);
                      setReplying(false);
                      // Smart reply: auto-select the inbox that received this email
                      if (inboxId) {
                        setReplyInboxId(inboxId);
                      }
                    }}
                    className={`w-full text-left p-4 border-b border-gray-800 transition-all relative group ${
                      isSelected 
                        ? "bg-[#2a2a2a] border-l-4 border-l-[#D4AF37]" 
                        : "bg-[#1a1a1a] hover:bg-[#252525]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Sender Name - Pure White and Bold */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {thread.isStarred && (
                            <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37] flex-shrink-0" title="Flagged/Starred" />
                          )}
                          {isVenueEmail(thread) && (
                            <span className="text-base" title="Venue Email">🏛️</span>
                          )}
                          <span className="text-sm font-bold truncate text-white">
                            {fromName || fromEmail || 'Anonymous'}
                          </span>
                          {thread.source === "portal" && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-purple-900/50 text-purple-300 border-purple-700">
                              Portal
                            </span>
                          )}
                          {isVenueEmail(thread) && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40">
                              Venue
                            </span>
                          )}
                          {getStatusBadge(emailStatus)}
                        </div>
                        
                        {/* Subject Line - White for High Contrast */}
                        <p className="text-base font-semibold truncate text-white">
                          {subject}
                        </p>
                        
                        {/* Message Snippet - Light Grey */}
                        {preview && preview !== "Click to view message..." && (
                          <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                            {preview}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0 mt-1">
                        {thread.lastMessageAt ? new Date(thread.lastMessageAt).toLocaleDateString("en-GB", {
                          month: "short",
                          day: "numeric",
                        }) : ''}
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
        <div className="flex-1 bg-[#1a1a1a] flex flex-col overflow-hidden">
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
                      className="bg-charcoal hover:bg-charcoal/90 text-white"
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
              <div className="border-b border-gray-800 p-4 bg-[#1a1a1a]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white">
                    {selectedThread.subject || 'No Subject'}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setReplying(true);
                        setReplyTo(selectedThread.fromEmail || "");
                        setReplySubject(`Re: ${selectedThread.subject || "No Subject"}`);
                        // Smart reply: auto-select the inbox that received this email
                        const inbox = selectedThread.EmailInbox || selectedThread.inbox;
                        if (inbox?.id) {
                          setReplyInboxId(inbox.id);
                        }
                      }}
                      className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black border border-[#D4AF37] transition-all font-semibold"
                    >
                      <Reply className="w-4 h-4 mr-2" />
                      Reply
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black border border-[#D4AF37] transition-all font-semibold"
                    >
                      <Forward className="w-4 h-4 mr-2" />
                      Forward
                    </Button>
                    <div className="relative">
                      <Button
                        size="sm"
                        onClick={() => setShowMoveMenu(!showMoveMenu)}
                        className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black border border-[#D4AF37] transition-all font-semibold"
                      >
                        <Move className="w-4 h-4 mr-2" />
                        Move
                      </Button>
                      {showMoveMenu && selectedThread && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-[#2a2a2a] border border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                          <div className="p-2">
                            {(() => {
                              const inboxId = selectedThread.EmailInbox?.id || selectedThread.inbox?.id;
                              const folderTree = inboxId ? folders[inboxId] || [] : [];
                              return folderTree.length > 0 ? (
                                <FolderTree
                                  folders={folderTree}
                                  onSelect={(folderId) => {
                                    handleMoveToFolder(selectedThread.id, folderId);
                                  }}
                                  expandedFolders={expandedFolders}
                                  setExpandedFolders={setExpandedFolders}
                                />
                              ) : (
                                <div className="p-3 text-sm text-gray-400">No folders available</div>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleArchive(selectedThread.id)}
                      className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black border border-[#D4AF37] transition-all font-semibold"
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </Button>
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium text-gray-400">From:</span> <span className="text-white ml-2">{selectedThread.fromName || selectedThread.fromEmail}</span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-400">To:</span> <span className="text-white ml-2">{selectedThread.toEmail}</span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-400">Date:</span>{" "}
                    <span className="text-white ml-2">
                      {selectedThread.lastMessageAt ? new Date(selectedThread.lastMessageAt).toLocaleString("en-GB", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }) : ''}
                    </span>
                  </p>
                </div>
              </div>

              {/* Reply Compose Window */}
              {replying && (
                <div className="border-b border-gray-800 bg-[#252525] p-4">
                  <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 shadow-sm">
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
                          className="bg-charcoal hover:bg-charcoal/90 text-white"
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
              <div className="flex-1 overflow-y-auto p-6 bg-[#252525]">
                <div className="max-w-3xl mx-auto space-y-6">
                  {(() => {
                    const emails = selectedThread.Email || selectedThread.emails || [];
                    if (emails.length > 0) {
                      return emails.map((email: any, index: number) => (
                        <div
                          key={email.id || index}
                          className={`rounded-lg border overflow-hidden ${
                            email.direction === "outbound"
                              ? "bg-[#2a2a2a] border-[#D4AF37]/30"
                              : "bg-[#1a1a1a] border-gray-800"
                          }`}
                        >
                          <div className="p-4 border-b border-gray-800">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-white text-sm">
                                  {email.direction === "outbound"
                                    ? "You"
                                    : email.fromName || email.fromEmail || "Unknown"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {email.receivedAt ? new Date(email.receivedAt).toLocaleString("en-GB") : ""}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="p-8 bg-white">
                            <div className="text-sm text-gray-900 prose prose-sm max-w-none [&_*]:text-gray-900 [&_*]:!text-gray-900 [&_p]:text-gray-900 [&_div]:text-gray-900 [&_span]:text-gray-900 [&_a]:text-gray-900 [&_strong]:text-gray-900 [&_em]:text-gray-900 [&_h1]:text-gray-900 [&_h2]:text-gray-900 [&_h3]:text-gray-900 [&_h4]:text-gray-900 [&_h5]:text-gray-900 [&_h6]:text-gray-900">
                              {email.htmlContent || email.bodyHtml ? (
                                <div
                                  className="[&_*]:text-gray-900 [&_*]:!text-gray-900"
                                  style={{ color: '#1a1a1a' }}
                                  dangerouslySetInnerHTML={{
                                    __html: email.htmlContent || email.bodyHtml || "",
                                  }}
                                />
                              ) : (
                                <p className="whitespace-pre-wrap text-gray-900">
                                  {email.textContent || email.bodyText || "No content available"}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ));
                    } else {
                      return (
                        <div className="text-center text-gray-400 py-8">
                          <p>Loading email content...</p>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#1a1a1a]">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No message selected</h3>
                <p className="text-sm text-gray-400">Select a message from the list to view its contents</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Toast Notification */}
      <Toast 
        toast={toast} 
        onClose={() => setToast(null)} 
      />
    </div>
  );
}
