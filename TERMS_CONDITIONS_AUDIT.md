# Terms & Conditions – Booking Flow Audit

## Executive Summary

T&Cs are **not** consistently wired into booking flows. Several entry points that create or confirm bookings lack explicit acceptance.

## Current State

### ✅ Flows WITH T&C Acceptance

| Flow | Page | API | Component |
|------|------|-----|-----------|
| Book from quote | `/book-from-quote` | `POST /api/bookings/confirm-from-quote` | `AcceptTermsModule` |
| DJ booking confirmation | `/dj-booking-confirmation` | `POST /api/bookings` | Inline checkbox + link |
| Secure booking (dashboard) | `/dashboard/secure-booking` | N/A (placeholder) | Inline checkbox + dialog |

### ❌ Flows WITHOUT T&C Acceptance

| Flow | Page | API | Issue |
|------|------|-----|-------|
| **Book DJ** | `/book-dj` | `POST /api/bookings` | Hardcodes `termsAccepted: true` – no checkbox, user never sees T&Cs |
| **Contact form** | `/contact-us` | `POST /api/contact` | Creates booking – no T&C checkbox at all |
| **Client portal new booking** | `/client/bookings/new` | `POST /api/client/bookings` | No T&C checkbox; API doesn’t store `termsAccepted` |

## Booking Flows (Entry Points)

1. **Contact form** (`/contact-us`) – Enquiry/initial request → creates **Booking** (pending)
2. **Book DJ** (`/book-dj`) – Direct DJ booking → creates **Booking** via `/api/bookings`
3. **Book from quote** (`/book-from-quote?token=...`) – Confirm quote → updates **Booking** via `confirm-from-quote`
4. **DJ booking confirmation** (`/dj-booking-confirmation`) – Full DJ booking form → creates **Booking** via `/api/bookings`
5. **Client portal new booking** (`/client/bookings/new`) – Logged‑in client → creates **Booking** via `/api/client/bookings`

## Database

- `Booking.termsAccepted` (Boolean, default false)
- `Booking.termsAcceptedAt` (DateTime?)

## Existing Components

- **`AcceptTermsModule`** – Reusable T&C checkbox with dialog (uses `lib/terms-content.ts`)
- **`lib/terms-content.ts`** – Shared T&C sections
- **`/terms-and-conditions`** – Public T&C page

## Recommended UX

- T&Cs must be accepted at the **point of booking** (confirming artist/service).
- Use `AcceptTermsModule` everywhere for consistency and full T&C access.
- Submit button disabled until T&Cs are accepted.

## Implementation Plan

1. **Book DJ** – ✅ Added `AcceptTermsModule`, wired `termsAccepted` from checkbox to API.
2. **Contact form** – ❌ Reverted – too heavy for first touch. No T&C at enquiry stage.
3. **Client portal new booking** – ❌ Reverted – first touch, no T&C.
4. **Client portal (per booking)** – 📋 Planned – see **TERMS_PORTAL_MODULE_PLAN.md** for full plan. Personalised T&Cs, e-signature, 14‑day UK cooling‑off clause.
