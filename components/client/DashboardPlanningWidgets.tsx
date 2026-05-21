"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote } from "lucide-react";
import { motion } from "framer-motion";
import BudgetTracker from "@/components/BudgetTracker";
import GuestCountTracker from "@/components/GuestCountTracker";
import AddOnConcierge from "@/components/AddOnConcierge";
import { showDashboardWidgets } from "@/lib/dashboard-widgets";

interface DashboardPlanningWidgetsProps {
  booking: {
    id: string;
    budget?: string | null;
    numberOfGuests?: number | null;
    eventType?: string | null;
    eventDate?: string | null;
  };
  /** single = SingleEventHero card layout; multi = stacked blocks on multi-booking dashboard */
  layout?: "single" | "multi";
  /** multi layout only: render budget block, guest/add-on block, or both */
  section?: "all" | "budget" | "guests";
}

/**
 * Budget, guest count, and add-on dashboard widgets.
 * Gated by NEXT_PUBLIC_ENABLE_DASHBOARD_WIDGETS — hidden in production by default.
 */
export function DashboardPlanningWidgets({
  booking,
  layout = "single",
  section = "all",
}: DashboardPlanningWidgetsProps) {
  if (!showDashboardWidgets) return null;

  if (layout === "multi") {
    return (
      <>
        {(section === "all" || section === "budget") && (
          <div className="min-w-0 overflow-x-auto">
            <BudgetTracker bookingId={booking.id} totalBudget={booking.budget ?? undefined} />
          </div>
        )}
        {(section === "all" || section === "guests") && (
          <>
            <GuestCountTracker
              bookingId={booking.id}
              initialCount={booking.numberOfGuests || 0}
            />
            <AddOnConcierge
              bookingId={booking.id}
              eventType={booking.eventType}
              eventDate={booking.eventDate}
            />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/30">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Banknote className="w-5 h-5 text-champagne-gold" />
              Budget & payments
            </CardTitle>
            <p className="text-gray-400 text-sm">Deposit, balance and payment details</p>
          </CardHeader>
          <CardContent>
            <BudgetTracker bookingId={booking.id} totalBudget={booking.budget ?? undefined} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <GuestCountTracker
          bookingId={booking.id}
          initialCount={booking.numberOfGuests || 0}
        />
        <AddOnConcierge
          bookingId={booking.id}
          eventType={booking.eventType}
          eventDate={booking.eventDate}
        />
      </motion.div>
    </>
  );
}
