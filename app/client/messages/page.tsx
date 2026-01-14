"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Search, Calendar } from "lucide-react";
import Link from "next/link";

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
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchThreads();
    }
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
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
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
            <Link href="/client/dashboard">
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
                <Link href={`/client/messages/${thread.id}`}>
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
