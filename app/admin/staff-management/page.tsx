"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { motion } from "@/lib/motion";
import {
  Search,
  Plus,
  Edit,
  Mail,
  Phone,
  User,
  Briefcase,
  FileText,
  X,
  Save,
  Loader2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import * as z from "zod";

const staffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  professionalTitle: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  technicalSkills: z.array(z.string()).default([]),
  roles: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

type StaffMember = z.infer<typeof staffSchema> & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

const commonSkills = [
  "Vinyl DJ",
  "Digital DJ",
  "Pianist",
  "Guitarist",
  "Saxophonist",
  "Lighting Tech",
  "Sound Engineer",
  "Styling Assistant",
  "Event Coordinator",
  "Photographer",
];

const commonRoles = [
  "DJ",
  "Musician",
  "Lighting",
  "Sound",
  "Styling",
  "Coordinator",
  "Production",
];

export default function StaffManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<StaffMember>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [newSkill, setNewSkill] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login/");
      return;
    }

    if (status === "authenticated") {
      if ((session?.user as any)?.role !== "admin") {
        router.push("/client/dashboard/");
        return;
      }
      fetchStaff();
    }
  }, [status, session, router]);

  const fetchStaff = async () => {
    try {
      const response = await fetch("/api/admin/staff/", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setStaff(data.staff || []);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: StaffMember) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      professionalTitle: member.professionalTitle || "",
      email: member.email,
      phone: member.phone || "",
      bio: member.bio || "",
      technicalSkills: member.technicalSkills || [],
      roles: member.roles || [],
      isActive: member.isActive,
    });
    setFormErrors({});
    setIsSheetOpen(true);
  };

  const handleAddNew = () => {
    setEditingStaff(null);
    setFormData({
      name: "",
      professionalTitle: "",
      email: "",
      phone: "",
      bio: "",
      technicalSkills: [],
      roles: [],
      isActive: true,
    });
    setFormErrors({});
    setIsSheetOpen(true);
  };

  const handleSave = async () => {
    setFormErrors({});
    setSaving(true);

    try {
      // Validate form data
      const validated = staffSchema.parse(formData);

      const url = editingStaff
        ? `/api/admin/staff/${editingStaff.id}/`
        : "/api/admin/staff/";
      const method = editingStaff ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save staff member");
      }

      // Refresh list
      await fetchStaff();
      setIsSheetOpen(false);
      setEditingStaff(null);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(errors);
      } else {
        alert(error.message || "Failed to save staff member");
      }
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.technicalSkills?.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        technicalSkills: [...(formData.technicalSkills || []), newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      technicalSkills: formData.technicalSkills?.filter((s) => s !== skill) || [],
    });
  };

  const toggleRole = (role: string) => {
    const currentRoles = formData.roles || [];
    if (currentRoles.includes(role)) {
      setFormData({
        ...formData,
        roles: currentRoles.filter((r) => r !== role),
      });
    } else {
      setFormData({
        ...formData,
        roles: [...currentRoles, role],
      });
    }
  };

  const handleDelete = async (memberId: string, memberName: string, forceDelete: boolean = false) => {
    const confirmMessage = forceDelete
      ? `⚠️ FORCE DELETE: Are you absolutely sure you want to delete "${memberName}"?\n\nThis will delete them even if they have active future bookings. This action cannot be undone.`
      : `Are you sure you want to delete "${memberName}"? This action cannot be undone.`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setDeletingId(memberId);
    try {
      const response = await fetch(`/api/admin/staff/${memberId}/${forceDelete /? "?force=true" : ""}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.error?.includes("active future bookings") && !forceDelete) {
          // Show detailed error with option to force delete
          const forceDeleteConfirm = confirm(
            `${error.error}\n\nActive assignments: ${error.activeAssignments || "unknown"}\n\nDo you want to force delete anyway? This will remove the staff member but keep their booking assignments.`
          );
          if (forceDeleteConfirm) {
            // Retry with force delete
            await handleDelete(memberId, memberName, true);
            return;
          }
        } else {
          alert(error.error || "Failed to delete staff member");
        }
        return;
      }

      // Refresh the list
      await fetchStaff();
    } catch (error: any) {
      console.error("Error deleting staff:", error);
      alert("An error occurred while deleting the staff member");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredStaff = staff.filter((member) => {
    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.professionalTitle?.toLowerCase().includes(query) ||
      (member.technicalSkills || []).some((skill) =>
        skill.toLowerCase().includes(query)
      ) ||
      (member.roles || []).some((role) => role.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Team Directory</h1>
              <p className="text-gray-400">
                Manage DJs, Musicians, and Styling staff
              </p>
            </div>
            <Button
              onClick={handleAddNew}
              className="bg-champagne-gold text-black hover:bg-champagne-gold/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Staff Member
            </Button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, email, title, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white"
            />
          </div>
        </motion.div>

        {/* Staff Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Skills
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Roles
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredStaff.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-12 text-center text-gray-400"
                        >
                          {searchQuery
                            ? "No staff members found matching your search"
                            : "No staff members yet. Click 'Add Staff Member' to get started."}
                        </td>
                      </tr>
                    ) : (
                      filteredStaff.map((member) => (
                        <tr
                          key={member.id}
                          className="hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-champagne-gold" />
                              </div>
                              <div>
                                <div className="font-medium text-white">
                                  {member.name}
                                </div>
                                {!member.isActive && (
                                  <span className="text-xs text-red-400">
                                    Inactive
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {member.professionalTitle || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-300">
                              <Mail className="w-4 h-4 text-gray-500" />
                              {member.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {member.phone ? (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                {member.phone}
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {(member.technicalSkills || []).slice(0, 2).map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="outline"
                                  className="text-xs border-champagne-gold/30 text-champagne-gold"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {(member.technicalSkills || []).length > 2 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs border-gray-600 text-gray-400"
                                >
                                  +{(member.technicalSkills || []).length - 2}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {(member.roles || []).map((role) => (
                                <Badge
                                  key={role}
                                  variant="outline"
                                  className="text-xs border-blue-500/30 text-blue-400"
                                >
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 flex-nowrap">
                              <Button
                                onClick={() => handleEdit(member)}
                                variant="outline"
                                size="sm"
                                className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
                                title="Edit staff member"
                              >
                                <Edit className="w-4 h-4 mr-1.5" />
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDelete(member.id, member.name)}
                                variant="outline"
                                size="sm"
                                disabled={deletingId === member.id}
                                className="border-red-500/30 text-red-400 hover:bg-red-900/20 hover:border-red-500/50"
                                title="Delete staff member"
                              >
                                {deletingId === member.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Trash2 className="w-4 h-4 mr-1.5" />
                                    Delete
                                  </>
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="bg-gray-900 border-gray-700 text-white overflow-y-auto w-full sm:max-w-2xl">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold text-white">
                {editingStaff ? "Edit Staff Member" : "Add Staff Member"}
              </SheetTitle>
              <SheetDescription className="text-gray-400">
                {editingStaff
                  ? "Update staff member information. Email changes will update all current and future bookings."
                  : "Add a new staff member to the team directory."}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-white">
                  Full Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
                {formErrors.name && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Professional Title */}
              <div>
                <Label htmlFor="professionalTitle" className="text-white">
                  Professional Title
                </Label>
                <Input
                  id="professionalTitle"
                  value={formData.professionalTitle || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      professionalTitle: e.target.value,
                    })
                  }
                  placeholder="e.g., Lead Lighting Designer, Vinyl DJ"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-white">
                  Primary Email <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  required
                />
                {formErrors.email && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
                )}
                {editingStaff && (
                  <p className="text-yellow-400 text-xs mt-1">
                    ⚠️ Changing email will update all current and future bookings
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-white">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio" className="text-white">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  placeholder="Brief professional biography..."
                />
              </div>

              {/* Technical Skills */}
              <div>
                <Label className="text-white">Technical Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                  {formData.technicalSkills?.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-champagne-gold/30 text-champagne-gold"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add skill..."
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    variant="outline"
                    size="sm"
                    className="border-champagne-gold/30 text-champagne-gold"
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-400 mb-1">Common skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {commonSkills
                      .filter(
                        (skill) => !formData.technicalSkills?.includes(skill)
                      )
                      .map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="cursor-pointer border-gray-600 text-gray-400 hover:border-champagne-gold/30 hover:text-champagne-gold"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              technicalSkills: [
                                ...(formData.technicalSkills || []),
                                skill,
                              ],
                            });
                          }}
                        >
                          + {skill}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>

              {/* Roles */}
              <div>
                <Label className="text-white">Roles</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {commonRoles.map((role) => (
                    <Badge
                      key={role}
                      variant={
                        formData.roles?.includes(role) ? "default" : "outline"
                      }
                      className={
                        formData.roles?.includes(role)
                          ? "bg-champagne-gold text-black cursor-pointer"
                          : "border-gray-600 text-gray-400 cursor-pointer hover:border-champagne-gold/30 hover:text-champagne-gold"
                      }
                      onClick={() => toggleRole(role)}
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive ?? true}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-champagne-gold"
                />
                <Label htmlFor="isActive" className="text-white cursor-pointer">
                  Active (visible in assignments)
                </Label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-champagne-gold text-black hover:bg-champagne-gold/90 flex-1"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setIsSheetOpen(false)}
                  variant="outline"
                  className="border-gray-700 text-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
