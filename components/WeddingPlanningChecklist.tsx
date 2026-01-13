"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle,
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
import { formatDistanceToNow, differenceInDays, differenceInMonths } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: number; // days before event (negative means after event)
  category: "vendor" | "planning" | "final";
  icon: any;
  completed?: boolean;
}

interface WeddingPlanningChecklistProps {
  eventDate: Date;
  eventType: string;
  onTaskToggle?: (taskId: string, completed: boolean) => void;
  completedTasks?: string[];
}

export default function WeddingPlanningChecklist({
  eventDate,
  eventType,
  onTaskToggle,
  completedTasks = [],
}: WeddingPlanningChecklistProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [daysUntilEvent, setDaysUntilEvent] = useState(0);
  const [monthsUntilEvent, setMonthsUntilEvent] = useState(0);

  useEffect(() => {
    const now = new Date();
    const event = new Date(eventDate);
    const daysDiff = differenceInDays(event, now);
    const monthsDiff = differenceInMonths(event, now);

    setDaysUntilEvent(daysDiff);
    setMonthsUntilEvent(monthsDiff);

    // Generate tasks based on time until event
    const allTasks: Task[] = [
      // 6+ months before
      {
        id: "book-venue",
        title: "Book & Confirm Venue",
        description: "Secure your venue and confirm booking details",
        deadline: -180,
        category: "vendor",
        icon: MapPin,
        completed: completedTasks.includes("book-venue"),
      },
      {
        id: "book-photographer",
        title: "Book Photographer",
        description: "Confirm photographer and discuss shot list",
        deadline: -150,
        category: "vendor",
        icon: Camera,
        completed: completedTasks.includes("book-photographer"),
      },
      {
        id: "book-caterer",
        title: "Book Caterer",
        description: "Finalize menu and catering details",
        deadline: -120,
        category: "vendor",
        icon: UtensilsCrossed,
        completed: completedTasks.includes("book-caterer"),
      },
      {
        id: "book-florist",
        title: "Book Florist",
        description: "Confirm floral arrangements and bouquets",
        deadline: -120,
        category: "vendor",
        icon: Flower2,
        completed: completedTasks.includes("book-florist"),
      },
      {
        id: "book-entertainment",
        title: "Book Entertainment (DJ/Musicians)",
        description: "Confirm DJ and any musicians",
        deadline: -90,
        category: "vendor",
        icon: Music,
        completed: completedTasks.includes("book-entertainment"),
      },
      {
        id: "send-save-dates",
        title: "Send Save the Dates",
        description: "Send save the date cards to guests",
        deadline: -90,
        category: "planning",
        icon: Gift,
        completed: completedTasks.includes("send-save-dates"),
      },
      {
        id: "book-transport",
        title: "Book Transport",
        description: "Arrange transport for wedding party",
        deadline: -60,
        category: "vendor",
        icon: Car,
        completed: completedTasks.includes("book-transport"),
      },
      {
        id: "order-rings",
        title: "Order Wedding Rings",
        description: "Choose and order wedding rings",
        deadline: -60,
        category: "planning",
        icon: Circle,
        completed: completedTasks.includes("order-rings"),
      },
      {
        id: "send-invitations",
        title: "Send Invitations",
        description: "Send formal invitations to guests",
        deadline: -45,
        category: "planning",
        icon: FileText,
        completed: completedTasks.includes("send-invitations"),
      },
      {
        id: "finalize-menu",
        title: "Finalize Menu with Caterer",
        description: "Confirm final menu selections",
        deadline: -30,
        category: "vendor",
        icon: UtensilsCrossed,
        completed: completedTasks.includes("finalize-menu"),
      },
      {
        id: "confirm-florals",
        title: "Confirm Floral Arrangements",
        description: "Final review of all floral details",
        deadline: -30,
        category: "vendor",
        icon: Flower2,
        completed: completedTasks.includes("confirm-florals"),
      },
      {
        id: "dress-fitting",
        title: "Dress Fitting & Alterations",
        description: "Final dress fitting and adjustments",
        deadline: -21,
        category: "planning",
        icon: Circle,
        completed: completedTasks.includes("dress-fitting"),
      },
      {
        id: "confirm-all-vendors",
        title: "Confirm All Vendors",
        description: "Final confirmation call with all vendors",
        deadline: -14,
        category: "vendor",
        icon: Phone,
        completed: completedTasks.includes("confirm-all-vendors"),
      },
      {
        id: "complete-dj-worksheet",
        title: "Complete DJ Worksheet",
        description: "Fill out final DJ details and music preferences",
        deadline: -21,
        category: "final",
        icon: Music,
        completed: completedTasks.includes("complete-dj-worksheet"),
      },
      {
        id: "final-payment",
        title: "Final Payments",
        description: "Complete final payments to all vendors",
        deadline: -14,
        category: "final",
        icon: FileText,
        completed: completedTasks.includes("final-payment"),
      },
      {
        id: "rehearsal",
        title: "Wedding Rehearsal",
        description: "Attend wedding rehearsal",
        deadline: -1,
        category: "final",
        icon: Calendar,
        completed: completedTasks.includes("rehearsal"),
      },
    ];

    // Filter tasks to show only relevant ones based on time until event
    const relevantTasks = allTasks
      .filter((task) => {
        const taskDaysUntil = daysDiff - task.deadline;
        // Show tasks that are due within the next 2 months, or overdue
        return taskDaysUntil <= 60 || taskDaysUntil < 0;
      })
      .sort((a, b) => {
        // Sort by deadline (closest first)
        const aDays = daysDiff - a.deadline;
        const bDays = daysDiff - b.deadline;
        return aDays - bDays;
      });

    setTasks(relevantTasks);
  }, [eventDate, completedTasks]);

  const handleTaskToggle = (taskId: string, checked: boolean) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: checked } : task
      )
    );
    if (onTaskToggle) {
      onTaskToggle(taskId, checked);
    }
  };

  const getTaskStatus = (task: Task) => {
    const taskDaysUntil = daysUntilEvent - task.deadline;
    if (task.completed) return "completed";
    if (taskDaysUntil < 0) return "overdue";
    if (taskDaysUntil <= 7) return "urgent";
    if (taskDaysUntil <= 14) return "soon";
    return "upcoming";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "overdue":
        return "text-red-400";
      case "urgent":
        return "text-orange-400";
      case "soon":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const formatDeadline = (task: Task) => {
    const taskDaysUntil = daysUntilEvent - task.deadline;
    if (taskDaysUntil < 0) {
      return `${Math.abs(taskDaysUntil)} days overdue`;
    }
    if (taskDaysUntil === 0) {
      return "Due today";
    }
    if (taskDaysUntil === 1) {
      return "Due tomorrow";
    }
    if (taskDaysUntil <= 7) {
      return `Due in ${taskDaysUntil} days`;
    }
    if (taskDaysUntil <= 30) {
      const weeks = Math.floor(taskDaysUntil / 7);
      return `Due in ${weeks} week${weeks > 1 ? "s" : ""}`;
    }
    const months = Math.floor(taskDaysUntil / 30);
    return `Due in ${months} month${months > 1 ? "s" : ""}`;
  };

  const groupedTasks = {
    overdue: tasks.filter((t) => getTaskStatus(t) === "overdue" && !t.completed),
    urgent: tasks.filter((t) => getTaskStatus(t) === "urgent" && !t.completed),
    upcoming: tasks.filter(
      (t) => !t.completed && getTaskStatus(t) !== "overdue" && getTaskStatus(t) !== "urgent"
    ),
    completed: tasks.filter((t) => t.completed),
  };

  return (
    <div className="space-y-6">
      {/* Countdown Header */}
      <Card className="bg-gradient-to-r from-champagne-gold/20 to-gold-light/20 border-champagne-gold/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-champagne-gold" />
            Countdown to Your {eventType === "Wedding" ? "Wedding" : "Event"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            {daysUntilEvent > 0 ? (
              <>
                <div className="text-4xl md:text-5xl font-bold text-champagne-gold mb-2">
                  {daysUntilEvent}
                </div>
                <div className="text-xl text-gray-300 mb-4">
                  {daysUntilEvent === 1 ? "Day" : "Days"} Remaining
                </div>
                <div className="text-sm text-gray-400">
                  {monthsUntilEvent > 0 && `${monthsUntilEvent} month${monthsUntilEvent > 1 ? "s" : ""}, `}
                  {daysUntilEvent % 30} day{daysUntilEvent % 30 !== 1 ? "s" : ""} until your special day
                </div>
              </>
            ) : daysUntilEvent === 0 ? (
              <div className="text-4xl font-bold text-champagne-gold">
                Today is the day! 🎉
              </div>
            ) : (
              <div className="text-2xl text-gray-400">
                Event has passed
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overdue Tasks */}
      {groupedTasks.overdue.length > 0 && (
        <Card className="bg-red-900/20 border-red-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <XCircle className="w-5 h-5" />
              Overdue Tasks ({groupedTasks.overdue.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {groupedTasks.overdue.map((task) => {
              const IconComponent = task.icon;
              return (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 bg-gray-900/50 rounded border border-red-500/30"
                >
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={(checked) =>
                      handleTaskToggle(task.id, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-red-400" />
                      <label
                        htmlFor={task.id}
                        className="font-semibold cursor-pointer"
                      >
                        {task.title}
                      </label>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                    <p className="text-xs text-red-400 mt-1">{formatDeadline(task)}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Urgent Tasks */}
      {groupedTasks.urgent.length > 0 && (
        <Card className="bg-orange-900/20 border-orange-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-400">
              <Clock className="w-5 h-5" />
              Urgent - Due This Week ({groupedTasks.urgent.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {groupedTasks.urgent.map((task) => {
              const IconComponent = task.icon;
              return (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 bg-gray-900/50 rounded border border-orange-500/30"
                >
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={(checked) =>
                      handleTaskToggle(task.id, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-orange-400" />
                      <label
                        htmlFor={task.id}
                        className="font-semibold cursor-pointer"
                      >
                        {task.title}
                      </label>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                    <p className="text-xs text-orange-400 mt-1">{formatDeadline(task)}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Tasks */}
      {groupedTasks.upcoming.length > 0 && (
        <Card className="bg-gray-800 border-champagne-gold/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-champagne-gold" />
              Upcoming Tasks ({groupedTasks.upcoming.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {groupedTasks.upcoming.map((task) => {
              const IconComponent = task.icon;
              const status = getTaskStatus(task);
              return (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 bg-gray-900/50 rounded border border-gray-700"
                >
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={(checked) =>
                      handleTaskToggle(task.id, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-champagne-gold" />
                      <label
                        htmlFor={task.id}
                        className="font-semibold cursor-pointer"
                      >
                        {task.title}
                      </label>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                    <p className={`text-xs mt-1 ${getStatusColor(status)}`}>
                      {formatDeadline(task)}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Completed Tasks */}
      {groupedTasks.completed.length > 0 && (
        <Card className="bg-gray-800 border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              Completed Tasks ({groupedTasks.completed.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {groupedTasks.completed.map((task) => {
              const IconComponent = task.icon;
              return (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 bg-gray-900/50 rounded border border-green-500/30 opacity-70"
                >
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={(checked) =>
                      handleTaskToggle(task.id, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-green-400" />
                      <label
                        htmlFor={task.id}
                        className="font-semibold cursor-pointer line-through"
                      >
                        {task.title}
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-through">
                      {task.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {tasks.length === 0 && (
        <Card className="bg-gray-800 border-champagne-gold/30">
          <CardContent className="py-8 text-center text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p>No tasks available at this time.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
