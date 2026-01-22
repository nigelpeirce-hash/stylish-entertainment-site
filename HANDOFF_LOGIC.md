# Handoff Logic for Ali & Nigel

## Overview
The handoff system allows Nigel and Ali to assign bookings to each other for different purposes:

- **🙋‍♀️ For Ali**: Assigns booking to Ali for client communication, follow-ups, and action items
- **🛠️ For Nigel**: Assigns booking to Nigel for technical review, setup planning, and equipment needs

## How It Works

### Booking Detail Page
On any booking detail page (`/admin/bookings/[id]`), you'll see two buttons:

1. **🙋‍♀️ For Ali** - Assigns the booking to Ali
   - Sets `assignedTo` to `"ali"`
   - Sets `handoffStatus` to `"action_needed"`
   - Sends a Pushover notification to Ali's phone (if Nigel clicks it)

2. **🛠️ For Nigel** - Assigns the booking to Nigel
   - Sets `assignedTo` to `"husband"` (or `"nigel"`)
   - Sets `handoffStatus` to `"tech_review"`
   - Resets `isTechReady` to `false`

### Handoff Statuses

- `"action_needed"` - Booking needs Ali's attention (client communication, follow-ups)
- `"tech_review"` - Booking needs Nigel's technical review (equipment, setup, logistics)
- `"tech_alert"` - Urgent technical issue requiring immediate attention
- `"awaiting_quote"` - Tech review complete, waiting for quote/preparation

### API Endpoint
The handoff is handled by: `/api/admin/bookings/[id]/handoff`

**Actions:**
- `assign` - Assign booking to Ali or Nigel
- `tech_alert` - Ali sends urgent technical alert to Nigel
- `tech_done` - Nigel finishes tech review, returns to Ali

### Notifications
When Nigel assigns a booking to Ali, a Pushover notification is sent:
- **Title**: "Nigel passed you a booking: [Client Name]"
- **Message**: Shows the booking details
- **Deep Link**: Opens directly to the booking detail page

## Demo Mode - View Ali's Dashboard

When logged in as admin, you can view Ali's dashboard by:

1. **Using the Query Parameter**: Add `?view=ali` to the admin dashboard URL
   - Example: `http://localhost:3001/admin?view=ali`

2. **Using the "View as Ali" Button**: If you're a SuperAdmin (Nigel), you'll see buttons:
   - "👁️ View as Ali" - Switch to Ali's view
   - "👁️ View as Nigel" - Switch back to Nigel's view
   - "Exit Demo" - Return to your actual logged-in view

### What Changes in Demo Mode:
- Dashboard header shows "Ali's Desk" instead of "Admin Dashboard"
- Display name shows "Ali Peirce"
- All filtering and data views are as if Ali is logged in
- A blue badge shows "Viewing as: Ali" with an "Exit Demo" button

## Example Workflow

1. **New Booking Arrives**
   - Booking status: `pending`
   - Assigned to: `null` (unassigned)

2. **Nigel Reviews & Assigns to Ali**
   - Nigel clicks "🙋‍♀️ For Ali"
   - `assignedTo` → `"ali"`
   - `handoffStatus` → `"action_needed"`
   - Ali receives Pushover notification

3. **Ali Contacts Client**
   - Ali reviews booking details
   - Sends quote or follows up with client
   - Updates booking status as needed

4. **Ali Requests Tech Review**
   - If booking needs technical planning
   - Ali clicks "🛠️ For Nigel" or uses tech alert
   - `assignedTo` → `"husband"`
   - `handoffStatus` → `"tech_review"`

5. **Nigel Completes Tech Review**
   - Nigel reviews equipment needs, setup requirements
   - Marks `isTechReady` → `true`
   - Clicks "Tech Done" or assigns back to Ali
   - `assignedTo` → `"ali"`
   - `handoffStatus` → `"awaiting_quote"`

## Testing Demo Mode

To test Ali's dashboard view:

1. Login as admin (Nigel)
2. Go to `/admin?view=ali`
3. Or click "👁️ View as Ali" button on the dashboard
4. You'll see exactly what Ali sees
5. Click "Exit Demo" to return to your view
