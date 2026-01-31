# Lighting & Venue Styling Quote Generator

## Goal

A simple quote generator for **Lighting Design** and **Venue Styling** services, similar in spirit to the artist (DJ/musician) quote flow but built around **many line items with different units and prices** (e.g. 3000m fairy lights in 10m strings, festoon, lanterns). It should be easy for a non-technical person to use and not clutter the main service pages.

## How It Differs From Artist Quotes

| Aspect | Artist quote | Lighting / Venue styling quote |
|--------|--------------|---------------------------------|
| Items | Few (DJs, musicians) with a fee each | Many (fairy lights, festoon, lanterns, etc.) |
| Pricing | One fee per artist | Per unit: per 10m string, per metre, each |
| Who builds it | Admin picks artists + fees, sends email | Client or admin picks items + quantities; total calculated |
| Output | Email with options; book-from-quote | Quote summary (copy / email / attach to booking) |

## Data Model

- **ServiceQuoteItem** (new table)
  - `id`, `name`, `description`, `unit` (e.g. "per 10m string", "per metre", "each")
  - `pricePerUnit`, `category` ("lighting" | "venue_styling")
  - `displayOrder`, `isActive`, `createdAt`, `updatedAt`

Admin manages these items; the quote generator reads them by category and shows name, unit, price, and a quantity input. Total = sum of (pricePerUnit × quantity) per line.

## UX Principles

1. **Don’t clutter** – Main lighting/venue-styling pages stay as marketing; add a single **“Get a quote”** (or “Quote calculator”) button.
2. **One clear path** – Button opens a **modal** or goes to a **dedicated quote page** (e.g. `/services/lighting-design/quote`, `/services/venue-styling/quote`) with one form.
3. **Simple form** – Category fixed by page (lighting vs venue styling). List of items with quantity only; running total; CTA “Request this quote” or “Copy quote”.
4. **Non-tech friendly** – Plain language, no jargon. Labels like “Fairy lights (warm white), per 10m string” and “Quantity” or “How many?”.

## Implementation Phases

### Phase 1 – Foundation (this project start)

- [x] **Schema**: `ServiceQuoteItem` model + migration
- [x] **Design doc**: This file
- [ ] **API**: Admin CRUD for service quote items; public GET by category (read-only) for the quote builder
- [ ] **Admin UI**: Simple list + add/edit modal for quote items
- [ ] **Quote generator component**: Reusable component that:
  - Takes `category` (lighting | venue_styling)
  - Fetches items from API
  - Renders list: name, unit, price, quantity input
  - Shows running total
  - “Copy quote” and/or “Request quote” (link to contact form with summary)
- [ ] **Wire into services**: “Get a quote” on Lighting Design and Venue Styling pages → opens modal or navigates to quote page

### Phase 2 – Later

- Optional: Preset “packages” (e.g. “Fairy light canopy – 300m”) that prefill line items
- Optional: Attach quote to a booking (store as note or structured data)
- Optional: Email quote to client (like artist quote) with PDF or formatted body

## Example Items (for seed/reference)

| Name | Unit | Category | Example price |
|------|------|----------|----------------|
| Fairy lights (warm white), 10m string | per 10m string | lighting | — |
| Fairy lights (white), 10m string | per 10m string | lighting | — |
| Festoon lighting | per metre | lighting | — |
| Lanterns (assorted) | each | venue_styling | — |
| Fairy light canopy / draping | per metre | lighting | — |

Prices are configurable in admin; no hardcoding in the quote UI.

## One-time setup

1. **Run the migration** so the `ServiceQuoteItem` table exists. If you use Supabase/SQL migrations, run the contents of `prisma/migrations/add_service_quote_items.sql`. If you use `prisma migrate`, the schema is already updated; create a migration or run `prisma db push` in dev.
2. **Add quote items** in Admin → **Lighting & Styling Quote Items** (e.g. Fairy lights warm white 10m string, Fairy lights white 10m string, Festoon per metre, Lanterns each). Set name, unit, price, and category (lighting or venue_styling).
3. **Test** on `/services/lighting-design` and `/services/venue-styling`: click “Get a quote”, add quantities, copy quote or “Request this quote”.
