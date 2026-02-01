"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Search, CheckCircle2, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FreelanceCrew {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  roles: string[];
  isActive: boolean;
}

interface TeamAssignmentProps {
  bookingId: string;
  staffAssignments?: Array<{
    id: string;
    role: string;
    staff: {
      id: string;
      name: string;
      email: string | null;
      phone?: string | null;
    };
  }>;
  onUpdate: () => void;
}

export function TeamAssignment({
  bookingId,
  staffAssignments = [],
  onUpdate,
}: TeamAssignmentProps) {
  const [crew, setCrew] = useState<FreelanceCrew[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("DJ");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roles = ["DJ", "Lighting", "Styling", "Musician", "Production"];

  useEffect(() => {
    fetchCrew();
  }, [selectedRole]);

  const fetchCrew = async () => {
    try {
      const response = await fetch(
        `/api/admin/freelance-crew?activeOnly=true&role=${selectedRole}`
      );
      if (response.ok) {
        const data = await response.json();
        setCrew(data.crew || []);
      }
    } catch (error) {
      console.error("Error fetching crew:", error);
    }
  };

  const handleAssign = async () => {
    if (!selectedStaffId || !selectedRole) {
      setError("Please select a staff member and role");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/bookings/staff/confirm/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          staffId: selectedStaffId,
          role: selectedRole,
          sendEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to assign staff");
      }

      setSuccess(sendEmail ? "Staff assigned successfully! Confirmation email sent." : "Staff assigned successfully!");
      setSelectedStaffId("");
      setSearchQuery("");
      setOpen(false);

      // Refresh assignments
      setTimeout(() => {
        onUpdate();
        setSuccess("");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter crew based on search query
  const filteredCrew = crew.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Grey only staff already assigned *for this role* (not other roles)
  const assignedInThisRole = staffAssignments
    .filter((a) => (a.role || "").toLowerCase() === selectedRole.toLowerCase())
    .map((a) => a.staff?.id)
    .filter((id): id is string => !!id);
  const assignedStaffIdsSet = new Set(assignedInThisRole);

  const allGreyed = filteredCrew.length > 0 && filteredCrew.every((m) => assignedStaffIdsSet.has(m.id));

  return (
    <Card className="bg-gray-800 border-champagne-gold/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-champagne-gold" />
          Team Assignment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Role Selection */}
        <div>
          <Label className="text-gray-300 mb-2 block">Filter by Role</Label>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <Button
                key={role}
                variant={selectedRole === role ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedRole(role);
                  setSelectedStaffId("");
                  setSearchQuery("");
                }}
                className={
                  selectedRole === role
                    ? "bg-champagne-gold text-black hover:bg-champagne-gold/90"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                {role}
              </Button>
            ))}
          </div>
        </div>

        {/* Staff Searchable Dropdown */}
        <div className="space-y-2">
          <Label className="text-gray-300">Select Staff Member</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
                type="button"
              >
                {selectedStaffId
                  ? crew.find((member) => member.id === selectedStaffId)?.name ||
                    "Select staff..."
                  : "Select staff..."}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command
                className="bg-gray-900 border-gray-700"
                shouldFilter={false}
              >
                <CommandInput
                  placeholder="Search staff..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="text-white"
                />
                <CommandList>
                  <CommandEmpty>No staff found for {selectedRole}.</CommandEmpty>
                  {allGreyed && (
                    <div className="px-2 py-3 text-sm text-amber-400/90 border-b border-gray-700">
                      All {selectedRole} crew are already assigned. Choose another role or add more in Staff Management.
                    </div>
                  )}
                  <CommandGroup>
                    {filteredCrew.map((member) => {
                      const isAssigned = assignedStaffIdsSet.has(member.id);
                      return (
                        <CommandItem
                          key={member.id}
                          value={member.id}
                          onSelect={() => {
                            if (!isAssigned) {
                              setSelectedStaffId(member.id);
                              setOpen(false);
                            }
                          }}
                          disabled={isAssigned}
                          className={`${
                            isAssigned
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          } text-white hover:bg-gray-800`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <span>{member.name}</span>
                              {member.email && (
                                <span className="text-xs text-gray-400">
                                  ({member.email})
                                </span>
                              )}
                            </div>
                            {isAssigned && (
                              <Badge className="bg-green-900/30 text-green-400 border-green-500/30 text-xs">
                                Assigned
                              </Badge>
                            )}
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Send confirmation email toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sendEmail"
            checked={sendEmail}
            onCheckedChange={(checked) => setSendEmail(checked === true)}
            className="border-champagne-gold/50 data-[state=checked]:bg-champagne-gold data-[state=checked]:border-champagne-gold"
          />
          <Label htmlFor="sendEmail" className="text-sm text-gray-300 cursor-pointer">
            Send confirmation email to artist
          </Label>
        </div>

        {/* Assign Button */}
        <Button
          type="button"
          onClick={handleAssign}
          disabled={isSubmitting || !selectedStaffId || !selectedRole}
          className="w-full bg-champagne-gold text-black hover:bg-champagne-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Assigning..." : "Assign Staff"}
        </Button>

        {/* Error/Success Messages */}
        {error && (
          <div className="p-2 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-xs">
            {error}
          </div>
        )}
        {success && (
          <div className="p-2 bg-green-900/30 border border-green-500/50 rounded text-green-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        )}

        {/* Current Assignments Summary */}
        {staffAssignments.length > 0 && (
          <div className="pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-2">
              Currently Assigned ({staffAssignments.length})
            </p>
            <div className="space-y-1">
              {staffAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-2 bg-gray-900/50 rounded text-sm group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[16px]">
                      {assignment.role?.toLowerCase().includes("dj") ? "🎧" : "💡"}
                    </span>
                    <span className="text-white font-medium">
                      {assignment.staff.name}
                    </span>
                    <span className="text-gray-400 text-xs">({assignment.role})</span>
                  </div>
                  <button
                    onClick={async () => {
                      if (confirm(`Remove ${assignment.staff.name} from this booking?`)) {
                        try {
                          const response = await fetch(
                            `/api/admin/bookings/staff/${assignment.id}/`,
                            {
                              method: "DELETE",
                              headers: { "Content-Type": "application/json" },
                            }
                          );

                          if (!response.ok) {
                            const data = await response.json();
                            throw new Error(data.error || "Failed to remove staff");
                          }

                          setSuccess(`${assignment.staff.name} removed successfully`);
                          setTimeout(() => {
                            onUpdate();
                            setSuccess("");
                          }, 2000);
                        } catch (err: any) {
                          setError(err.message || "Failed to remove staff");
                          setTimeout(() => setError(""), 5000);
                        }
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-900/30 rounded text-red-400 hover:text-red-300"
                    title="Remove staff member"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
