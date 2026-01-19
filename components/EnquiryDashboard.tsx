"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnquiryKanban } from "@/components/EnquiryKanban";
import { EnquiryStats } from "@/components/EnquiryStats";
import { RefreshCw, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  eventType: string;
  eventDate: string;
  venueName: string;
  venueAddress: string | null;
  venuePostcode: string | null;
  venueTown: string | null;
  status: string; // "pending", "checking_availability", "quoted", "contract_sent"
  priority: string;
  conflictStatus: string | null;
  createdAt: string;
  numberOfGuests: number | null;
  services: string[];
  budget: string | null;
}

export function EnquiryDashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalLeadsThisMonth: 0,
    conversionRate: 0,
    hottestUpcomingDate: null as string | null,
  });

  useEffect(() => {
    fetchEnquiries();
    fetchStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchEnquiries(true);
      fetchStats(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchEnquiries = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const response = await fetch("/api/admin/enquiries?t=" + Date.now());
      if (response.ok) {
        const data = await response.json();
        setEnquiries(data.enquiries || []);
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStats = async (silent = false) => {
    try {
      const response = await fetch("/api/admin/enquiries/stats?t=" + Date.now());
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleStatusChange = async (enquiryId: string, newStatus: string, source?: string) => {
    try {
      // Use different API endpoint based on source
      const apiEndpoint = source === "new_enquiry" 
        ? `/api/admin/new-enquiries/${enquiryId}/status`
        : `/api/admin/enquiries/${enquiryId}/status`;

      const response = await fetch(apiEndpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setEnquiries(prev => prev.map(e => 
          e.id === enquiryId ? { ...e, status: newStatus } : e
        ));
        // Refresh stats
        fetchStats(true);
      }
    } catch (error) {
      console.error("Error updating enquiry status:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading enquiries...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-serif">
              Enquiry Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Manage all enquiries and track conversions
            </p>
          </div>
          <Button
            onClick={() => {
              fetchEnquiries();
              fetchStats();
            }}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Header */}
        <EnquiryStats stats={stats} />

        {/* Kanban Board */}
        <EnquiryKanban
          enquiries={enquiries}
          onStatusChange={handleStatusChange}
          onEnquiryClick={(enquiry) => {
            // This will be handled by the card click in EnquiryKanban
          }}
        />
      </motion.div>
    </div>
  );
}
