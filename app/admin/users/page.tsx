"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Users,
  Mail,
  UserPlus,
  Shield,
  User as UserIcon,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  RefreshCw,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { InviteUserModal } from "@/components/InviteUserModal";
import { getDevBypassHeaders } from "@/lib/dev-bypass";
import { isSuperAdmin } from "@/lib/admin-permissions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/radix-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
  emailVerified: boolean;
  inviteStatus: "accepted" | "pending" | "not_invited";
  createdAt: string;
  updatedAt: string;
  lastSignIn: string | null;
}

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check for dev bypass
    const devBypass = typeof window !== "undefined" && 
      sessionStorage.getItem("dev_admin_bypass") === "true";
    
    const isLocalhost = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || 
       window.location.hostname === "localhost" || 
       window.location.hostname === "127.0.0.1");

    const isAdmin = session && (session?.user as any)?.role === "admin";
    const userEmail = session?.user?.email;
    const isSuperAdminUser = isSuperAdmin(userEmail);
    const hasAccess = (isAdmin && isSuperAdminUser) || devBypass || isLocalhost;

    if (status === "unauthenticated" && !hasAccess) {
      router.push("/login");
    } else if (status === "authenticated") {
      if (!isAdmin) {
        router.push("/client/dashboard");
      } else if (!isSuperAdminUser && !devBypass && !isLocalhost) {
        // Not SuperAdmin - redirect to dashboard
        router.push("/admin");
      }
    }

    if (hasAccess) {
      fetchUsers();
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users", {
        headers: {
          ...getDevBypassHeaders(),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingRole(userId);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          ...getDevBypassHeaders(),
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        await fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role");
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string, userEmail: string) => {
    const confirmMessage = `Are you sure you want to permanently delete ${userName || userEmail}?\n\nThis action cannot be undone. All associated data will be removed.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setDeletingUserId(userId);
    try {
      const response = await fetch(`/api/admin/users?userId=${encodeURIComponent(userId)}`, {
        method: "DELETE",
        headers: {
          ...getDevBypassHeaders(),
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.hadBookings) {
          alert(`User deleted successfully. Note: This user had bookings that were also removed.`);
        } else {
          alert("User deleted successfully");
        }
        await fetchUsers();
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-900/40 text-red-300 border-red-500/50";
      case "user":
        return "bg-blue-900/40 text-blue-300 border-blue-500/50";
      case "client":
        return "bg-gray-700 text-gray-300 border-gray-600";
      default:
        return "bg-gray-700 text-gray-300 border-gray-600";
    }
  };

  const getInviteStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-900/40 text-green-300 border border-green-500/50">
            <CheckCircle2 className="w-3 h-3" />
            Active
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-yellow-900/40 text-yellow-300 border border-yellow-500/50">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "not_invited":
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
            <XCircle className="w-3 h-3" />
            Not Invited
          </span>
        );
      default:
        return null;
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </Link>
              </div>
              <h1 className="text-4xl font-bold mb-2">User Management</h1>
              <p className="text-gray-400">
                Manage users, roles, and invitations
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={fetchUsers}
                variant="outline"
                className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={() => setInviteModalOpen(true)}
                className="bg-champagne-gold text-black hover:bg-gold-light"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite New User
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-champagne-gold" />
                All Users ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400 text-lg">No users found</p>
                  <Button
                    onClick={() => setInviteModalOpen(true)}
                    className="mt-4 bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite First User
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                          User
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                          Role
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                          Created
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                                {user.image ? (
                                  <Image
                                    src={user.image}
                                    alt={user.name || user.email}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-full"
                                  />
                                ) : (
                                  <UserIcon className="w-5 h-5 text-champagne-gold" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-white">
                                  {user.name || "No name"}
                                </p>
                                <p className="text-sm text-gray-400">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Select
                              value={user.role}
                              onValueChange={(value) =>
                                handleRoleChange(user.id, value)
                              }
                              disabled={updatingRole === user.id}
                            >
                              <SelectTrigger className={`w-32 ${getRoleBadgeColor(user.role)} border`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="client">Client</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-4 px-4">
                            {getInviteStatusBadge(user.inviteStatus)}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString("en-GB", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="py-4 px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                                <DropdownMenuItem
                                  onClick={() => handleRoleChange(user.id, "admin")}
                                  disabled={user.role === "admin" || updatingRole === user.id}
                                  className="text-white hover:bg-gray-700"
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  Make Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleRoleChange(user.id, "user")}
                                  disabled={user.role === "user" || updatingRole === user.id}
                                  className="text-white hover:bg-gray-700"
                                >
                                  <UserIcon className="w-4 h-4 mr-2" />
                                  Make User
                                </DropdownMenuItem>
                                {user.inviteStatus !== "accepted" && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      // Resend invitation
                                      setInviteModalOpen(true);
                                    }}
                                    className="text-white hover:bg-gray-700"
                                  >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Resend Invite
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUser(user.id, user.name || "", user.email)}
                                  disabled={deletingUserId === user.id}
                                  className="text-red-400 hover:bg-red-900/30 hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {deletingUserId === user.id ? "Deleting..." : "Delete User"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Invite Modal */}
        <InviteUserModal
          open={inviteModalOpen}
          onOpenChange={setInviteModalOpen}
          onInviteSuccess={fetchUsers}
        />
      </div>
    </div>
  );
}
