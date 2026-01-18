# Timeline & Tasks Code - Removed for Now (Remember for Later)

This file contains the code that was removed from the client dashboard. Keep for future reference.

## Removed Components:
1. EventTimeline - Timeline component for event schedule
2. WeddingPlanningChecklist - Task checklist component

## Removed Code from `page.tsx`:

### handleTaskToggle function (lines 65-82):
```typescript
const handleTaskToggle = (bookingId: string) => {
  return async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/client/bookings/${bookingId}/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, completed }),
      });
      
      if (response.ok) {
        // Refresh bookings to get updated task status
        fetchBookings();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
};
```

### Multiple Bookings View - Removed sections:
- WeddingPlanningChecklist (lines 306-314)
- EventTimeline (lines 328-334)

### SingleEventHero - Removed from:
- EventTimeline in Overview tab (lines 69-73)
- WeddingPlanningChecklist in Planning tab (lines 76-84)

## Imports to remove:
- `import WeddingPlanningChecklist from "@/components/WeddingPlanningChecklist";`
- `import EventTimeline from "@/components/EventTimeline";`

## Date: Current
## Note: Can be restored later when needed
