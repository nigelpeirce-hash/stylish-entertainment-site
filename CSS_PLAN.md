# CSS Plan: Font & Field Sizes (Contact, Admin, Client Portal)

## Goal
Increase font sizes by **~25%** and scale up **field/box sizes** across:
- **Contact form** (contact-us)
- **Admin** (admin layout + booking detail, inbox, etc.)
- **Client portal** (client/bookings/[id])

## Approach

### 1. Scoped wrappers
- **Contact**: `.contact-ui` on the contact form section (ContactUsClient).
- **Admin**: `.admin-page` on `body` (already applied in admin layout).
- **Portal**: `.portal-ui` on the main PortalView container.

### 2. Font size overrides (~25% up)
| Tailwind | Default | Scaled (×1.25) |
|----------|---------|----------------|
| text-xs  | 0.75rem | 0.9375rem      |
| text-sm  | 0.875rem| 1.09375rem     |
| text-base| 1rem    | 1.25rem        |
| text-lg  | 1.125rem| 1.40625rem     |
| text-xl  | 1.25rem | 1.5625rem      |
| text-2xl | 1.5rem  | 1.875rem       |
| text-3xl | 1.875rem| 2.34rem        |

Applied via `globals.css` selectors like  
`.contact-ui .text-sm { font-size: 1.09375rem; }`  
so existing utility classes are scaled inside each wrapper.

### 3. Field / box sizes
- **Inputs, textareas, selects**: `min-height: 2.75rem`, `padding: 0.65rem 1rem`, `font-size: 1.09375rem` within scoped wrappers.
- **Cards**: Slightly increased padding where consistent (e.g. `CardContent`).
- **Buttons**: Min-height and padding scaled proportionally.

### 4. Files touched
- `app/globals.css` – scoped overrides.
- `app/contact-us/ContactUsClient.tsx` – add `contact-ui` wrapper.
- `components/client/PortalView.tsx` – add `portal-ui` to root.
- Admin uses existing `admin-page` on body; overrides target `.admin-page`.

### 5. Exclusions
- Marketing pages (e.g. blog, galleries) unchanged.
- Countdown clock and other decorative components keep existing sizes unless inside portal.

### 6. Cloudinary (client portal uploads)
- **Choose file (PDF, Word)**: Upload uses Cloudinary. If not configured, the API returns a clear error and the UI suggests pasting a link instead.
- Env: `CLOUDINARY_CLOUD_NAME` or `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, plus `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`. See `.env.local.example`.

### 7. Client emails card (admin booking detail)
- **Client emails** card shows emails to/from the client (from booking threads + 1st touch e.g. enquiry, quote, portal invite).
- Fetches `GET /api/admin/enquiries/[bookingId]/emails`. Placed above Email Composition Center on the booking detail page.
