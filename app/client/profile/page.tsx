"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Calendar, ArrowLeft, Edit2, X, Check, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
}

interface Booking {
  id: string;
  eventType: string;
  eventDate: string;
  venueName: string;
  status: string;
  services?: string[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [userIpAddress, setUserIpAddress] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
      fetchBookings();
    }
  }, [session]);

  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  // Fetch user IP address for deletion logging
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIpAddress(data.ip);
      } catch (error) {
        console.error("Error fetching IP:", error);
        try {
          const fallbackResponse = await fetch('https://api64.ipify.org?format=json');
          const fallbackData = await fallbackResponse.json();
          setUserIpAddress(fallbackData.ip);
        } catch (fallbackError) {
          console.error("Error fetching IP from fallback:", fallbackError);
          setUserIpAddress("Unknown");
        }
      }
    };
    fetchIp();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/client/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/client/bookings");
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/client/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setIsEditing(false);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        name: profile.name || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
    setIsEditing(false);
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

  // Get upcoming event dates from bookings
  const upcomingBookings = bookings
    .filter((booking) => {
      const eventDate = new Date(booking.eventDate);
      return eventDate >= new Date();
    })
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  // Check if user has active or upcoming bookings (for account deletion restriction)
  const hasActiveOrUpcomingBookings = bookings.some((booking) => {
    const eventDate = new Date(booking.eventDate);
    const isUpcoming = eventDate >= new Date();
    const isActive = booking.status === "confirmed" || booking.status === "pending";
    return isUpcoming && isActive;
  });

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      return;
    }

    if (!userIpAddress) {
      alert("Could not retrieve your IP address. Please try again.");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/client/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deletion_ip: userIpAddress,
          deletion_timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Redirect to confirmation page
        router.push("/client/account-deleted");
      } else {
        const errorData = await response.json();
        alert(`Failed to delete account: ${errorData.message || "Unknown error"}`);
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting your account. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Profile</h1>
              <p className="text-gray-400">Your account information and event details</p>
            </div>
            <Link href="/client/dashboard">
              <Button
                variant="outline"
                className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-champagne-gold" />
                  Personal Information
                </CardTitle>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2 text-gray-400">
                        <User className="w-4 h-4" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </div>

                    {/* Email - Read Only */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-gray-400">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        value={profile?.email || session.user?.email || ""}
                        disabled
                        className="bg-gray-900 text-gray-500 border-gray-700 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2 text-gray-400">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="Enter your phone number"
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </div>

                    {/* Address */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        Home Address
                      </Label>
                      <Textarea
                        id="address"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        placeholder="Enter your address"
                        rows={3}
                        className="bg-gray-900 text-white border-gray-700 placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-champagne-gold text-black hover:bg-gold-light"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <User className="w-4 h-4" />
                      Full Name
                    </div>
                    <p className="text-white text-lg">
                      {profile?.name || session.user?.name || "Not provided"}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </div>
                    <p className="text-white text-lg">
                      {profile?.email || session.user?.email || "Not provided"}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </div>
                    <p className="text-white text-lg">
                      {profile?.phone || "Not provided"}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin className="w-4 h-4" />
                      Home Address
                    </div>
                    <p className="text-white text-lg">
                      {profile?.address || "Not provided"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Event Dates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-champagne-gold" />
                Event Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No upcoming events</p>
                  <p className="text-sm text-gray-500">
                    Your event dates will appear here once you submit a booking enquiry
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 bg-gray-900 rounded-lg border border-gray-700"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {booking.eventType}
                          </h3>
                          <p className="text-gray-400">
                            {new Date(booking.eventDate).toLocaleDateString("en-GB", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Venue: {booking.venueName}
                          </p>
                          {booking.services && booking.services.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {booking.services.map((service) => {
                                // Map service names to display names
                                const serviceMap: Record<string, string> = {
                                  "DJs": "DJ",
                                  "Lighting Design": "Lighting",
                                  "Venue Styling": "Styling",
                                  "Musicians": "Musicians",
                                  "Kit Hire": "Kit Hire",
                                  "Fire-Pits": "Fire-Pits",
                                  "Party Planning": "Party Planning",
                                };
                                const displayName = serviceMap[service] || service;
                                return (
                                  <span
                                    key={service}
                                    className="px-2 py-1 text-xs font-medium bg-champagne-gold/20 text-champagne-gold border border-champagne-gold/30 rounded"
                                  >
                                    {displayName}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              booking.status === "confirmed"
                                ? "bg-green-900/30 text-green-400 border border-green-700"
                                : booking.status === "pending"
                                ? "bg-yellow-900/30 text-yellow-400 border border-yellow-700"
                                : "bg-gray-700 text-gray-400 border border-gray-600"
                            }`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Delete Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-gray-800 border-red-900/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-300">
                <Trash2 className="w-5 h-5" />
                Delete Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              
              {hasActiveOrUpcomingBookings ? (
                <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-200 font-medium mb-1">
                        Accounts with active bookings cannot be deleted online.
                      </p>
                      <p className="text-yellow-200/80 text-sm">
                        Please contact Nigel or Ali to discuss your event.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Button
                    onClick={() => setIsDeleteModalOpen(true)}
                    variant="destructive"
                    className="bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-700/50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="bg-gray-900 border-red-900/50">
            <DialogHeader>
              <DialogTitle className="text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Delete Account Confirmation
              </DialogTitle>
              <DialogDescription className="text-gray-300 pt-2">
                This action cannot be undone. This will permanently delete your account and remove all associated data.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                <p className="text-red-200 text-sm mb-2">
                  To confirm, please type <span className="font-bold">DELETE</span> in the box below:
                </p>
                <Input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="bg-gray-800 text-white border-gray-700 focus:border-red-700"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmation("");
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== "DELETE" || isDeleting}
                variant="destructive"
                className="bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
