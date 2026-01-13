"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Calendar, 
  MessageSquare, 
  User, 
  LogOut, 
  Plus,
  CheckCircle2,
  Clock,
  Camera,
  UtensilsCrossed,
  Flower2,
  MapPin,
  Music,
  Car,
  Gift,
  Circle,
  FileText,
  Phone
} from "lucide-react";

export default function DemoClientDashboardPage() {
  useEffect(() => {
    document.title = "Client Dashboard Demo | Stylish Entertainment";
  }, []);

  // Mock booking data for demo
  const mockBooking = {
    id: "demo-1",
    eventType: "Wedding",
    eventDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    venueName: "Babington House",
    status: "confirmed",
    completedTasks: ["book-venue", "book-photographer", "book-caterer"],
  };

  const daysUntilEvent = Math.floor((mockBooking.eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const monthsUntilEvent = Math.floor(daysUntilEvent / 30);

  const allTasks = [
    { id: "book-venue", title: "Book & Confirm Venue", icon: MapPin, deadline: -180, completed: true },
    { id: "book-photographer", title: "Book Photographer", icon: Camera, deadline: -150, completed: true },
    { id: "book-caterer", title: "Book Caterer", icon: UtensilsCrossed, deadline: -120, completed: true },
    { id: "book-florist", title: "Book Florist", icon: Flower2, deadline: -120, completed: false },
    { id: "book-entertainment", title: "Book Entertainment (DJ/Musicians)", icon: Music, deadline: -90, completed: false },
    { id: "send-save-dates", title: "Send Save the Dates", icon: Gift, deadline: -90, completed: false },
    { id: "book-transport", title: "Book Transport", icon: Car, deadline: -60, completed: false },
    { id: "order-rings", title: "Order Wedding Rings", icon: Circle, deadline: -60, completed: false },
    { id: "send-invitations", title: "Send Invitations", icon: FileText, deadline: -45, completed: false },
    { id: "finalize-menu", title: "Finalize Menu with Caterer", icon: UtensilsCrossed, deadline: -30, completed: false },
    { id: "confirm-florals", title: "Confirm Floral Arrangements", icon: Flower2, deadline: -30, completed: false },
    { id: "dress-fitting", title: "Dress Fitting & Alterations", icon: Circle, deadline: -21, completed: false },
    { id: "confirm-all-vendors", title: "Confirm All Vendors", icon: Phone, deadline: -14, completed: false },
    { id: "complete-dj-worksheet", title: "Complete DJ Worksheet", icon: Music, deadline: -21, completed: false },
    { id: "final-payment", title: "Final Payments", icon: FileText, deadline: -14, completed: false },
    { id: "rehearsal", title: "Wedding Rehearsal", icon: Calendar, deadline: -1, completed: false },
  ];

  const overdueTasks = allTasks.filter(t => !t.completed && (daysUntilEvent - t.deadline) < 0);
  const urgentTasks = allTasks.filter(t => !t.completed && (daysUntilEvent - t.deadline) <= 7 && (daysUntilEvent - t.deadline) >= 0);
  const upcomingTasks = allTasks.filter(t => !t.completed && (daysUntilEvent - t.deadline) > 7);
  const completedTasks = allTasks.filter(t => t.completed);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome, John & Jane
              </h1>
              <p className="text-gray-400">john.jane@example.com</p>
            </div>
            <Button
              variant="outline"
              className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Link href="/dj-booking-confirmation">
            <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-champagne-gold/20 rounded-lg">
                  <Plus className="w-6 h-6 text-champagne-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">New Booking</h3>
                  <p className="text-sm text-gray-400">Submit a new inquiry</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/profile">
            <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-champagne-gold/20 rounded-lg">
                  <User className="w-6 h-6 text-champagne-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Profile</h3>
                  <p className="text-sm text-gray-400">View your profile & event dates</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-gray-800 border-champagne-gold/30 h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-champagne-gold/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-champagne-gold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Messages</h3>
                <p className="text-sm text-gray-400">View conversations</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Booking Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-champagne-gold" />
                Your Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {mockBooking.eventType}
                      </h3>
                      <p className="text-gray-400 mb-1">
                        <strong>Date:</strong>{" "}
                        {mockBooking.eventDate.toLocaleDateString()}
                      </p>
                      <p className="text-gray-400 mb-1">
                        <strong>Venue:</strong> {mockBooking.venueName}
                      </p>
                      <p className="text-gray-400">
                        <strong>Status:</strong>{" "}
                        <span className="capitalize text-green-400">
                          {mockBooking.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wedding Planning Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Countdown Header */}
          <Card className="bg-gradient-to-r from-champagne-gold/20 to-gold-light/20 border-champagne-gold/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-champagne-gold" />
                Countdown to Your Wedding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-champagne-gold mb-2">
                  {daysUntilEvent}
                </div>
                <div className="text-xl text-gray-300 mb-4">
                  Days Remaining
                </div>
                <div className="text-sm text-gray-400">
                  {monthsUntilEvent > 0 && `${monthsUntilEvent} month${monthsUntilEvent > 1 ? "s" : ""}, `}
                  {daysUntilEvent % 30} day{daysUntilEvent % 30 !== 1 ? "s" : ""} until your special day
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          {upcomingTasks.length > 0 && (
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-champagne-gold" />
                  Upcoming Tasks ({upcomingTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingTasks.slice(0, 3).map((task) => {
                  const IconComponent = task.icon;
                  const taskDaysUntil = daysUntilEvent - task.deadline;
                  return (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 bg-gray-900/50 rounded border border-gray-700"
                    >
                      <div className="w-5 h-5 rounded border border-gray-600 mt-1"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4 text-champagne-gold" />
                          <label className="font-semibold cursor-pointer">
                            {task.title}
                          </label>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Due in {taskDaysUntil} days
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Urgent Tasks */}
          {urgentTasks.length > 0 && (
            <Card className="bg-orange-900/20 border-orange-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                  <Clock className="w-5 h-5" />
                  Urgent - Due This Week ({urgentTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {urgentTasks.map((task) => {
                  const IconComponent = task.icon;
                  const taskDaysUntil = daysUntilEvent - task.deadline;
                  return (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 bg-gray-900/50 rounded border border-orange-500/30"
                    >
                      <div className="w-5 h-5 rounded border border-orange-500 mt-1"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4 text-orange-400" />
                          <label className="font-semibold cursor-pointer">
                            {task.title}
                          </label>
                        </div>
                        <p className="text-xs text-orange-400 mt-1">
                          Due in {taskDaysUntil} days
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <Card className="bg-gray-800 border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  Completed Tasks ({completedTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {completedTasks.map((task) => {
                  const IconComponent = task.icon;
                  return (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 bg-gray-900/50 rounded border border-green-500/30 opacity-70"
                    >
                      <div className="w-5 h-5 rounded bg-green-500 border border-green-500 mt-1 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4 text-green-400" />
                          <label className="font-semibold cursor-pointer line-through">
                            {task.title}
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Info Banner */}
          <Card className="bg-champagne-gold/10 border-champagne-gold/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-champagne-gold/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-champagne-gold" />
                </div>
                <div>
                  <h4 className="font-semibold text-champagne-gold mb-2">
                    Wedding Planning Checklist
                  </h4>
                  <p className="text-gray-300 text-sm mb-4">
                    This checklist helps you stay organized as you plan your wedding. 
                    Tasks are organized by urgency and automatically update based on your wedding date.
                  </p>
                  <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                    <li>Check off tasks as you complete them</li>
                    <li>Tasks are organized by urgency (overdue, urgent, upcoming)</li>
                    <li>Includes vendor confirmations and planning milestones</li>
                    <li>Complete your DJ worksheet 3 weeks before your wedding</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo Info */}
        <Card className="bg-gray-800 border-gray-700 mt-8">
          <CardContent className="p-6">
            <p className="text-center text-gray-400 text-sm">
              This is a demo view of the client dashboard.{" "}
              <Link href="/demo-booking-flow" className="text-champagne-gold hover:text-gold-light underline">
                View the complete booking flow
              </Link>
              {" or "}
              <Link href="/login" className="text-champagne-gold hover:text-gold-light underline">
                login to see your actual dashboard
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
