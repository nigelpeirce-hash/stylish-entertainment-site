"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Search, Package, Plus, Minus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WarehouseItem {
  id: string;
  name: string;
  category: string;
  weight: number | null;
  size: string | null;
  description: string | null;
}

interface BookingWarehouseItem {
  id: string;
  quantity: number;
  WarehouseItem: WarehouseItem;
}

interface TechnicalEquipmentProps {
  bookingId: string;
  onUpdate?: () => void;
}

const CATEGORIES = ["Sound", "Lighting", "Effects", "Rigging"] as const;
const CATEGORY_COLORS: Record<string, string> = {
  Sound: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Lighting: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Effects: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Rigging: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export function TechnicalEquipment({ bookingId, onUpdate }: TechnicalEquipmentProps) {
  const [allItems, setAllItems] = useState<WarehouseItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<BookingWarehouseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all warehouse items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/admin/warehouse-items?isActive=true");
        const data = await res.json();
        setAllItems(data.items || []);
      } catch (error) {
        console.error("Error fetching warehouse items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Fetch selected items for this booking
  useEffect(() => {
    if (!bookingId) return;
    const fetchSelected = async () => {
      try {
        const res = await fetch(`/api/admin/bookings/${bookingId}/warehouse-items`);
        const data = await res.json();
        setSelectedItems(data.items || []);
      } catch (error) {
        console.error("Error fetching selected items:", error);
      }
    };
    fetchSelected();
  }, [bookingId]);

  // Filter items by search and category
  const filteredItems = allItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    // Don't show items already selected (or show them but disabled)
    return matchesSearch && matchesCategory;
  });

  // Group filtered items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, WarehouseItem[]>);

  const addItem = async (itemId: string) => {
    setAdding(itemId);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/warehouse-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ warehouseItemId: itemId, quantity: 1 }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedItems((prev) => {
          const existing = prev.find((x) => x.WarehouseItem.id === itemId);
          if (existing) {
            return prev.map((x) =>
              x.id === existing.id ? { ...x, quantity: x.quantity + 1 } : x
            );
          }
          return [...prev, data.item];
        });
        toast({ title: "Added", description: "Item added to pick list" });
        onUpdate?.();
      } else {
        const error = await res.json();
        toast({ title: "Error", description: error.error || "Failed to add item", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to add item", variant: "destructive" });
    } finally {
      setAdding(null);
    }
  };

  const removeItem = async (itemId: string, reduceOnly = false) => {
    try {
      const res = await fetch(
        `/api/admin/bookings/${bookingId}/warehouse-items?warehouseItemId=${itemId}&reduceOnly=${reduceOnly}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setSelectedItems((prev) => {
          const existing = prev.find((x) => x.WarehouseItem.id === itemId);
          if (!existing) return prev;
          if (reduceOnly && existing.quantity > 1) {
            return prev.map((x) =>
              x.id === existing.id ? { ...x, quantity: x.quantity - 1 } : x
            );
          }
          return prev.filter((x) => x.WarehouseItem.id !== itemId);
        });
        toast({ title: "Removed", description: "Item removed from pick list" });
        onUpdate?.();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove item", variant: "destructive" });
    }
  };

  const isSelected = (itemId: string) => {
    return selectedItems.some((x) => x.WarehouseItem.id === itemId);
  };

  // Group selected items by category
  const selectedByCategory = selectedItems.reduce((acc, item) => {
    const cat = item.WarehouseItem.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, BookingWarehouseItem[]>);

  return (
    <div className="space-y-4">
      {/* Selected Items - Pick List */}
      {selectedItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Pick List ({selectedItems.reduce((sum, x) => sum + x.quantity, 0)} items)
          </h3>
          {CATEGORIES.map((category) => {
            const items = selectedByCategory[category] || [];
            if (items.length === 0) return null;
            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={CATEGORY_COLORS[category] || "bg-gray-500/20 text-gray-400"}>
                    {category}
                  </Badge>
                </div>
                <div className="space-y-1 pl-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-1.5 px-2 bg-gray-800/50 rounded border border-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          {item.quantity}x {item.WarehouseItem.name}
                        </span>
                        {item.WarehouseItem.size && (
                          <span className="text-xs text-gray-400">({item.WarehouseItem.size})</span>
                        )}
                        {item.WarehouseItem.weight && (
                          <span className="text-xs text-gray-400">{item.WarehouseItem.weight}kg</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                          onClick={() => removeItem(item.WarehouseItem.id, true)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                          onClick={() => removeItem(item.WarehouseItem.id, false)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Search & Add Items */}
      <div className="space-y-3 pt-4 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search warehouse items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null ? "bg-amber-500 text-black" : ""}
          >
            All
          </Button>
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={selectedCategory === cat ? "bg-amber-500 text-black" : ""}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Available Items by Category */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {CATEGORIES.map((category) => {
              const items = groupedItems[category] || [];
              if (items.length === 0) return null;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      {category}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 gap-2 pl-4">
                    {items.map((item) => {
                      const selected = isSelected(item.id);
                      const selectedQty = selectedItems.find((x) => x.WarehouseItem.id === item.id)?.quantity || 0;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2 px-3 bg-gray-900/50 rounded border border-gray-700 hover:border-amber-500/30 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{item.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {item.size && (
                                <span className="text-xs text-gray-400">{item.size}</span>
                              )}
                              {item.weight && (
                                <span className="text-xs text-gray-400">{item.weight}kg</span>
                              )}
                              {selected && (
                                <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/40 text-[10px]">
                                  {selectedQty} selected
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addItem(item.id)}
                            disabled={adding === item.id}
                            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold ml-2"
                          >
                            {adding === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredItems.length === 0 && !loading && (
          <p className="text-center text-gray-400 text-sm py-4">No items found</p>
        )}
      </div>
    </div>
  );
}
