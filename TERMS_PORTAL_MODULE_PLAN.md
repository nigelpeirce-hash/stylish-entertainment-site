# Terms & Conditions Portal Module – Plan

**Status: PLANNED – NOT YET IMPLEMENTED**

The portal T&C acceptance flow, gating, API, and schema changes are documented here but not built. Only the supporting content (`lib/terms-content.ts` – `TERMS_ABRIDGED`, `DEPOSIT_CLAUSE`, `COMPANY_*`) and demos exist.

---

## Demo

**Direct URL**: `/terms-portal-flow-demo.html`  
**Via Admin**: `/admin/sandbox/terms-portal-demo` (embeds the demo)

Open the demo at `https://yoursite.com/terms-portal-flow-demo.html` or go to Admin → Sandbox → Terms portal demo.

---

## Summary

**First touch (enquiry)**: No T&C – contact form and client portal new booking remain lightweight.  
**Point of commitment**: T&C acceptance happens in the **client portal**, in a dedicated section at the bottom of the booking view, with personalised content and electronic signature.

---

## 1. Where T&C Lives

| Stage | T&C? | Notes |
|-------|------|-------|
| Contact form | ❌ No | Enquiry only |
| Client portal new booking | ❌ No | Enquiry only |
| Book DJ / Book from quote | ✅ Yes | Existing flows – commit to artist |
| **Client portal (per booking)** | ✅ Yes | **New module** – personalised T&Cs, e-sign, deposit non‑refundable |

---

## 2. Portal Section Placement

- **Location**: Bottom of each booking card in the client portal (or within the existing **Contract** tab).
- **Current state**: `SingleEventHero` → Contract tab → `ContractSection` already exists but shows “pending” when no terms are accepted.
- **Change**: Contract tab becomes the place where the client:
  1. Sees personalised T&Cs
  2. Electronically signs
  3. Accepts terms (including deposit non‑refundable)

---

## 3. Personalised T&Cs = Existing Terms + Personalised Wrapper

**Existing terms** (footer link `/terms-and-conditions`) live in `lib/terms-content.ts`:
- 10 sections: Booking Confirmation, Payment Terms, Cancellation Policy, Artist Availability, Setup, Venue, Equipment, Music, Liability, Data Protection
- Same content used by the public T&C page and AcceptTermsModule

**Personalised document** = wrapper (parties, booking) + **TERMS_ABRIDGED** (summary) + **TERMS_SECTIONS** (full) + deposit clause + signature blocks

### Source: `lib/terms-content.ts`

- `TERMS_ABRIDGED` – short summary (key points) for quick reading
- `TERMS_SECTIONS` – full 10 sections (same as `/terms-and-conditions` page)
- `COMPANY_NAME`, `COMPANY_ADDRESS`, `COMPANY_SIGNATORIES` – for personalised doc header/footer
- `DEPOSIT_CLAUSE` – deposit non-refundable wording
- `TERMS_LAST_UPDATED` – last updated date

### Placeholders

| Placeholder | Source |
|-------------|--------|
| **Client name** | `booking.name` |
| **Client email** | `booking.email` |
| **Event date** | `booking.eventDate` |
| **Venue** | `booking.venueName` |
| **Artist / service** | `booking.preferredDJ` or `booking.services[]` (e.g. “DJ Nige”, “DJs + Lighting”) |
| **Fee / deposit** | `booking.bookingFee` if set |
| **Acceptance date** | Generated when they sign |
| **Company address** | Static: 88 Weymouth Road, Frome, Somerset BA11 1HJ |

Content template example:

> **Booking Agreement – Personalised for [Client Name]**  
>  
> **Parties**  
> **Stylish Entertainment Ltd**  
> 88 Weymouth Road, Frome, Somerset BA11 1HJ  
>  
> **Client**  
> [Client Name]  
> [Client Email]  
>  
> **Booking Details**  
> This agreement is for the provision of **[Artist/Service]** at **[Venue]** on **[Event Date]**.  
>  
> **Summary of key terms** *(abridged)*  
> [TERMS_ABRIDGED – bullet points for quick reading]  
>  
> **Full terms and conditions**  
> [All 10 sections from TERMS_SECTIONS – same as footer /terms-and-conditions page]  
> Link to full terms: /terms-and-conditions  
>  
> **Deposit and Cancellation**  
> [DEPOSIT_CLAUSE]  
>  
> **[Client electronic signature block]**  
>  
> **For Stylish Entertainment Ltd**  
> 88 Weymouth Road, Frome, Somerset BA11 1HJ  
> Signed: Alison Peirce & Nigel Peirce *(pre‑signed)*

