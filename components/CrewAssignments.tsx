"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { UserPlus, CheckCircle2, XCircle, Clock, Mail } from "lucide-react";

interface FreelanceCrew {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  roles: string[];
}

interface StaffAssignment {
  id: string;
  role: string;
  agreedFee: number;
  status: string;
  confirmationEmailSent: boolean;
  cancellationReason?: string | null;
  cancelledAt?: Date | null;
  staff: {
    id: string;
    name: string;
    email: string | null;
  };
}

interface CrewAssignmentsProps {
  bookingId: string;
  venueName: string;
  eventDate: string;
  djArrivalTime?: string | null;
  djStartTime?: string | null;
  staffAssignments?: StaffAssignment[];
  onUpdate: () => void;
}

export function CrewAssignments({
  bookingId,
  venueName,
  eventDate,
  djArrivalTime,
  djStartTime,
  staffAssignments = [],
  onUpdate,
}: CrewAssignmentsProps) {
  const [crew, setCrew] = useState<FreelanceCrew[]>([]);
  const [selectedCrewId, setSelectedCrewId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCrew();
  }, []);

  const fetchCrew = async () => {
    try {
      const response = await fetch("/api/admin/freelance-crew/?activeOnly=true");
      if (response.ok) {
        const data = await response.json();
        setCrew(data.crew || []);
      }
    } catch (error) {
      console.error("Error fetching crew:", error);
    }
  };

  const handleConfirmJob = async () => {
    if (!selectedCrewId || !selectedRole) {
      setError("Please select a crew member and role");
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
          staffId: selectedCrewId,
          role: selectedRole,
          sendEmail: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to confirm job");
      }

      setSuccess("Job confirmed and email sent!");
      setSelectedCrewId("");
      setSelectedRole("");
      
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-900/30 text-green-400 border border-green-500/30">
            🟢 Confirmed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-900/30 text-red-400 border border-red-500/30">
            🔴 Cancelled
          </Badge>
        );
      case "held":
      default:
        return (
          <Badge className="bg-yellow-900/30 text-yellow-400 border border-yellow-500/30">
            🟡 Pending
          </Badge>
        );
    }
  };

  const selectedCrew = crew.find((c) => c.id === selectedCrewId);

  return (
    <Card className="bg-gray-800 border-champagne-gold/30">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-champagne-gold" />
          Crew Assignments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Assignment */}
        <div className="space-y-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-gray-300 mb-2 block">Crew Member</Label>
              <Select
                value={selectedCrewId}
                onChange={(e) => setSelectedCrewId(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              >
                <option value="">Select crew member</option>
                {crew.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label className="text-gray-300 mb-2 block">Role</Label>
              <Input
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                placeholder="e.g., Lighting, Sound"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <Button
            onClick={handleConfirmJob}
            disabled={isSubmitting || !selectedCrewId || !selectedRole}
            className="w-full bg-champagne-gold text-black hover:bg-champagne-gold/90"
          >
            {isSubmitting ? "Confirming..." : "Confirm Job"}
          </Button>
          {error && (
            <div className="p-2 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-xs">
              {error}
            </div>
          )}
          {success && (
            <div className="p-2 bg-green-900/30 border border-green-500/50 rounded text-green-400 text-xs">
              {success}
            </div>
          )}
        </div>

        {/* Existing Assignments */}
        {staffAssignments.length > 0 && (
          <div className="space-y-3">
            {staffAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-4 bg-gray-900/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">{assignment.staff.name}</p>
                    <p className="text-gray-400 text-sm">Role: {assignment.role}</p>
                    {(() => {
                      const fee = typeof assignment.agreedFee === 'number' 
                        ? assignment.agreedFee 
                        : typeof assignment.agreedFee === 'object' && assignment.agreedFee !== null
                          ? Number((assignment.agreedFee as any).fee) || Number((assignment.agreedFee as any).amount) || 0
                          : Number(assignment.agreedFee) || 0;
                      return fee > 0 ? (
                        <p className="text-gray-400 text-sm">
                          Fee: £{fee.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      ) : null;
                    })()}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(assignment.status)}
                    {assignment.confirmationEmailSent && (
                      <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                        <Mail className="w-3 h-3 mr-1" />
                        Email Sent
                      </Badge>
                    )}
                  </div>
                </div>
                {assignment.status === "cancelled" && assignment.cancellationReason && (
                  <div className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-xs">
                    <strong>Cancelled:</strong> {assignment.cancellationReason}
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  {assignment.status !== "cancelled" && (
                    <CancelCrewDialog
                      assignmentId={assignment.id}
                      crewName={assignment.staff.name}
                      onSuccess={onUpdate}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {staffAssignments.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No crew assignments yet</p>
        )}
      </CardContent>
    </Card>
  );
}

// Cancel Crew Dialog Component
function CancelCrewDialog({
  assignmentId,
  crewName,
  onSuccess,
}: {
  assignmentId: string;
  crewName: string;
  onSuccess: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCancel = async () => {
    if (!reason.trim()) {
      setError("Please provide a cancellation reason");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/bookings/staff/${assignmentId}/cancel/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel crew");
      }

      setIsOpen(false);
      setReason("");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-red-500/50 text-red-400 hover:bg-red-900/20"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Cancel Crew
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-gray-800 border-champagne-gold/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-champagne-gold">
            Cancel Crew Assignment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <p className="text-gray-300">
            Cancelling assignment for <strong className="text-white">{crewName}</strong>
          </p>
          <p className="text-sm text-gray-400">
            A cancellation email will be sent immediately. This action will be logged in the audit trail.
          </p>

          <div>
            <Label htmlFor="reason">Cancellation Reason *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Client changed mind, Venue issue, Date conflict..."
              className="bg-gray-900 border-gray-700 text-white mt-2"
              rows={4}
              required
            />
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
              onClick={handleCancel}
              disabled={isSubmitting || !reason.trim()}
              className="flex-1 bg-red-600 text-white hover:bg-red-700"
            >
              {isSubmitting ? "Cancelling..." : "Cancel Assignment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
