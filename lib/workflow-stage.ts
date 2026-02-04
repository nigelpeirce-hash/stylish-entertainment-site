/**
 * Workflow stage for admin bookings: New enquiry → Booking form received → Deposit received.
 * Used for traffic light styling and labels across admin list, 90-day command, and detail.
 */

export type WorkflowStage = "deposit_received" | "new_enquiry" | "booking_form_received";

export interface BookingForStage {
  depositReceived?: boolean | null;
  depositReceivedManual?: boolean | null;
  NewEnquiry?: { id: string }[] | null;
}

export function getWorkflowStage(booking: BookingForStage): WorkflowStage {
  const depositReceived = !!(booking.depositReceived || booking.depositReceivedManual);
  if (depositReceived) return "deposit_received";
  const fromNewEnquiry = !!(booking.NewEnquiry && booking.NewEnquiry.length > 0);
  if (fromNewEnquiry) return "new_enquiry";
  return "booking_form_received";
}

export function getWorkflowLabel(stage: WorkflowStage): string {
  switch (stage) {
    case "deposit_received":
      return "Booking Confirmed";
    case "new_enquiry":
      return "New Enquiry";
    case "booking_form_received":
      return "Booking Form Received";
    default:
      return "New Enquiry";
  }
}

export function getTrafficLightStyles(stage: WorkflowStage): string {
  switch (stage) {
    case "deposit_received":
      return "border-emerald-500 bg-emerald-950/20 hover:bg-emerald-950/30";
    case "new_enquiry":
      return "border-red-500 bg-red-950/20 hover:bg-red-950/30";
    case "booking_form_received":
      return "border-amber-500 bg-amber-950/20 hover:bg-amber-950/30";
    default:
      return "border-gray-500 bg-gray-800 hover:bg-gray-750";
  }
}

/** Tailwind classes for a small workflow stage badge (e.g. on detail page). */
export function getWorkflowBadgeClass(stage: WorkflowStage): string {
  switch (stage) {
    case "deposit_received":
      return "bg-emerald-500/30 text-emerald-400 border border-emerald-500/50";
    case "new_enquiry":
      return "bg-red-500/30 text-red-400 border border-red-500/50";
    case "booking_form_received":
      return "bg-amber-500/30 text-amber-400 border border-amber-500/50";
    default:
      return "bg-gray-500/30 text-gray-400 border border-gray-500/50";
  }
}

/** Phase Tracker: enquiry-first timeline (New Enquiry → Deposit Paid → Dispatched) */
export const PHASE_STEPS = [
  "New Enquiry",
  "Quote Sent",
  "Deposit Paid",
  "Artist Assigned",
  "Brief Sent",
  "Dispatched",
] as const;

export type PhaseStepIndex = 0 | 1 | 2 | 3 | 4 | 5;

export interface BookingForPhase {
  artistQuoteSentAt?: string | null;
  depositReceived?: boolean | null;
  depositReceivedManual?: boolean | null;
  staffAssignments?: { status: string }[];
}

/**
 * Returns the current phase index (0–5) for the Phase Tracker.
 * New Enquiry → Quote Sent → Deposit Paid → Artist Assigned → Brief Sent → Dispatched
 */
export function getPhaseStepIndex(booking: BookingForPhase): PhaseStepIndex {
  const depositReceived = !!(booking.depositReceived || (booking as { depositReceivedManual?: boolean })?.depositReceivedManual);
  const quoteSent = !!booking.artistQuoteSentAt;
  const staff = booking.staffAssignments ?? [];
  const anyDispatched = staff.some((a) => a.status === "dispatched");
  const anyAssigned = staff.length > 0;

  if (anyDispatched) return 5;
  if (depositReceived && anyAssigned) return 4; // Brief Sent (no DB field; treat as post-assign)
  if (anyAssigned) return 3;
  if (depositReceived) return 2;
  if (quoteSent) return 1;
  return 0;
}