---

## 4. Electronic Signature

- **Option A**: Typed name as signature  
  - Input: “I confirm by typing my full name”
  - Validation: Must match `booking.name` (or allow minor variation, e.g. “John Smith” vs “John & Jane Smith”)
- **Option B**: Checkbox + typed name  
  - “I have read and accept the Terms & Conditions. I agree that typing my name below constitutes my electronic signature.”
  - Name must match client name on booking
- **Option C**: Draw/touch signature  
  - Canvas for drawing – more complex, likely unnecessary for this use case

**Recommendation**: Option B – checkbox plus typed name.

**Data to store**:
- `termsAccepted: true`
- `termsAcceptedAt: DateTime`
- `termsAcceptedIp: String?` (new field – IP at acceptance)
- `termsAcceptedName: String?` (optional – name as typed)

---

## 5. Deposit & Cancellation Clause (Generic, Watertight)

**Main principle**: Once deposits are paid, they are **non‑refundable**. The client accepts this by paying.

**Suggested clause** (generic, watertight):

> **Deposit and Cancellation**  
> By paying your deposit, you confirm that you have read and accept these terms. All deposits are **non‑refundable** once paid. In the event of cancellation by you, the deposit will not be returned.  
>  
> If you need to cancel after paying your deposit, please notify us in writing as soon as possible. Any balance paid may be refundable subject to our cancellation policy and the notice period given.  
>  
> We recommend securing cancellation insurance for your event.

*(Keep it clear and firm – no refund of deposits. No need for solicitor sign‑off if kept generic.)*

---

## 6. Schema Changes

**Prisma – Booking model**:

```prisma
termsAccepted               Boolean     @default(false)
termsAcceptedAt             DateTime?
termsAcceptedIp             String?     // NEW – IP at acceptance
termsAcceptedName           String?     // NEW – name as typed (optional)
```

**API changes**:
- `POST /api/client/bookings/[id]/accept-terms` – accept T&Cs (payload: `{ signedName }`).
- Server validates `signedName` matches `booking.name` (or close).
- Stores `termsAccepted`, `termsAcceptedAt`, `termsAcceptedIp`, `termsAcceptedName`.

---

## 7. UX Flow

1. Client opens booking in portal → Contract tab.
2. If `termsAccepted` is false:
   - Show personalised T&Cs (name, date, venue, artist).
   - Show deposit non‑refundable section.
   - Show checkbox: “I have read and accept the Terms & Conditions.”
   - Show input: “Type your full name to confirm.”
   - Submit button: “Accept & Sign”.
3. On submit:
   - Validate name matches.
   - Call API to record acceptance.
4. If `termsAccepted` is true:
   - Show confirmation (existing style).
   - Show acceptance date, IP, typed name.
   - Download PDF option (already in place, needs field alignment).

---

## 8. When to Require Acceptance

- **Option A**: Before deposit – client must accept before paying.
- **Option B**: After deposit – client accepts once they’ve paid (they’re accepting deposit is non‑refundable).
- **Option C**: At confirmation – when admin confirms booking and sends deposit invoice.

**Recommendation**: Option B – require acceptance after deposit. Client accepts that deposits are non‑refundable at that point.

---

## 9. Wiring, Plumbing & UX

### Data flow

```
GET /api/client/bookings → returns bookings with termsAccepted, termsAcceptedAt, termsAcceptedIp, termsAcceptedName
Client dashboard → SingleEventHero per booking
Contract tab → ContractSection (termsAccepted ? show confirmation : show acceptance form)
Accept form submit → POST /api/client/bookings/[id]/accept-terms → 200 → refetch booking → email sent
```

### Tab gating

- **Location**: `SingleEventHero` – Tabs: Overview | Music | Budget | Contract.
- **Logic**: If `!termsAccepted`, Overview/Music/Budget show a banner: “Please accept the Terms & Conditions in the Contract tab to continue.” Tabs stay visible but content is gated (or tabs disabled except Contract).
- **Contract tab**: Always accessible. Default/first tab when terms not accepted so client sees it immediately.
- **Alternative**: Contract tab only until accepted; then unlock others. Clearer but more restrictive.

