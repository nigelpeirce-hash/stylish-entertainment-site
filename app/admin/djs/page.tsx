"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  Music,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

interface DJ {
  id: string;
  name: string;
  slug: string | null;
  bio: string | null;
  mixcloudUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  imageUrl: string | null;
  isActive: boolean;
  displayOrder: number;
}

export default function DJsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [djs, setDjs] = useState<DJ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    mixcloudUrl: "",
    seoTitle: "",
    seoDescription: "",
    imageUrl: "",
    isActive: true,
    displayOrder: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      fetchDJs();
    }
  }, [status, session]);

  const fetchDJs = async () => {
    try {
      const response = await fetch("/api/admin/djs");
      if (response.ok) {
        const data = await response.json();
        setDjs(data.djs || []);
      }
    } catch (error) {
      console.error("Error fetching DJs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        // Update existing
        const response = await fetch(`/api/admin/djs/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            imageUrl: formData.imageUrl || null,
            mixcloudUrl: formData.mixcloudUrl || null,
          }),
        });

        if (response.ok) {
          await fetchDJs();
          resetForm();
        } else {
          const error = await response.json();
          alert(error.error || "Failed to update DJ");
        }
      } else {
        // Create new
        const response = await fetch("/api/admin/djs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            imageUrl: formData.imageUrl || null,
            mixcloudUrl: formData.mixcloudUrl || null,
          }),
        });

        if (response.ok) {
          await fetchDJs();
          resetForm();
        } else {
          const error = await response.json();
          alert(error.error || "Failed to create DJ");
        }
      }
    } catch (error) {
      console.error("Error saving DJ:", error);
      alert("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this DJ?")) return;

    try {
      const response = await fetch(`/api/admin/djs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchDJs();
      } else {
        alert("Failed to delete DJ");
      }
    } catch (error) {
      console.error("Error deleting DJ:", error);
      alert("An error occurred");
    }
  };

  const handleEdit = (dj: DJ) => {
    setFormData({
      name: dj.name,
      bio: dj.bio || "",
      mixcloudUrl: dj.mixcloudUrl || "",
      seoTitle: dj.seoTitle || "",
      seoDescription: dj.seoDescription || "",
      imageUrl: dj.imageUrl || "",
      isActive: dj.isActive,
      displayOrder: dj.displayOrder,
    });
    setEditingId(dj.id);
    setIsAdding(true);
    setTimeout(() => {
      const formElement = document.getElementById("dj-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }
    }, 150);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      bio: "",
      mixcloudUrl: "",
      seoTitle: "",
      seoDescription: "",
      imageUrl: "",
      isActive: true,
      displayOrder: 0,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session || (session?.user as any)?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">DJs</h1>
              <p className="text-gray-400">Manage DJ profiles and information</p>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="border-champagne-gold text-champagne-gold">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* DJs List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {djs.map((dj) => (
            <Card key={dj.id} className="bg-gray-800 border-champagne-gold/30">
              <CardContent className="p-4">
                {dj.imageUrl && (
                  <img
                    src={dj.imageUrl}
                    alt={dj.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">{dj.name}</h3>
                  {!dj.isActive && (
                    <span className="px-2 py-1 bg-gray-900/30 text-gray-400 text-xs rounded border border-gray-500/30">
                      Inactive
                    </span>
                  )}
                </div>
                {dj.bio && (
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {dj.bio}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(dj)}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(dj.id)}
                    size="sm"
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
            id="dj-form"
          >
            <Card className="bg-gray-800 border-champagne-gold/30 border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{editingId ? `Edit DJ: ${formData.name || ""}` : "Create New DJ"}</span>
                  <Button
                    onClick={resetForm}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>DJ Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., DJ Nige"
                    className="bg-gray-900 text-white border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    placeholder="DJ bio and experience..."
                    className="bg-gray-900 text-white border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mixcloud URL (optional)</Label>
                  <Input
                    value={formData.mixcloudUrl}
                    onChange={(e) => setFormData({ ...formData, mixcloudUrl: e.target.value })}
                    placeholder="https://www.mixcloud.com/username/show-name/"
                    className="bg-gray-900 text-white border-gray-700"
                  />
                  <p className="text-xs text-gray-400">
                    Full Mixcloud URL (e.g., https://www.mixcloud.com/djnige/live-mix/)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                    }
                    className="bg-gray-900 text-white border-gray-700"
                  />
                  <p className="text-xs text-gray-400">Lower numbers appear first</p>
                </div>

                <div className="space-y-2">
                  <Label>SEO Title (optional - auto-generated if empty)</Label>
                  <Input
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder="e.g., DJ Nige | Professional Wedding DJ"
                    className="bg-gray-900 text-white border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label>SEO Description (optional - auto-generated with locations if empty)</Label>
                  <Textarea
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    rows={3}
                    placeholder="Auto-generated with: available in Somerset, Dorset, Wiltshire, Bristol, Bath, and Frome"
                    className="bg-gray-900 text-white border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="bg-gray-900 text-white border-gray-700"
                  />
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded mt-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="mr-2"
                    />
                    Active (visible on website)
                  </Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? "Update DJ" : "Create DJ"}
                  </Button>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-champagne-gold text-black hover:bg-gold-light"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New DJ
          </Button>
        )}
      </div>
    </div>
  );
}
