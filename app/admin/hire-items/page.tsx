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
  Package,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

interface HireItem {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  price: number;
  stockAvailable: number;
  imageUrl: string | null;
  category: string | null;
  isActive: boolean;
}

export default function HireItemsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<HireItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
    price: 50,
    stockAvailable: 0,
    imageUrl: "",
    category: "",
    isActive: true,
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
      fetchItems();
    }
  }, [status, session]);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/admin/hire-items");
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        // Update existing
        const response = await fetch(`/api/admin/hire-items/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            imageUrl: formData.imageUrl || null,
            category: formData.category || null,
          }),
        });

        if (response.ok) {
          await fetchItems();
          resetForm();
        } else {
          const error = await response.json();
          alert(error.error || "Failed to update item");
        }
      } else {
        // Create new
        const response = await fetch("/api/admin/hire-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            imageUrl: formData.imageUrl || null,
            category: formData.category || null,
          }),
        });

        if (response.ok) {
          await fetchItems();
          resetForm();
        } else {
          const error = await response.json();
          alert(error.error || "Failed to create item");
        }
      }
    } catch (error) {
      console.error("Error saving item:", error);
      alert("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/admin/hire-items/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchItems();
      } else {
        alert("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("An error occurred");
    }
  };

  const handleEdit = (item: HireItem) => {
    setFormData({
      name: item.name,
      description: item.description || "",
      seoTitle: item.seoTitle || "",
      seoDescription: item.seoDescription || "",
      price: item.price,
      stockAvailable: item.stockAvailable,
      imageUrl: item.imageUrl || "",
      category: item.category || "",
      isActive: item.isActive,
    });
    setEditingId(item.id);
    setIsAdding(true);
    // Scroll to form after state updates
    setTimeout(() => {
      const formElement = document.getElementById("hire-item-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // If form element not found, scroll to bottom
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }
    }, 150);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      seoTitle: "",
      seoDescription: "",
      price: 50,
      stockAvailable: 0,
      imageUrl: "",
      category: "",
      isActive: true,
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
              <h1 className="text-4xl font-bold mb-2">Hire Shop Items</h1>
              <p className="text-gray-400">Manage hire items - prices, stock, and details</p>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="border-champagne-gold text-champagne-gold">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {items.map((item) => (
            <Card key={item.id} className="bg-gray-800 border-champagne-gold/30">
              <CardContent className="p-4">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                  {!item.isActive && (
                    <span className="px-2 py-1 bg-gray-900/30 text-gray-400 text-xs rounded border border-gray-500/30">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                  {item.description || "No description"}
                </p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-bold text-champagne-gold">
                    £{item.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400">
                    Stock: {item.stockAvailable}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(item)}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
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
            id="hire-item-form"
          >
            <Card className="bg-gray-800 border-champagne-gold/30 border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{editingId ? `Edit Item: ${formData.name || ""}` : "Create New Item"}</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Item Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Lanterns"
                      className="bg-gray-900 text-white border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category (optional)</Label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., decor, lighting"
                      className="bg-gray-900 text-white border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Item description..."
                    className="bg-gray-900 text-white border-gray-700"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (£) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                      }
                      className="bg-gray-900 text-white border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock Available *</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.stockAvailable}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stockAvailable: parseInt(e.target.value) || 0,
                        })
                      }
                      className="bg-gray-900 text-white border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>SEO Title (optional - auto-generated if empty)</Label>
                  <Input
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder="e.g., Lanterns Hire | Wedding Decor Hire"
                    className="bg-gray-900 text-white border-gray-700"
                  />
                  <p className="text-xs text-gray-400">
                    Leave empty to auto-generate: "{formData.name || "Item"} Hire | Stylish Entertainment"
                  </p>
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
                  <p className="text-xs text-gray-400">
                    Leave empty to auto-generate with location information
                  </p>
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
                    Active (visible on hire shop)
                  </Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? "Update Item" : "Create Item"}
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
            Create New Item
          </Button>
        )}
      </div>
    </div>
  );
}
