"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Save, X, Sparkles, Palette } from "lucide-react";
import Link from "next/link";

interface ServiceQuoteItem {
  id: string;
  name: string;
  description: string | null;
  unit: string;
  pricePerUnit: number;
  category: string;
  displayOrder: number;
  isActive: boolean;
}

const CATEGORIES = [
  { value: "lighting", label: "Lighting", icon: Sparkles },
  { value: "venue_styling", label: "Venue Styling", icon: Palette },
] as const;

export default function ServiceQuoteItemsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<ServiceQuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    unit: "",
    pricePerUnit: "",
    category: "lighting",
    displayOrder: "0",
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as { role?: string })?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  // Fetch when authenticated and when filter (All / Lighting / Venue Styling) changes
  useEffect(() => {
    if (status === "authenticated" && (session?.user as { role?: string })?.role === "admin") {
      fetchItems();
    }
  }, [status, session, filterCategory]);

  const fetchItems = async () => {
    setError("");
    try {
      setLoading(true);
      const url = filterCategory
        ? `/api/admin/service-quote-items?category=${encodeURIComponent(filterCategory)}`
        : "/api/admin/service-quote-items";
      const response = await fetch(url);
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setItems(Array.isArray(data.items) ? data.items : []);
      } else {
        setItems([]);
        setError(data.error || `Could not load items (${response.status}). Sign in again or try Retry.`);
      }
    } catch (e) {
      console.error("Error fetching items:", e);
      setItems([]);
      setError("Network error. Check connection and try Retry.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      unit: "",
      pricePerUnit: "",
      category: "lighting",
      displayOrder: "0",
      isActive: true,
    });
    setEditingId(null);
    setIsAdding(false);
    setError("");
  };

  const handleEdit = (item: ServiceQuoteItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      description: item.description || "",
      unit: item.unit,
      pricePerUnit: String(item.pricePerUnit),
      category: item.category,
      displayOrder: String(item.displayOrder),
      isActive: item.isActive,
    });
    setIsAdding(false);
    setError("");
  };

  const handleSave = async () => {
    setError("");
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!formData.unit.trim()) {
      setError("Unit is required (e.g. per 10m string, each)");
      return;
    }
    const price = parseFloat(formData.pricePerUnit);
    if (Number.isNaN(price) || price < 0) {
      setError("Price must be a number ≥ 0");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const response = await fetch(`/api/admin/service-quote-items/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            unit: formData.unit.trim(),
            pricePerUnit: price,
            category: formData.category,
            displayOrder: parseInt(formData.displayOrder, 10) || 0,
            isActive: formData.isActive,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || "Failed to update");
          return;
        }
      } else {
        const response = await fetch("/api/admin/service-quote-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            unit: formData.unit.trim(),
            pricePerUnit: price,
            category: formData.category,
            displayOrder: parseInt(formData.displayOrder, 10) || 0,
            isActive: formData.isActive,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || "Failed to create");
          return;
        }
      }
      await fetchItems();
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this quote item?")) return;
    try {
      const response = await fetch(`/api/admin/service-quote-items/${id}`, { method: "DELETE" });
      if (response.ok) await fetchItems();
      else {
        const data = await response.json();
        alert(data.error || "Failed to delete");
      }
    } catch (e) {
      console.error("Error deleting:", e);
    }
  };

  const showForm = isAdding || editingId;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin" className="text-champagne-gold/80 hover:text-champagne-gold text-sm mb-2 inline-block">
              ← Admin
            </Link>
            <h1 className="text-2xl font-bold text-white">Lighting & Venue Styling Quote Items</h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage line items for the quote generator (fairy lights, festoon, lanterns, etc.)
            </p>
          </div>
          {!showForm && (
            <Button
              onClick={() => {
                setIsAdding(true);
                setEditingId(null);
                setFormData({
                  name: "",
                  description: "",
                  unit: "",
                  pricePerUnit: "",
                  category: "lighting",
                  displayOrder: "0",
                  isActive: true,
                });
                setError("");
              }}
              className="bg-champagne-gold text-black hover:bg-champagne-gold/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add item
            </Button>
          )}
        </div>

        {showForm && (
          <Card className="bg-gray-800 border-champagne-gold/30 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">
                {editingId ? "Edit item" : "New quote item"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label className="text-gray-300">Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Fairy lights (warm white), 10m string"
                    className="bg-gray-900 border-gray-600 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Unit</Label>
                  <Input
                    value={formData.unit}
                    onChange={(e) => setFormData((f) => ({ ...f, unit: e.target.value }))}
                    placeholder="e.g. per 10m string, each, per metre"
                    className="bg-gray-900 border-gray-600 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Price per unit (£)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData((f) => ({ ...f, pricePerUnit: e.target.value }))}
                    className="bg-gray-900 border-gray-600 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Category</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
                    className="w-full mt-1 rounded-md bg-gray-900 border border-gray-600 text-white px-3 py-2"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-gray-300">Display order</Label>
                  <Input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData((f) => ({ ...f, displayOrder: e.target.value }))}
                    className="bg-gray-900 border-gray-600 text-white mt-1"
                  />
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((f) => ({ ...f, isActive: e.target.checked }))}
                    className="rounded border-gray-600 bg-gray-900"
                  />
                  <Label htmlFor="isActive" className="text-gray-300">Show in quote generator</Label>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-gray-300">Description (optional)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Short note for your reference"
                    className="bg-gray-900 border-gray-600 text-white mt-1 min-h-[80px]"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSave} disabled={saving} className="bg-champagne-gold text-black hover:bg-champagne-gold/90">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={resetForm} className="border-gray-600 text-gray-300">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2 mb-4">
          <Button
            variant={filterCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCategory("")}
            className={filterCategory === "" ? "bg-champagne-gold text-black" : "border-gray-600 text-gray-300"}
          >
            All
          </Button>
          {CATEGORIES.map((c) => (
            <Button
              key={c.value}
              variant={filterCategory === c.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory(c.value)}
              className={filterCategory === c.value ? "bg-champagne-gold text-black" : "border-gray-600 text-gray-300"}
            >
              {c.label}
            </Button>
          ))}
        </div>

        {error && (
          <Card className="bg-gray-800 border-red-500/50 mb-4">
            <CardContent className="py-3 flex items-center justify-between gap-2 flex-wrap">
              <p className="text-red-400 text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={() => fetchItems()} className="border-red-500/50 text-red-400">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : items.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="py-8 text-center text-gray-400">
              No quote items yet. Add items (e.g. fairy lights, festoon, lanterns) to use in the quote generator on Lighting Design and Venue Styling pages.
              <div className="mt-4">
                <Button variant="outline" size="sm" onClick={() => fetchItems()} className="border-gray-600 text-gray-300">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <Card key={item.id} className="bg-gray-800 border-gray-700">
                <CardContent className="py-3 px-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      {item.unit} · £{Number(item.pricePerUnit).toFixed(2)} · {item.category === "lighting" ? "Lighting" : "Venue Styling"}
                      {!item.isActive && " · Hidden"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)} className="border-gray-600 text-gray-300">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)} className="border-red-900/50 text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
