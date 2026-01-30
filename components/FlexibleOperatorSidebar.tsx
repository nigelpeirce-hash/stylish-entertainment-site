"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Settings,
  X,
  Plus,
  Trash2,
  Lock,
  Unlock,
  FileText,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  Save,
  Loader2,
  Shield,
  History,
  CheckCircle,
  Circle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FeeLineItem {
  id: string;
  description: string;
  amount: number;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category?: string;
}

interface AuditLog {
  id: string;
  action: string;
  description: string;
  performedBy: string | null;
  createdAt: string;
}

interface Booking {
  id: string;
  bookingReference: string | null;
  name: string;
  email: string;
  eventDate: string;
  venueName: string;
  venuePostcode: string | null;
  status: string;
  priority: string;
  conflictStatus: string | null;
  finalBalance: string | null;
  services: string[]; // For checking if DJ is selected
  adminNotes?: string | null;
  feeBreakdown?: FeeLineItem[] | null;
  taxInclusive?: boolean | null;
  taxRate?: number | null;
  selectedTemplate?: string | null;
  depositReceived?: boolean | null;
  depositReceivedManual?: boolean | null;
  finalDetailsConfirmed?: boolean | null;
  finalDetailsConfirmedManual?: boolean | null;
  djWorksheetApproved?: boolean | null;
  djWorksheetApprovedManual?: boolean | null;
  auditLogs?: AuditLog[];
}

interface FlexibleOperatorSidebarProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export function FlexibleOperatorSidebar({
  booking,
  isOpen,
  onClose,
  onUpdate,
}: FlexibleOperatorSidebarProps) {
  const [feeItems, setFeeItems] = useState<FeeLineItem[]>([
    { id: "1", description: "Service Fee", amount: 0 },
  ]);
  const [taxInclusive, setTaxInclusive] = useState(true);
  const [taxRate, setTaxRate] = useState(20); // Default UK VAT 20%
  const [totalFee, setTotalFee] = useState(0);
  const [overrideMode, setOverrideMode] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [adminNotes, setAdminNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [eventDateOverride, setEventDateOverride] = useState(booking.eventDate);
  const [venueNameOverride, setVenueNameOverride] = useState(booking.venueName);
  
  // Manual Override States
  const [depositReceived, setDepositReceived] = useState(booking.depositReceived || false);
  const [depositReceivedManual, setDepositReceivedManual] = useState(booking.depositReceivedManual || false);
  const [finalDetailsConfirmed, setFinalDetailsConfirmed] = useState(booking.finalDetailsConfirmed || false);
  const [finalDetailsConfirmedManual, setFinalDetailsConfirmedManual] = useState(booking.finalDetailsConfirmedManual || false);
  const [djWorksheetApproved, setDjWorksheetApproved] = useState(booking.djWorksheetApproved || false);
  const [djWorksheetApprovedManual, setDjWorksheetApprovedManual] = useState(booking.djWorksheetApprovedManual || false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(booking.auditLogs || []);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Calculate total fee
  useEffect(() => {
    const subtotal = feeItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    if (taxInclusive) {
      setTotalFee(subtotal); // Tax already included
    } else {
      const tax = subtotal * (taxRate / 100);
      setTotalFee(subtotal + tax); // Add tax
    }
  }, [feeItems, taxInclusive, taxRate]);

  // Fetch email templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/admin/email-templates/?isActive=true");
        if (response.ok) {
          const data = await response.json();
          setTemplates(data.templates || []);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  // Load admin notes if booking has them
  useEffect(() => {
    if (booking.adminNotes) {
      setAdminNotes(booking.adminNotes);
    }
  }, [booking.adminNotes]);

  // Load feeBreakdown from booking if it exists (with validation)
  useEffect(() => {
    if (booking.feeBreakdown && Array.isArray(booking.feeBreakdown)) {
      // Helper to safely extract numeric fee value from potentially nested objects
      // This prevents React errors from rendering objects directly
      const safeNumber = (val: any, depth: number = 0): number => {
        // Prevent infinite recursion
        if (depth > 3) return 0;
        
        if (typeof val === 'number') return isNaN(val) ? 0 : val;
        if (typeof val === 'string') {
          const parsed = parseFloat(val);
          return isNaN(parsed) ? 0 : parsed;
        }
        if (typeof val === 'object' && val !== null) {
          // Try to extract numeric value from common keys
          if (typeof val.fee === 'number') return val.fee;
          if (typeof val.amount === 'number') return val.amount;
          if (typeof val.value === 'number') return val.value;
          // If nested object, recurse (but limit depth)
          if (typeof val.fee === 'object' && val.fee !== null) {
            const nested = safeNumber(val.fee, depth + 1);
            if (nested > 0) return nested;
          }
          if (typeof val.amount === 'object' && val.amount !== null) {
            const nested = safeNumber(val.amount, depth + 1);
            if (nested > 0) return nested;
          }
          // Try to parse string values
          if (typeof val.fee === 'string') {
            const parsed = parseFloat(val.fee);
            if (!isNaN(parsed)) return parsed;
          }
          if (typeof val.amount === 'string') {
            const parsed = parseFloat(val.amount);
            if (!isNaN(parsed)) return parsed;
          }
        }
        return 0;
      };
      
      // Validate and transform feeBreakdown items
      const validItems = booking.feeBreakdown
        .filter((item: any) => item && typeof item === 'object')
        .map((item: any, index: number) => ({
          id: item.id || `loaded-${index}`,
          description: typeof item.description === 'string' ? item.description : String(item.name || 'Service Fee'),
          amount: safeNumber(item.amount) || safeNumber(item.fee) || 0,
        }));
      
      if (validItems.length > 0) {
        setFeeItems(validItems);
      }
    }
  }, [booking.feeBreakdown]);

  // Get system health badge color
  const getSystemHealthColor = () => {
    if (booking.conflictStatus === "pending") {
      return "bg-red-900/30 text-red-400 border-red-500/30";
    }
    if (booking.priority === "urgent") {
      return "bg-amber-900/30 text-amber-400 border-amber-500/30";
    }
    return "bg-green-900/30 text-green-400 border-green-500/30";
  };

  const getSystemHealthLabel = () => {
    if (booking.conflictStatus === "pending") {
      return "Conflict Detected";
    }
    if (booking.priority === "urgent") {
      return "High Priority";
    }
    return "Healthy";
  };

  const getSystemHealthIcon = () => {
    if (booking.conflictStatus === "pending") {
      return <AlertCircle className="w-4 h-4" />;
    }
    if (booking.priority === "urgent") {
      return <Clock className="w-4 h-4" />;
    }
    return <CheckCircle2 className="w-4 h-4" />;
  };

  const addFeeItem = () => {
    const newId = Date.now().toString();
    setFeeItems([...feeItems, { id: newId, description: "", amount: 0 }]);
  };

  const removeFeeItem = (id: string) => {
    if (feeItems.length > 1) {
      setFeeItems(feeItems.filter((item) => item.id !== id));
    }
  };

  const updateFeeItem = (id: string, field: "description" | "amount", value: string | number) => {
    setFeeItems(
      feeItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Validate override mode
      if (overrideMode && !overrideReason.trim()) {
        alert("Please provide a reason for override");
        setIsSaving(false);
        return;
      }

      // Save all changes
      const updates: any = {
        finalBalance: totalFee.toFixed(2),
        adminNotes: adminNotes,
        taxInclusive: taxInclusive,
        taxRate: taxRate,
        feeBreakdown: feeItems,
        overrideMode: overrideMode,
        overrideReason: overrideReason || null,
        selectedTemplate: selectedTemplate || null,
      };

      // Only update locked fields if override mode is enabled
      if (overrideMode) {
        updates.eventDate = eventDateOverride;
        updates.venueName = venueNameOverride;
      }

      const response = await fetch(`/api/admin/bookings/${booking.id}/flexible-update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          if (onUpdate) onUpdate();
        }, 2000);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save changes");
      }
    } catch (error: any) {
      console.error("Error saving changes:", error);
      alert("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplate(templateId);
    // Optionally load template details here if needed
  };

  // Handle manual override toggles
  const handleManualOverride = async (
    field: "depositReceived" | "finalDetailsConfirmed" | "djWorksheetApproved",
    value: boolean
  ) => {
    try {
      // Get admin name from session or default
      const adminName = "Husband"; // You can get this from session later

      const response = await fetch(`/api/admin/bookings/${booking.id}/manual-override/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field,
          value,
          performedBy: adminName,
        }),
      });

      if (response.ok) {
        // Update local state
        if (field === "depositReceived") {
          setDepositReceived(value);
          setDepositReceivedManual(true);
        } else if (field === "finalDetailsConfirmed") {
          setFinalDetailsConfirmed(value);
          setFinalDetailsConfirmedManual(true);
        } else if (field === "djWorksheetApproved") {
          setDjWorksheetApproved(value);
          setDjWorksheetApprovedManual(true);
        }

        // Show toast
        setToastMessage("Manual override recorded in audit log.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        // Refresh audit logs
        const auditResponse = await fetch(`/api/admin/bookings/${booking.id}/audit-logs/`);
        if (auditResponse.ok) {
          const auditData = await auditResponse.json();
          setAuditLogs(auditData.auditLogs || []);
        }

        if (onUpdate) onUpdate();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update override");
      }
    } catch (error: any) {
      console.error("Error updating manual override:", error);
      alert("An error occurred while updating override");
    }
  };

  // Format audit log date
  const formatAuditDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-champagne-gold" />
              <SheetTitle className="text-2xl font-serif text-champagne-gold">
                Flexible Operator
              </SheetTitle>
            </div>
          </div>
          <SheetDescription className="text-gray-400">
            Advanced controls for non-standard client handling
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Booking Reference & System Health */}
          <Card className="bg-gray-800/50 border-champagne-gold/30">
            <CardContent className="p-4 space-y-3">
              {booking.bookingReference && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Booking Reference</p>
                    <p className="text-white font-mono text-sm font-semibold">
                      {booking.bookingReference}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 uppercase">System Health</span>
                <span
                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${getSystemHealthColor()}`}
                >
                  {getSystemHealthIcon()}
                  {getSystemHealthLabel()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Flexible Fee Builder */}
          <Card className="bg-gray-800/50 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-2xl font-bold text-champagne-gold">£</span>
                Flexible Fee Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tax Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="taxInclusive"
                    checked={taxInclusive}
                    onCheckedChange={(checked) => setTaxInclusive(checked === true)}
                    className="border-champagne-gold/50 data-[state=checked]:bg-champagne-gold data-[state=checked]:border-champagne-gold"
                  />
                  <Label
                    htmlFor="taxInclusive"
                    className="text-sm text-gray-300 cursor-pointer"
                  >
                    Tax-Inclusive Pricing
                  </Label>
                </div>
                {!taxInclusive && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor="taxRate" className="text-xs text-gray-400">
                      VAT Rate:
                    </Label>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      max="100"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      className="w-20 h-8 bg-gray-900 border-gray-700 text-white text-xs"
                    />
                    <span className="text-xs text-gray-400">%</span>
                  </div>
                )}
              </div>

              {/* Fee Line Items */}
              <div className="space-y-3">
                {feeItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Line item description (e.g., Service Fee, Travel, Equipment)"
                        value={item.description}
                        onChange={(e) =>
                          updateFeeItem(item.id, "description", e.target.value)
                        }
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 text-sm"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">£</span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={item.amount || ""}
                          onChange={(e) =>
                            updateFeeItem(
                              item.id,
                              "amount",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="flex-1 bg-gray-800 border-gray-700 text-white text-sm"
                        />
                      </div>
                    </div>
                    {feeItems.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeeItem(item.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={addFeeItem}
                  className="w-full border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Line Item
                </Button>
              </div>

              {/* Total Fee Display */}
              <div className="mt-4 p-4 bg-champagne-gold/10 border border-champagne-gold/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-white">Total Fee:</span>
                  <span className="text-2xl font-bold text-champagne-gold">
                    £{totalFee.toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                {!taxInclusive && (
                  <p className="text-xs text-gray-400 mt-1">
                    Subtotal: £
                    {(
                      feeItems.reduce((sum, item) => sum + (item.amount || 0), 0) *
                      (1 - taxRate / 100)
                    ).toFixed(2)}{" "}
                    + VAT ({taxRate}%): £
                    {(
                      feeItems.reduce((sum, item) => sum + (item.amount || 0), 0) *
                      (taxRate / 100)
                    ).toFixed(2)}
                  </p>
                )}
                {taxInclusive && (
                  <p className="text-xs text-gray-400 mt-1">Price includes VAT</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Override Mode */}
          <Card className="bg-gray-800/50 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                {overrideMode ? (
                  <Unlock className="w-5 h-5 text-amber-400" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
                Override Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                <Checkbox
                  id="overrideMode"
                  checked={overrideMode}
                  onCheckedChange={(checked) => setOverrideMode(checked === true)}
                  className="border-amber-500/50 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                />
                <Label
                  htmlFor="overrideMode"
                  className="text-sm text-gray-300 cursor-pointer flex-1"
                >
                  Enable Manual Override
                  <span className="block text-xs text-gray-500 mt-1">
                    Unlocks locked fields (Date/Venue) for rare administrative corrections
                  </span>
                </Label>
              </div>

              {overrideMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 p-3 bg-amber-900/10 border border-amber-500/30 rounded-lg"
                >
                  <div>
                    <Label htmlFor="eventDateOverride" className="text-sm text-gray-300">
                      Event Date *
                    </Label>
                    <Input
                      id="eventDateOverride"
                      type="date"
                      value={eventDateOverride ? new Date(eventDateOverride).toISOString().split("T")[0] : ""}
                      onChange={(e) => setEventDateOverride(e.target.value)}
                      className="mt-1 bg-gray-900 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="venueNameOverride" className="text-sm text-gray-300">
                      Venue Name *
                    </Label>
                    <Input
                      id="venueNameOverride"
                      type="text"
                      value={venueNameOverride}
                      onChange={(e) => setVenueNameOverride(e.target.value)}
                      placeholder="Enter venue name"
                      className="mt-1 bg-gray-900 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="overrideReason" className="text-sm text-gray-300">
                      Reason for Change *
                    </Label>
                    <Textarea
                      id="overrideReason"
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="Please explain why this override is necessary..."
                      className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      rows={3}
                      required
                    />
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Quick-Fire Templates */}
          <Card className="bg-gray-800/50 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-champagne-gold" />
                Quick-Fire Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 focus:border-champagne-gold focus:ring-1 focus:ring-champagne-gold/50"
              >
                <option value="">Select email template...</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} {template.category ? `(${template.category})` : ""}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-2">
                Swap email templates instantly for different client types
              </p>
            </CardContent>
          </Card>

          {/* Admin Controls - Manual Override */}
          <Card className="bg-gray-800/50 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-champagne-gold" />
                Admin Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Deposit Received */}
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 flex-1">
                  <Checkbox
                    id="depositReceived"
                    checked={depositReceived}
                    onCheckedChange={(checked) =>
                      handleManualOverride("depositReceived", checked === true)
                    }
                    className={`border-2 ${
                      depositReceivedManual
                        ? "border-orange-500 data-[state=checked]:bg-orange-500"
                        : "border-green-500 data-[state=checked]:bg-green-500"
                    }`}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="depositReceived"
                      className="text-sm font-medium text-white cursor-pointer"
                    >
                      Deposit Received {depositReceivedManual && "(Manual)"}
                    </Label>
                    {depositReceivedManual && (
                      <p className="text-xs text-orange-400 mt-0.5">
                        Manual override - recorded in audit log
                      </p>
                    )}
                    {!depositReceivedManual && depositReceived && (
                      <p className="text-xs text-green-400 mt-0.5">
                        Automated status
                      </p>
                    )}
                  </div>
                  {depositReceivedManual && (
                    <div className="px-2 py-1 bg-orange-900/30 border border-orange-500/50 rounded text-xs text-orange-400">
                      Manual
                    </div>
                  )}
                  {!depositReceivedManual && depositReceived && (
                    <div className="px-2 py-1 bg-green-900/30 border border-green-500/50 rounded text-xs text-green-400">
                      Auto
                    </div>
                  )}
                </div>
              </div>

              {/* Final Details Confirmed */}
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 flex-1">
                  <Checkbox
                    id="finalDetailsConfirmed"
                    checked={finalDetailsConfirmed}
                    onCheckedChange={(checked) =>
                      handleManualOverride("finalDetailsConfirmed", checked === true)
                    }
                    className={`border-2 ${
                      finalDetailsConfirmedManual
                        ? "border-orange-500 data-[state=checked]:bg-orange-500"
                        : "border-green-500 data-[state=checked]:bg-green-500"
                    }`}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="finalDetailsConfirmed"
                      className="text-sm font-medium text-white cursor-pointer"
                    >
                      Final Details Confirmed {finalDetailsConfirmedManual && "(Manual)"}
                    </Label>
                    {finalDetailsConfirmedManual && (
                      <p className="text-xs text-orange-400 mt-0.5">
                        Manual override - recorded in audit log
                      </p>
                    )}
                    {!finalDetailsConfirmedManual && finalDetailsConfirmed && (
                      <p className="text-xs text-green-400 mt-0.5">
                        Automated status
                      </p>
                    )}
                  </div>
                  {finalDetailsConfirmedManual && (
                    <div className="px-2 py-1 bg-orange-900/30 border border-orange-500/50 rounded text-xs text-orange-400">
                      Manual
                    </div>
                  )}
                  {!finalDetailsConfirmedManual && finalDetailsConfirmed && (
                    <div className="px-2 py-1 bg-green-900/30 border border-green-500/50 rounded text-xs text-green-400">
                      Auto
                    </div>
                  )}
                </div>
              </div>

              {/* DJ Worksheet Approved - Only show if DJ service is selected */}
              {booking.services?.includes("DJs") && (
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      id="djWorksheetApproved"
                      checked={djWorksheetApproved}
                      onCheckedChange={(checked) =>
                        handleManualOverride("djWorksheetApproved", checked === true)
                      }
                      className={`border-2 ${
                        djWorksheetApprovedManual
                          ? "border-orange-500 data-[state=checked]:bg-orange-500"
                          : "border-green-500 data-[state=checked]:bg-green-500"
                      }`}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="djWorksheetApproved"
                        className="text-sm font-medium text-white cursor-pointer"
                      >
                        DJ Worksheet Approved {djWorksheetApprovedManual && "(Manual)"}
                      </Label>
                      {djWorksheetApprovedManual && (
                        <p className="text-xs text-orange-400 mt-0.5">
                          Manual override - recorded in audit log
                        </p>
                      )}
                      {!djWorksheetApprovedManual && djWorksheetApproved && (
                        <p className="text-xs text-green-400 mt-0.5">
                          Automated status
                        </p>
                      )}
                    </div>
                    {djWorksheetApprovedManual && (
                      <div className="px-2 py-1 bg-orange-900/30 border border-orange-500/50 rounded text-xs text-orange-400">
                        Manual
                      </div>
                    )}
                    {!djWorksheetApprovedManual && djWorksheetApproved && (
                      <div className="px-2 py-1 bg-green-900/30 border border-green-500/50 rounded text-xs text-green-400">
                        Auto
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Audit Trail History */}
              {auditLogs.length > 0 && (
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <History className="w-4 h-4 text-champagne-gold" />
                    <h4 className="text-sm font-semibold text-white">History</h4>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {auditLogs.slice(0, 10).map((log) => (
                      <div
                        key={log.id}
                        className="p-2 bg-gray-900/50 rounded border border-gray-700 text-xs"
                      >
                        <p className="text-gray-300">{log.description}</p>
                        <p className="text-gray-500 mt-0.5">
                          {formatAuditDate(log.createdAt)}
                          {log.performedBy && ` • ${log.performedBy}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Internal Admin Notes */}
          <Card className="bg-gray-800/50 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="w-5 h-5 text-champagne-gold" />
                Private Admin Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add private notes that are never seen by the client. These follow the booking through the entire funnel..."
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 min-h-[120px]"
                rows={6}
              />
              <p className="text-xs text-gray-400 mt-2">
                These notes are for internal use only and will never be shared with the client.
              </p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="sticky bottom-0 bg-gray-900 border-t border-champagne-gold/30 p-4 -mx-6 -mb-6">
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving || (overrideMode && !overrideReason.trim())}
                className="flex-1 bg-champagne-gold text-black hover:bg-champagne-gold/90"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Changes
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-700 text-gray-300"
              >
                Close
              </Button>
            </div>
            {saveSuccess && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-green-400 mt-2 text-center"
              >
                All changes saved successfully!
              </motion.p>
            )}
          </div>
        </div>
      </SheetContent>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-orange-900/95 border border-orange-500/50 rounded-lg shadow-lg p-4 max-w-md"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-orange-400" />
              <p className="text-white font-medium">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Sheet>
  );
}
