"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Phone, Mail, User, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FreelanceCrew {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function FreelanceCrewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [crew, setCrew] = useState<FreelanceCrew[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [editingCrew, setEditingCrew] = useState<FreelanceCrew | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Dev bypass check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const devBypass = sessionStorage.getItem("dev_admin_bypass") === "true";
      if (devBypass) {
        fetchCrew();
        return;
      }
    }

    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    } else if (status === "authenticated") {
      fetchCrew();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, router]);

  const fetchCrew = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/freelance-crew?activeOnly=${showActiveOnly}`);
      if (response.ok) {
        const data = await response.json();
        setCrew(data.crew || []);
      }
    } catch (error) {
      console.error("Error fetching crew:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrew();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showActiveOnly]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/freelance-crew/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCrew();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete crew member");
      }
    } catch (error) {
      console.error("Error deleting crew:", error);
      alert("Failed to delete crew member");
    }
  };

  const filteredCrew = crew.filter((member) => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.roles.some((role) => role.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Freelance Crew Directory</h1>
            <p className="text-gray-400">Manage your team of freelance crew members</p>
          </div>
          <AddEditCrewDialog
            onSuccess={fetchCrew}
            editingCrew={null}
            trigger={
              <Button className="bg-champagne-gold text-black hover:bg-champagne-gold/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Crew Member
              </Button>
            }
          />
        </div>

        {/* Filters */}
        <Card className="bg-gray-800 border-champagne-gold/30 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, phone, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <Button
                variant={showActiveOnly ? "default" : "outline"}
                onClick={() => setShowActiveOnly(!showActiveOnly)}
                className={showActiveOnly ? "bg-champagne-gold text-black" : "border-champagne-gold/50 text-champagne-gold"}
              >
                {showActiveOnly ? "Active Only" : "Show All"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Crew List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCrew.map((member) => (
            <Card key={member.id} className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-2">{member.name}</CardTitle>
                    {!member.isActive && (
                      <Badge variant="outline" className="border-gray-600 text-gray-400 mb-2">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <AddEditCrewDialog
                      onSuccess={fetchCrew}
                      editingCrew={member}
                      trigger={
                        <Button variant="ghost" size="sm" className="text-champagne-gold hover:bg-champagne-gold/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(member.id, member.name)}
                      className="text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {member.email && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4 text-champagne-gold" />
                    <a href={`mailto:${member.email}`} className="hover:text-champagne-gold">
                      {member.email}
                    </a>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4 text-champagne-gold" />
                    <a href={`tel:${member.phone}`} className="hover:text-champagne-gold">
                      {member.phone}
                    </a>
                  </div>
                )}
                {member.roles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {member.roles.map((role, idx) => (
                      <Badge key={idx} className="bg-champagne-gold/20 text-champagne-gold border-champagne-gold/30">
                        {role}
                      </Badge>
                    ))}
                  </div>
                )}
                {member.roles.length === 0 && (
                  <p className="text-gray-500 text-sm">No roles assigned</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCrew.length === 0 && (
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">
                {searchTerm ? "No crew members found matching your search" : "No crew members yet. Add your first crew member to get started."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Add/Edit Crew Dialog Component
function AddEditCrewDialog({
  onSuccess,
  editingCrew,
  trigger,
}: {
  onSuccess: () => void;
  editingCrew: FreelanceCrew | null;
  trigger: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingCrew) {
      setName(editingCrew.name);
      setEmail(editingCrew.email || "");
      setPhone(editingCrew.phone || "");
      setRoles(editingCrew.roles || []);
      setIsActive(editingCrew.isActive);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setRoles([]);
      setIsActive(true);
    }
  }, [editingCrew, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const url = editingCrew
        ? `/api/admin/freelance-crew/${editingCrew.id}`
        : "/api/admin/freelance-crew";
      const method = editingCrew ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email || null,
          phone: phone || null,
          roles,
          isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save crew member");
      }

      setIsOpen(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      setRoles([...roles, newRole.trim()]);
      setNewRole("");
    }
  };

  const removeRole = (role: string) => {
    setRoles(roles.filter((r) => r !== role));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md bg-gray-800 border-champagne-gold/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-champagne-gold">
            {editingCrew ? "Edit Crew Member" : "Add Crew Member"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>

          <div>
            <Label>Roles</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRole();
                  }
                }}
                placeholder="e.g., Lighting, Sound Engineer"
                className="bg-gray-900 border-gray-700 text-white"
              />
              <Button type="button" onClick={addRole} className="bg-champagne-gold text-black">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {roles.map((role, idx) => (
                <Badge
                  key={idx}
                  className="bg-champagne-gold/20 text-champagne-gold border-champagne-gold/30 cursor-pointer"
                  onClick={() => removeRole(role)}
                >
                  {role} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-champagne-gold"
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Active
            </Label>
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-champagne-gold text-black hover:bg-champagne-gold/90"
            >
              {isSubmitting ? "Saving..." : editingCrew ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
