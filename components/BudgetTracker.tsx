"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { DollarSign, Plus, Trash2, Check, X, TrendingUp, AlertCircle } from "lucide-react";

interface BudgetItem {
  id: string;
  description: string;
  amount: number;
  paid: boolean;
  dueDate?: string;
}

interface BudgetTrackerProps {
  bookingId: string;
  totalBudget?: string;
  onUpdate?: (items: BudgetItem[], total: string) => Promise<void>;
}

export default function BudgetTracker({
  bookingId,
  totalBudget,
  onUpdate,
}: BudgetTrackerProps) {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ description: "", amount: "", dueDate: "" });
  const [isSaving, setIsSaving] = useState(false);

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const paidAmount = items.filter((item) => item.paid).reduce((sum, item) => sum + item.amount, 0);
  const remainingAmount = totalAmount - paidAmount;
  const paidPercentage = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

  const handleAddItem = () => {
    if (newItem.description && newItem.amount) {
      const item: BudgetItem = {
        id: Date.now().toString(),
        description: newItem.description,
        amount: parseFloat(newItem.amount) || 0,
        paid: false,
        dueDate: newItem.dueDate || undefined,
      };
      setItems([...items, item]);
      setNewItem({ description: "", amount: "", dueDate: "" });
      setIsAdding(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleTogglePaid = (id: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, paid: !item.paid } : item))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onUpdate) {
        await onUpdate(items, totalBudget || "");
      } else {
        // Fallback: save via API
        const response = await fetch(`/api/client/bookings/${bookingId}/budget`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, totalBudget }),
        });

        if (!response.ok) {
          throw new Error("Failed to save budget");
        }
      }
    } catch (error) {
      console.error("Error saving budget:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  return (
    <Card className="bg-gray-800 border-champagne-gold/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-champagne-gold" />
          Budget & Payment Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-gray-900 rounded-lg border border-gray-700"
          >
            <div className="text-sm text-gray-400 mb-1">Total Budget</div>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalAmount)}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-4 bg-gray-900 rounded-lg border border-green-500/30"
          >
            <div className="text-sm text-gray-400 mb-1">Paid</div>
            <div className="text-2xl font-bold text-green-400">{formatCurrency(paidAmount)}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-gray-900 rounded-lg border border-yellow-500/30"
          >
            <div className="text-sm text-gray-400 mb-1">Remaining</div>
            <div className="text-2xl font-bold text-yellow-400">
              {formatCurrency(remainingAmount)}
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Payment Progress</span>
            <span className="text-champagne-gold font-semibold">{paidPercentage}%</span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${paidPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-green-500 to-green-400"
            />
          </div>
        </div>

        {/* Budget Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-white">Payment Items</Label>
            {!isAdding && (
              <Button
                onClick={() => setIsAdding(true)}
                size="sm"
                className="bg-champagne-gold text-black hover:bg-gold-light"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            )}
          </div>

          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gray-900 rounded-lg border border-dashed border-gray-700 space-y-3"
            >
              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Input
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="e.g., Deposit, Final Payment"
                  className="bg-gray-800 text-white border-gray-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label className="text-white">Amount (£)</Label>
                  <Input
                    type="number"
                    value={newItem.amount}
                    onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                    placeholder="0.00"
                    className="bg-gray-800 text-white border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Due Date</Label>
                  <Input
                    type="date"
                    value={newItem.dueDate}
                    onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                    className="bg-gray-800 text-white border-gray-600"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddItem}
                  size="sm"
                  className="bg-champagne-gold text-black hover:bg-gold-light"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Add
                </Button>
                <Button
                  onClick={() => {
                    setIsAdding(false);
                    setNewItem({ description: "", amount: "", dueDate: "" });
                  }}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <DollarSign className="w-12 h-12 mx-auto mb-2 text-gray-600" />
              <p>No payment items yet. Add your first payment to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    item.paid
                      ? "bg-green-900/20 border-green-500/30"
                      : "bg-gray-900 border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => handleTogglePaid(item.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        item.paid
                          ? "bg-green-500 border-green-500"
                          : "border-gray-600 hover:border-champagne-gold"
                      }`}
                    >
                      {item.paid && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{item.description}</div>
                      <div className="text-sm text-gray-400">
                        {formatCurrency(item.amount)}
                        {item.dueDate && ` • Due: ${new Date(item.dueDate).toLocaleDateString()}`}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteItem(item.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Alerts */}
        {items.some(
          (item) =>
            !item.paid &&
            item.dueDate &&
            new Date(item.dueDate) < new Date() &&
            new Date(item.dueDate) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <div className="text-yellow-400 text-sm">
                Some payments are due soon or overdue
              </div>
            </div>
          </motion.div>
        )}

        {/* Save Button */}
        {items.length > 0 && (
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-champagne-gold text-black hover:bg-gold-light"
          >
            {isSaving ? "Saving..." : "Save Budget"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
