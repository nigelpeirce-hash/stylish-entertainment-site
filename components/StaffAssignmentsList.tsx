"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SafeText } from "@/components/SafeText";
import { toDisplayFee } from "@/lib/transformers/booking-transformer";

export type StaffAssignmentItem = {
  id: string;
  status: string;
  role?: string | null;
  agreedFee: number;
  confirmationEmailSent?: boolean;
  confirmationSentAt?: string | null;
  acknowledgedAt?: string | null;
  dispatchedAt?: string | null;
  staff?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
};

type StaffAssignmentsListProps = {
  bookingId: string;
  staffAssignments: StaffAssignmentItem[];
};

export function StaffAssignmentsList({ bookingId, staffAssignments }: StaffAssignmentsListProps) {
  const router = useRouter();
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [errorByAssignmentId, setErrorByAssignmentId] = useState<Record<string, string>>({});

  const handleSendBrief = async (assignment: StaffAssignmentItem) => {
    if (!assignment.staff?.email || assignment.status === "dispatched" || sendingId) return;
    setSendingId(assignment.id);
    setErrorByAssignmentId((prev) => {
      const next = { ...prev };
      delete next[assignment.id];
      return next;
    });
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffAssignmentId: assignment.id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = typeof data?.error === "string" ? data.error : "Failed to send brief";
        setErrorByAssignmentId((prev) => ({ ...prev, [assignment.id]: message }));
        return;
      }
      setErrorByAssignmentId((prev) => {
        const next = { ...prev };
        delete next[assignment.id];
        return next;
      });
      router.refresh();
    } catch (err) {
      console.error("Send brief failed:", err);
      setErrorByAssignmentId((prev) => ({
        ...prev,
        [assignment.id]: "Failed to send brief",
      }));
    } finally {
      setSendingId(null);
    }
  };

  if (staffAssignments.length === 0) {
    return <p className="text-gray-400 text-sm">No staff assigned yet</p>;
  }

  return (
    <div className="space-y-3">
      {staffAssignments.map((assignment) => {
        const hasEmail = !!assignment.staff?.email;
        const isDispatched = assignment.status === "dispatched";
        const isSending = sendingId === assignment.id;
        const canSend = hasEmail && !isDispatched && !isSending;

        return (
          <div
            key={assignment.id}
            className="p-3 bg-gray-900/50 rounded-lg border border-gray-700"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[20px]">
                  {assignment.role?.toLowerCase().includes("dj") ? "🎧" : "💡"}
                </span>
                <p className="text-white font-semibold">
                  <SafeText>{assignment.staff?.name ?? "Unknown"}</SafeText>
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  assignment.status === "held"
                    ? "bg-blue-900/30 text-blue-400 border border-blue-500/30"
                    : assignment.status === "dispatched"
                      ? "bg-green-900/30 text-green-400 border border-green-500/30"
                      : "bg-gray-700 text-gray-300 border border-gray-600"
                }`}
              >
                {assignment.status === "held"
                  ? "Date Held"
                  : assignment.status === "dispatched"
                    ? "Dispatched"
                    : assignment.status}
              </span>
            </div>
            <p className="text-gray-400 text-xs mb-1">
              Role: <SafeText>{assignment.role}</SafeText>
            </p>
            {assignment.staff?.email && (
              <p className="text-gray-400 text-xs">
                Email:{" "}
                <span className="text-champagne-gold">
                  <SafeText>{assignment.staff.email}</SafeText>
                </span>
              </p>
            )}
            {assignment.staff?.phone && (
              <p className="text-gray-400 text-xs">
                Phone:{" "}
                <span className="text-champagne-gold">
                  <SafeText>{assignment.staff.phone}</SafeText>
                </span>
              </p>
            )}
            {!assignment.staff?.email && !assignment.staff?.phone && (
              <p className="text-xs text-yellow-400 mt-1">⚠️ No contact info available</p>
            )}
            <p className="text-gray-400 text-xs">
              Fee: £
              <SafeText>
                {typeof assignment.agreedFee === "number"
                  ? assignment.agreedFee.toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : toDisplayFee(assignment.agreedFee as unknown).toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
              </SafeText>
            </p>
            {assignment.confirmationEmailSent && (
              <p className="text-xs text-green-400 mt-1">✓ Confirmation sent</p>
            )}
            {assignment.acknowledgedAt && (
              <p className="text-xs text-emerald-400 mt-1">✓ Receipt confirmed</p>
            )}
            {assignment.dispatchedAt && (
              <p className="text-xs text-gray-400 mt-1">
                Sent: {new Date(assignment.dispatchedAt).toLocaleString("en-GB")}
              </p>
            )}
            <div className="mt-2">
              <button
                type="button"
                disabled={!canSend}
                onClick={() => handleSendBrief(assignment)}
                className="px-3 py-1.5 text-xs font-medium rounded border border-champagne-gold/30 text-champagne-gold bg-gray-800/80 hover:bg-champagne-gold/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800/80"
              >
                {isSending ? "Sending…" : "Send brief"}
              </button>
              {errorByAssignmentId[assignment.id] && (
                <p className="text-xs text-red-400 mt-1">{errorByAssignmentId[assignment.id]}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
