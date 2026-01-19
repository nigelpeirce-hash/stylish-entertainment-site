"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Calendar, Users, Percent } from "lucide-react";
import { format } from "date-fns";

interface EnquiryStatsProps {
  stats: {
    totalLeadsThisMonth: number;
    conversionRate: number;
    hottestUpcomingDate: string | null;
  };
}

export function EnquiryStats({ stats }: EnquiryStatsProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "EEEE, d MMMM yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Leads This Month */}
      <Card className="bg-gray-800 border-champagne-gold/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Leads This Month</p>
              <p className="text-3xl font-bold text-white">{stats.totalLeadsThisMonth}</p>
            </div>
            <div className="p-3 bg-blue-600/20 rounded-full">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Rate */}
      <Card className="bg-gray-800 border-champagne-gold/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Conversion Rate</p>
              <p className="text-3xl font-bold text-white">
                {stats.conversionRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-green-600/20 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hottest Upcoming Date */}
      <Card className="bg-gray-800 border-champagne-gold/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-400 mb-1">Hottest Upcoming Date</p>
              <p className="text-lg font-semibold text-white truncate">
                {formatDate(stats.hottestUpcomingDate)}
              </p>
            </div>
            <div className="p-3 bg-orange-600/20 rounded-full ml-2 flex-shrink-0">
              <Calendar className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
