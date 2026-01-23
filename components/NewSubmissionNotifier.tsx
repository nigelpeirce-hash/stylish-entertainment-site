"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, X, Clock, AlertTriangle, User, MapPin, ArrowRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface PendingEnquiry {
  id: string;
  name: string;
  email: string;
  venueName: string;
  priority: string;
  createdAt: string;
  timeAgo?: string;
}

interface NotificationState {
  show: boolean;
  count: number;
  message: string;
  enquiries: PendingEnquiry[];
  urgentCount: number;
}

/**
 * NewSubmissionNotifier - Displays notifications when new contact form submissions arrive
 * Shows visual ping animation and plays audible ping sound
 */
export function NewSubmissionNotifier() {
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    count: 0,
    message: "",
    enquiries: [],
    urgentCount: 0,
  });
  const [lastCheckedIds, setLastCheckedIds] = useState<Set<string>>(new Set());
  const [isMuted, setIsMuted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio element for ping sound
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    const createPingSound = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800; // Higher pitch for attention
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (error) {
        // Fallback: If Web Audio API fails, silently fail
        console.warn("Could not play ping sound:", error);
      }
    };

    // Store the function for later use
    (window as any).__createPingSound = createPingSound;
  }, []);

  // Calculate time ago string
  const getTimeAgo = (createdAt: string): string => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  // Check for new submissions periodically
  useEffect(() => {
    const checkForNewSubmissions = async () => {
      try {
        const response = await fetch("/api/admin/bookings?status=pending");
        if (response.ok) {
          const data = await response.json();
          const bookings: PendingEnquiry[] = (data.bookings || []).map((b: any) => ({
            id: b.id,
            name: b.name,
            email: b.email,
            venueName: b.venueName || "TBC",
            priority: b.priority || "medium",
            createdAt: b.createdAt,
            timeAgo: getTimeAgo(b.createdAt),
          }));

          // Find new enquiries by comparing IDs
          const currentIds = new Set(bookings.map((b) => b.id));
          const newEnquiries = bookings.filter((b) => !lastCheckedIds.has(b.id));

          // If new enquiries arrived
          if (newEnquiries.length > 0 && lastCheckedIds.size > 0) {
            const urgentEnquiries = newEnquiries.filter((e) => e.priority === "urgent");
            
            // Play ping sound if not muted (repeat for urgent enquiries)
            if (!isMuted && (window as any).__createPingSound) {
              (window as any).__createPingSound();
              // Double ping for urgent enquiries
              if (urgentEnquiries.length > 0) {
                setTimeout(() => {
                  if ((window as any).__createPingSound) {
                    (window as any).__createPingSound();
                  }
                }, 400);
              }
            }

            // Show notification and modal
            setNotification({
              show: true,
              count: newEnquiries.length,
              message: newEnquiries.length === 1 
                ? "New enquiry received!" 
                : `${newEnquiries.length} new enquiries received!`,
              enquiries: newEnquiries,
              urgentCount: urgentEnquiries.length,
            });

            // Show modal immediately for urgent enquiries
            if (urgentEnquiries.length > 0) {
              setShowModal(true);
            }

            // Request browser notification permission (if not already granted)
            if ("Notification" in window && Notification.permission === "default") {
              Notification.requestPermission();
            }

            // Show browser notification if permission granted
            if ("Notification" in window && Notification.permission === "granted") {
              const urgentMsg = urgentEnquiries.length > 0 
                ? ` ⚠️ ${urgentEnquiries.length} URGENT` 
                : "";
              new Notification("New Enquiry Received" + urgentMsg, {
                body: newEnquiries.length === 1 
                  ? `From ${newEnquiries[0].name}${urgentMsg ? " - URGENT" : ""}`
                  : `${newEnquiries.length} new contact form submissions${urgentMsg}`,
                icon: "https://res.cloudinary.com/drtwveoqo/image/upload/v1768162584/Rev-New-SE-Logo0_ow03mn.png",
                badge: "https://res.cloudinary.com/drtwveoqo/image/upload/v1768162584/Rev-New-SE-Logo0_ow03mn.png",
                tag: "new-enquiry",
                requireInteraction: urgentEnquiries.length > 0, // Require interaction for urgent
              });
            }
          }

          setLastCheckedIds(currentIds);
        }
      } catch (error) {
        console.error("Error checking for new submissions:", error);
      }
    };

    // Initial check after 2 seconds (to avoid checking on mount)
    const initialTimeout = setTimeout(() => {
      checkForNewSubmissions();
      // Then check every 5 minutes (Chill Mode)
      pingIntervalRef.current = setInterval(checkForNewSubmissions, 300000);
    }, 2000);

    return () => {
      clearTimeout(initialTimeout);
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [lastCheckedIds, isMuted]);

  const handleDismiss = () => {
    setNotification({ ...notification, show: false });
    setShowModal(false);
  };

  const handleViewBookings = () => {
    window.location.href = "/admin/bookings?status=pending";
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      {/* Priority Modal Window - Requires Manual Dismissal */}
      <AnimatePresence>
        {showModal && notification.enquiries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={(e) => {
              // Only close if clicking backdrop, not content
              if (e.target === e.currentTarget) {
                handleDismiss();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border-2 border-champagne-gold rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Bell className="w-8 h-8 text-champagne-gold" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        New Enquiry Received
                      </h2>
                      <p className="text-sm text-gray-400">
                        Early response = Higher conversion rate
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Priority Alert */}
                {notification.urgentCount > 0 && (
                  <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-red-400">
                        {notification.urgentCount} URGENT {notification.urgentCount === 1 ? "ENQUIRY" : "ENQUIRIES"}
                      </p>
                      <p className="text-sm text-red-300">
                        Event date within 2 weeks - Immediate response recommended
                      </p>
                    </div>
                  </div>
                )}

                {/* Enquiries List */}
                <div className="space-y-3 mb-6">
                  {notification.enquiries.map((enquiry) => (
                    <Card
                      key={enquiry.id}
                      className={`bg-gray-800 border ${
                        enquiry.priority === "urgent"
                          ? "border-red-500/50"
                          : "border-gray-700"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-white">{enquiry.name}</h3>
                              {enquiry.priority === "urgent" && (
                                <span className="px-2 py-0.5 bg-red-900/40 border border-red-500/50 rounded text-xs font-bold text-red-400 animate-pulse">
                                  URGENT
                                </span>
                              )}
                              {enquiry.priority === "medium" && (
                                <span className="px-2 py-0.5 bg-yellow-900/40 border border-yellow-500/50 rounded text-xs font-bold text-yellow-400">
                                  MEDIUM
                                </span>
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-gray-300">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span>{enquiry.venueName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span>{enquiry.timeAgo}</span>
                              </div>
                            </div>
                          </div>
                          <Link href={`/admin/bookings/${enquiry.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
                            >
                              View
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleViewBookings}
                    className="flex-1 bg-champagne-gold text-black hover:bg-champagne-gold/90 font-semibold"
                  >
                    View All Pending ({notification.count})
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDismiss}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Toast - Persistent until dismissed */}
      <AnimatePresence>
        {notification.show && !showModal && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className={`${
                notification.urgentCount > 0
                  ? "bg-red-600 text-white border-red-500"
                  : "bg-champagne-gold text-black border-champagne-gold/50"
              } rounded-lg shadow-2xl border-2 p-4 relative cursor-pointer`}
              onClick={handleViewBookings}
            >
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex-shrink-0"
                >
                  {notification.urgentCount > 0 ? (
                    <Zap className="w-6 h-6" />
                  ) : (
                    <Bell className="w-6 h-6" />
                  )}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-lg mb-1">{notification.message}</p>
                  {notification.urgentCount > 0 && (
                    <p className="text-sm font-semibold mb-1">
                      ⚠️ {notification.urgentCount} URGENT - Respond quickly!
                    </p>
                  )}
                  <p className={`text-sm ${notification.urgentCount > 0 ? "text-white/80" : "text-black/80"}`}>
                    Click to view and respond
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismiss();
                  }}
                  className={`${
                    notification.urgentCount > 0
                      ? "text-white hover:bg-white/10"
                      : "text-black hover:bg-black/10"
                  } h-6 w-6 p-0 flex-shrink-0`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Ping Ripple Effect */}
              <motion.div
                className={`absolute inset-0 rounded-lg border-2 ${
                  notification.urgentCount > 0 ? "border-red-500" : "border-champagne-gold"
                }`}
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0.5, 0, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Notification Icon (always visible with ping when new submissions) */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <motion.button
              onClick={() => {
                handleDismiss();
                window.location.href = "/admin/bookings?status=pending";
              }}
              className="bg-champagne-gold text-black rounded-full p-4 shadow-2xl cursor-pointer hover:bg-champagne-gold/90 transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="w-6 h-6" />
              
              {/* Badge with count */}
              {notification.count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                >
                  {notification.count}
                </motion.span>
              )}

              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-champagne-gold"
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0.6, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mute/Unmute Toggle (in top right corner) */}
      <div className="fixed top-4 left-4 z-40">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleMute}
          className={`text-gray-400 hover:text-white transition-colors ${
            isMuted ? "opacity-50" : ""
          }`}
          title={isMuted ? "Unmute notifications" : "Mute notifications"}
        >
          <Bell className={`w-4 h-4 ${isMuted ? "line-through" : ""}`} />
        </Button>
      </div>
    </>
  );
}
