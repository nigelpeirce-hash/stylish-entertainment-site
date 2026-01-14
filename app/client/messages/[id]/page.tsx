"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Calendar } from "lucide-react";
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
  receivedAt: string;
  direction: string;
}

interface EmailThread {
  id: string;
  subject: string;
  fromEmail: string;
  toEmail: string;
  emails: Email[];
  booking: { id: string; eventType: string; eventDate: string; venueName: string } | null;
}

export default function ClientThreadDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const threadId = params.id as string;

  const [thread, setThread] = useState<EmailThread | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user && threadId) {
      fetchThread();
    }
  }, [session, threadId]);

  const fetchThread = async () => {
    try {
      const response = await fetch(`/api/client/threads/${threadId}`);
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

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session || !thread) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link href="/client/messages">
            <Button variant="outline" className="border-champagne-gold text-champagne-gold mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Messages
            </Button>
          </Link>

          {thread.booking && (
            <Card className="bg-gray-800 border-champagne-gold/30 mb-4">
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
          )}
        </div>

        <Card className="bg-gray-800 border-champagne-gold/30 mb-4">
          <CardHeader>
            <CardTitle>{thread.subject}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 mb-4 text-sm">
              <p className="text-gray-400">
                <strong>From:</strong> {thread.fromEmail}
              </p>
              <p className="text-gray-400">
                <strong>To:</strong> {thread.toEmail}
              </p>
            </div>
          </CardContent>
        </Card>

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
                        {email.direction === "outbound" ? "You" : email.fromName || email.fromEmail || email.from}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(email.receivedAt).toLocaleString()}
                      </p>
                    </div>
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
