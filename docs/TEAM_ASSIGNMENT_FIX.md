# Team Assignment – DJ Nige greyed out fix

## Relevant files

| Area | File |
|------|------|
| **UI** | `components/admin/TeamAssignment.tsx` – role tabs, staff dropdown, Assign Staff button, assigned list |
| **API – crew list** | `app/api/admin/freelance-crew/route.ts` – GET with `?activeOnly=true&role=DJ` (filters by `roles` array) |
| **API – assign** | `app/api/admin/bookings/staff/confirm/route.ts` – POST to create/update assignment, optional confirmation email |
| **Email** | `lib/email-staff-confirmation.ts` – `staffConfirmationEmail()`; sent via Resend in staff/confirm when `sendEmail` and `staff.email` |
| **Data shape** | `lib/transformers/booking-transformer.ts` – sanitizes `booking.staffAssignments` (including `cancelledAt`) |
| **Page** | `app/admin/bookings/[id]/page.tsx` – passes `staffAssignments` to `TeamAssignment` |

---

## Root cause (2–3 bullets)

1. **Cancelled assignments were still counting as “assigned”**  
   The “assigned” set was built from all `staffAssignments` for the selected role. Assignments with `cancelledAt` set (e.g. after “Cancel” in Team or after a cancel flow) were not excluded, so that staff stayed in `assignedStaffIdsSet` and stayed greyed out even though they were no longer active.

2. **`cancelledAt` was not exposed to the client**  
   The booking transformer did not include `cancelledAt` on each assignment, so the UI could not tell cancelled vs active and treated every assignment as active for the “already assigned” check.

3. **No explicit reason for disabled state**  
   Disabled options were only visually greyed; there was no tooltip or label explaining “Already assigned” vs “No email” (for confirmation), which made the behaviour look like a bug.

---

## Patch (minimal change set)

1. **`lib/transformers/booking-transformer.ts`**
   - Extended `SanitizedBooking.staffAssignments` with `cancelledAt?: Date | string | null`.
   - In the assignment mapping, set `cancelledAt: assignment?.cancelledAt ?? null` so the client receives it.

2. **`components/admin/TeamAssignment.tsx`**
   - **Assigned set:** When building `assignedInThisRole` / `assignedStaffIdsSet`, only include assignments where `!(a as { cancelledAt?: Date | string | null }).cancelledAt`. Cancelled assignments no longer grey out staff.
   - **Tooltip/labels:** For each dropdown item, set `title={reason}` (tooltip) where `reason` is “Already assigned for this role” or “No email – confirmation email won’t be sent”. For members without email (and not assigned), show an inline “(no email)” label.
   - **Currently Assigned:** Count only non-cancelled in the “Currently Assigned (N active)” text. For each assignment, if `cancelledAt` is set, show a “Cancelled” badge and a slightly muted row; hide the remove (X) button for cancelled assignments.

No changes to Prisma schema, migrations, or booking read paths (SAFE_BOOKING_SCALARS unchanged). Assign and email flow unchanged; only who is considered “assigned” for greying and how we display cancelled/disabled state.

---

## Verification checklist

- [ ] **DJ Nige selectable**  
  Open a booking where Nige was previously assigned as DJ and then that assignment was cancelled (or only a cancelled assignment exists). Select role DJ → “DJ Nige” is not greyed out and can be selected.

- [ ] **Assignment persists**  
  Select DJ Nige, leave “Send confirmation email” checked, click “Assign Staff”. After success, refresh the page; he appears under “Currently Assigned” for DJ and is greyed out in the dropdown for that role.

- [ ] **Email sent (or visible in logs)**  
  With “Send confirmation email” checked and Nige having an email, after assign check server logs or Resend dashboard for the staff confirmation email. If no email on the staff record, “(no email)” is shown in the dropdown and no email is sent (assignment still created).

- [ ] **No P2022 / no new missing-column reads**  
  No changes to booking Prisma selects; transformer only added `cancelledAt` to an existing relation. No new reads of `services` / `upsellItems` / `termsAcceptedVersion`.

- [ ] **Cancelled assignment visible**  
  For a booking with a cancelled assignment, “Currently Assigned” shows “(N active)” and the cancelled row has a “Cancelled” badge and no remove button; that staff is selectable again in the dropdown for that role.
