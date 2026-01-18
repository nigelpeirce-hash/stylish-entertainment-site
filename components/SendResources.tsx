"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllResources, type MasterResource } from "@/lib/master-resources";
import { Send, FileText, Loader2 } from "lucide-react";

interface SendResourcesProps {
  bookingId: string;
  clientEmail: string;
  clientName: string;
}

export function SendResources({ bookingId, clientEmail, clientName }: SendResourcesProps) {
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resources = getAllResources();

  const handleSend = async () => {
    if (!selectedResource) {
      setError("Please select a resource to send");
      return;
    }

    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/admin/send-resource", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          clientEmail,
          clientName,
          resourceId: selectedResource,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send resource");
      }

      setSuccess(true);
      setSelectedResource(""); // Reset selection
      setTimeout(() => setSuccess(false), 3000); // Clear success message after 3 seconds
    } catch (err: any) {
      setError(err.message || "An error occurred while sending the resource");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-champagne-gold/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-champagne-gold" />
          Send Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="resource-select" className="block text-sm font-medium text-gray-300 mb-2">
            Select a Resource to Send
          </label>
          <select
            id="resource-select"
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold focus:border-champagne-gold"
            disabled={sending}
          >
            <option value="">-- Choose a resource --</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name}
              </option>
            ))}
          </select>
          {selectedResource && (
            <p className="mt-2 text-xs text-gray-400">
              {resources.find((r) => r.id === selectedResource)?.description}
            </p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-md text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-900/30 border border-green-500/50 rounded-md text-green-400 text-sm">
            Resource sent successfully to {clientName}!
          </div>
        )}

        <Button
          onClick={handleSend}
          disabled={!selectedResource || sending}
          className="w-full bg-champagne-gold text-black hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Resource
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