### API plumbing

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/client/bookings` | GET | List bookings; include `termsAccepted`, `termsAcceptedAt`, `termsAcceptedIp`, `termsAcceptedName`. |
| `GET /api/client/bookings/[id]` | GET | Single booking; same fields (for detail view if needed). |
| `POST /api/client/bookings/[id]/accept-terms` | POST | Body: `{ signedName }`. Validate name, store acceptance, send email, return 200. |

### Company details & pre‑signed block (static)

- **Company**: Stylish Entertainment Ltd  
  88 Weymouth Road, Frome, Somerset BA11 1HJ

- **Signatories**: Alison Peirce & Nigel Peirce

- **Where it lives**: Static in `lib/terms-content.ts` or contract template (e.g. `COMPANY_ADDRESS`, `COMPANY_SIGNATORIES`). Same on every document.
- **No dynamic wiring**: Not from DB, not per-booking. Rendered as part of the personalised contract template.
- **PDF / print**: Full company block included in generated PDF and print view.

### Print flow

- **Print button** on Contract tab (both pending and accepted states).
- **Action**: `window.print()` or route to `/client/bookings/[id]/contract/print` with print‑only CSS.
- **Content**: Full personalised T&Cs + client signature (if accepted) + Alison & Nigel Peirce pre‑signed block. Hide nav, buttons, etc. for print.

### Component hierarchy

```
app/client/dashboard/page.tsx
  └─ SingleEventHero (per booking)
       └─ Tabs: Overview | Music | Budget | Contract
            └─ Contract tab content
                 └─ ContractSection
                      ├─ termsAccepted === false → TermsAcceptanceForm (personalised T&Cs, e‑sign, submit)
                      └─ termsAccepted === true  → TermsConfirmation (date, IP, PDF download, Print button)
```

### Email on acceptance

- **Trigger**: After successful `POST /api/client/bookings/[id]/accept-terms`.
- **Template**: “Your booking agreement has been accepted. Attached/attached link to your signed terms.” Or inline summary + link to portal to view/print.
- **Recipient**: `booking.email`.

---

## 10. Contract Tab Field Mapping

`ContractSection` currently expects:

- `terms_accepted` → use `termsAccepted`
- `acceptance_timestamp` → use `termsAcceptedAt`
- `acceptance_ip` → add `termsAcceptedIp`

Ensure the client bookings API returns these fields (with correct casing).

---

## 11. Implementation Phases

| Phase | Tasks |
|-------|-------|
| **1. Schema** | Add `termsAcceptedIp`, `termsAcceptedName` to `Booking`. |
| **2. Terms content** | `lib/terms-content.ts` already has COMPANY_*, DEPOSIT_CLAUSE, TERMS_SECTIONS. Add helper to build personalised doc from existing + wrapper. |
| **3. API** | Add `POST /api/client/bookings/[id]/accept-terms`; trigger confirmation email on acceptance. |
| **4. Portal UI** | Build acceptance form (personalised T&Cs + e‑sign) in Contract tab. **Gate** other tabs/features until terms accepted. |
| **5. Contract display** | Fix field names; show accepted state and metadata; **print button** for populated T&Cs. |
| **6. PDF / Print** | Update PDF generation: personalised terms, client signature block, **Alison & Nigel Peirce pre‑signed block**. Print-friendly page. |

---

## 12. Decided Requirements

| Question | Decision |
|----------|----------|
| Require acceptance before other portal features? | **Yes** – must be clear. Portal features (music details, budget, etc.) gated until terms accepted. |
| Deposit / cancellation wording | **Generic, watertight** – deposits non‑refundable once paid; client accepts that. No solicitor sign‑off needed. |
| Email confirmation when terms accepted? | **Yes** – send confirmation email to client on acceptance. |
| Print populated T&Cs? | **Yes** – facility to print populated T&Cs directly from the page. |
| Company pre‑signed field? | **Yes** – “Alison Peirce & Nigel Peirce” (formal). Contract shows both parties: client e‑signs; company side pre‑signed. |

### Company Pre‑Signed Field (Alison & Nigel Peirce)

Use **formal names**: **Alison Peirce & Nigel Peirce**.

The populated T&Cs / contract will show:

- **Company block** (static):  
  **Stylish Entertainment Ltd**  
  88 Weymouth Road, Frome, Somerset BA11 1HJ  
  Signed: Alison Peirce & Nigel Peirce *(pre‑signed)*

- **Client side**: Electronic signature (typed name + date when they accept).

Full company address is included so the document is a formal, personalised agreement for the client. Static on the template; contract is complete when the client signs.

### Remaining TBD

- **Name matching**: Strict (exact) vs fuzzy for e‑sign validation.
- **Timing**: Require acceptance before or after deposit.

---


## 13. Reverts Applied

- Contact form: T&C removed.
- Client portal new booking: T&C removed.
- `api/contact`: no longer requires or stores `termsAccepted`.
- `api/client/bookings`: no longer requires or stores `termsAccepted`.

**Book DJ** and **Book from quote** still use `AcceptTermsModule` at the point of booking.
