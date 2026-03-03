# Ship Admin 500 Hotfix to main

Canonical Vercel project: **stylish-entertainment-site** (production deploys from `main`).  
No Prisma migrations or schema changes.

---

## A) Git ship steps (commands only)

```bash
# 1) Ensure clean status (no uncommitted changes except the hotfix)
git status

# 2) Pull/rebase safely (no history rewrite)
git fetch origin
git checkout main
git pull --rebase origin main

# 3) Run local build check
npm run build

# 4) Stage and commit (single hotfix commit)
git add -A
git status
git commit -m "fix(admin): avoid P2022 by omitting services/upsellItems/termsAcceptedVersion from booking queries (no migrations)"

# 5) Push to origin/main
git push origin main

# 6) Optional: tag the release (lightweight tag) and push tag
git tag admin-hotfix-p2022-$(date +%Y%m%d)
git push origin --tags
```

---

## B) Gotcha checks (checklist)

### 1) READ gotcha – queries that reference services / upsellItems / termsAcceptedVersion

| Location | Type | Risk | Notes |
|----------|------|------|--------|
| **app/api/admin/** | Admin | ✅ Fixed | All admin routes now use SAFE_BOOKING_SCALARS or minimal select; enquiries use addBookingFallbacks. |
| **app/api/admin/dashboard-summary/route.ts** | Admin | ✅ | Uses PENDING_BOOKINGS_SELECT + addBookingFallbacks. |
| **app/api/admin/bookings/[id]/route.ts** | Admin | ✅ | Uses BOOKING_SELECT_SAFE (no BOOKING_INCLUDE); PATCH whitelist omits services/upsellItems/termsAcceptedVersion. |
| **lib/monday-brief.ts** | Admin (Monday brief) | ✅ Fixed | Select no longer includes `services`; results passed through addBookingFallbacks. |
| **app/api/client/bookings/[id]/route.ts** | Client | ⚠️ Flag | `select` includes `services: true`, `upsellItems: true`. Will 500 if columns missing. |
| **app/api/client/bookings/route.ts** | Client | ⚠️ Flag | GET `select` includes `services: true`, `upsellItems: true`. Will 500 if columns missing. |
| **app/api/bookings/confirm-from-quote/route.ts** | Public | ⚠️ Flag | `select` includes `services: true`, `upsellItems: true`; then update writes them + termsAcceptedVersion. |
| **lib/ical-export.ts** | Lib (calendar export) | ⚠️ Flag | `findMany` and `findUnique` with **no select** (full row); uses `booking.services`. Will 500. |
| **app/api/cron/send-scheduled-emails/route.ts** | Cron | ⚠️ Flag | `findMany` with **no select** (full row). Will 500. |
| **app/api/cron/email-journey/route.ts** | Cron | ⚠️ Flag | Five `findMany` with **no select** (full row). Will 500. |
| **lib/email-template-utils.ts** | Lib | ⚠️ Flag | `findUnique` – check if it has select; if no select, full row. |
| **lib/booking-agreement-pdf.ts** | Lib | OK | Only receives `booking` as argument; does not run Prisma. Uses booking.services/upsellItems from caller. |
| **lib/terms-content.ts** | Lib | OK | Same; receives booking shape, no query. |
| **lib/dispatch-email.ts** | Lib | OK | Receives booking; no query. |

**BOOKING_INCLUDE:** No remaining references. Replaced by BOOKING_SELECT_SAFE / BOOKING_RELATIONS in admin bookings [id].

---

### 2) WRITE gotcha – prisma.booking.update / create / upsert writing those fields

| File | Operation | Writes | Minimal safe change (if DB columns missing) |
|------|-----------|--------|--------------------------------------------|
| **app/api/admin/create-booking-from-email/route.ts** | create | `services: []`, `upsellItems: []` | Remove from `data` for hotfix (or leave; create will 500 until migration). |
| **app/api/bookings/route.ts** | create | `services`, `upsellItems` | Non-admin. Flag only; remove from data only if you want public booking create to work without columns. |
| **app/api/client/bookings/route.ts** | create | `services`, `upsellItems` | Non-admin. Flag only. |
| **app/api/bookings/accept-terms/route.ts** | update | `termsAcceptedVersion` | Non-admin. Flag only. |
| **app/api/client/bookings/[id]/accept-terms/route.ts** | update | `termsAcceptedVersion` | Client. Flag only. |
| **app/api/bookings/confirm-from-quote/route.ts** | update | `termsAcceptedVersion`, `services`, `upsellItems` | Public confirm flow. Flag only. |
| **scripts/backfill-terms-accepted.ts** | updateMany | `termsAccepted`, `termsAcceptedAt` only | No termsAcceptedVersion; script, not route. |

**Proposal (admin-only):** Do not change any write in this hotfix. Admin create (create-booking-from-email) will still 500 on create until DB has columns; hotfix only fixed reads. For non-admin writes, document only (no code change unless you want to risk breaking flows).

---

### 3) FULL-ROW gotcha – booking query with no select or broad include

| File | Query | Admin? | Action |
|------|--------|--------|--------|
| **lib/ical-export.ts** | findMany (no select), findUnique (no select) | Used for export (admin-facing) | ⚠️ Flag only (non-route lib). Convert to explicit select omitting services/upsellItems/termsAcceptedVersion if you fix it. |
| **app/api/cron/send-scheduled-emails/route.ts** | findMany (no select) | Cron | ⚠️ Flag only. Add select with needed fields only. |
| **app/api/cron/email-journey/route.ts** | 5× findMany (no select) | Cron | ⚠️ Flag only. Add select with needed fields only. |
| **lib/email-template-utils.ts** | findUnique | Used by email send | Check: if no select, add minimal select. |
| **lib/booking-integrity.ts** | findMany / findUnique | Used by admin + others | Check each call for select. |
| **app/api/client/bookings/[id]/route.ts** | findUnique with select | Client | Select includes services/upsellItems → 500 if columns missing. Flag only. |
| **app/api/client/bookings/route.ts** | findMany with select | Client | Select includes services/upsellItems → 500. Flag only. |
| **app/api/contact/route.ts** | booking.create with services, upsellItems | Public | Write; flag only. |
| **app/api/venues/search/route.ts** | findMany | Public | Check: has select? (likely minimal; confirm.) |
| **app/api/client/check-ip-recognition/route.ts** | findMany | Client | Check for select. |
| **app/api/client/delete-account/route.ts** | findMany | Client | Check for select. |
| **lib/email-send.ts** | findFirst | Lib | Check for select. |
| **lib/client-login-notifications.ts** | findFirst | Lib | Check for select. |
| **lib/auto-dispatch-on-final-details.ts** | findUnique | Lib | Check for select. |
| **lib/send-deposit-invoice.ts** | findUnique | Lib | Check for select. |
| **lib/email-sync.ts** | findFirst | Lib | Check for select. |

All **admin** full-row or risky reads in this hotfix are already converted to SAFE_BOOKING_SCALARS or minimal select + addBookingFallbacks where payload is returned.

---

## C) Copy/paste grep commands

### Bash (Linux/macOS)

```bash
# Prisma booking usage
grep -Rn "prisma\.booking\." --include="*.ts" .

# services / upsellItems / termsAcceptedVersion (in code)
grep -Rn "services\|upsellItems\|termsAcceptedVersion" --include="*.ts" . | grep -v node_modules | grep -v ".next"

# BOOKING_INCLUDE / shared include
grep -Rn "BOOKING_INCLUDE\|BOOKING_SELECT_SAFE\|PENDING_BOOKINGS_SELECT" --include="*.ts" .

# booking update/create data writes (then inspect for services/upsellItems/termsAcceptedVersion)
grep -Rn "prisma\.booking\.\(update\|create\|upsert\)" --include="*.ts" . -A 30
```

### PowerShell

```powershell
# Prisma booking usage
Get-ChildItem -Recurse -Include *.ts | Select-String -Pattern "prisma\.booking\." | ForEach-Object { "$($_.Path):$($_.LineNumber): $($_.Line)" }

# services / upsellItems / termsAcceptedVersion (in code)
Get-ChildItem -Recurse -Include *.ts | Where-Object { $_.FullName -notmatch "node_modules|\.next" } | Select-String -Pattern "services|upsellItems|termsAcceptedVersion" | ForEach-Object { "$($_.Path):$($_.LineNumber): $($_.Line)" }

# BOOKING_INCLUDE / shared select
Get-ChildItem -Recurse -Include *.ts | Select-String -Pattern "BOOKING_INCLUDE|BOOKING_SELECT_SAFE|PENDING_BOOKINGS_SELECT" | ForEach-Object { "$($_.Path):$($_.LineNumber): $($_.Line)" }

# booking update/create (then inspect for data: { ... } and services/upsellItems/termsAcceptedVersion)
Get-ChildItem -Recurse -Include *.ts | Select-String -Pattern "prisma\.booking\.(update|create|upsert)" -Context 0,30 | ForEach-Object { "$($_.Path):$($_.LineNumber)" }
```

---

## Summary

- **Admin:** All admin booking reads in app/api/admin and lib/monday-brief now use safe select (no services/upsellItems/termsAcceptedVersion) and addBookingFallbacks where a booking payload is returned. No migrations; response shape kept with fallback arrays and null.
- **Non-admin:** Client and public routes that **read** or **write** those columns are listed above as ⚠️ Flag. They may 500 until the DB has the columns; no code change in this hotfix unless you decide to extend the fix.
