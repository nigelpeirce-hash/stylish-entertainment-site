# Public Visitor Hire Workflow – 3-Point Verification

Use this checklist to verify the **public** hire flow (no token, no booking).

---

## 1. Identity check

**Test:** Open the Hire Shop in an **Incognito** window. Should show **"Create Your Setup"** (no specific venue name).

**How to verify:**
- Open an incognito/private window.
- Go to `/hire`.
- The main heading must be **"Create Your Setup"**.
- Subtext: "Add items to your basket, then request a quote. No payment now."

**Pass:** Title is "Create Your Setup" with no venue → public visitor mode.

---

## 2. Persistence

**Test:** Add a **Disco Ball** (or any hire item), **close the tab**, and **reopen** `/hire`. The item should still be in the basket (via `localStorage`).

**How to verify:**
1. On `/hire`, click **"Add to Basket"** on an item (e.g. Mirroballs / Disco Ball).
2. Open the **Basket** sidebar and confirm the item appears.
3. **Close the tab** (or navigate away).
4. Open `/hire` again (same browser, incognito or not).

**Pass:** The item is still in the basket after reopen → `localStorage` persistence works.

---

## 3. Lead creation

**Test:** Fill in the **Request Quote** form and hit **Submit**. A new enquiry should appear in Admin under **"Hire Enquiries"**.

**How to verify:**
1. Add at least one item to the basket.
2. Click **"Request Quote"**.
3. Fill in **Full name**, **Email**, **Event date** (and optionally **Venue**).
4. Click **Submit**.
5. You should see: **"Thank you! Nigel will check availability for [Date] and send your custom quote shortly."**
6. Go to **Admin → New Enquiries** (`/admin/new-enquiries`).
7. Find the **"Hire Enquiries"** section at the top.
8. The new submission should appear there with name, email, date, venue (if provided), and **Requested items** (the basket contents).

**Pass:** Success message shown, and the enquiry appears in **Hire Enquiries** → lead creation works.

---

## Quick reference

| Check        | What to look for                                      |
|-------------|--------------------------------------------------------|
| Identity    | "Create Your Setup" (no venue) on `/hire` in incognito |
| Persistence | Add item → close tab → reopen → item still in basket   |
| Lead        | Submit form → success message → Admin "Hire Enquiries" |
