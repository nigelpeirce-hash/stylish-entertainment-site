# DJ Content Guide – Where to Store & How It Displays

## Your Content (from live site pre-work)

The DJ Nige content you shared has three parts:

1. **Main bio** – Career story, Babington House, Pete Tong, Met Bar, etc.
2. **Recent Testimonials** – Venue-specific (The Met Bar, Sessions Art Club, Dorfold Hall, Babington House)
3. **Client Testimonials** – Camilla & Dan, Hollie & Lewis, etc., plus “And 74 more testimonials…”

---

## Where to Store It

### 1. Main Bio + Recent Testimonials → Admin > DJs > Edit DJ Nige > **Full bio**

Store in the **Full bio** field. Use this format:

```
Main bio paragraph 1.

Main bio paragraph 2.

---

**The Met Bar, London**
"Thank you Nige. You did a magnificent job!..."

— Rob Stringer, CEO Sony Music Worldwide, The Met Bar, London.

**Sessions Art Club, London EC2**
"Just wanted to say a massive thank you for last night Nigel..."

— Sophie & Sam Hawsley, Sessions Art Club, London

**Dorfold Hall, Nantwich, Cheshire**
"I wanted to drop you an email to thank both you and Nigel..."

— Alex & Nancy Horlock, Dorfold Hall, Nantwich, Cheshire

**Babington House Hotel, Somerset**
"Hope you're really well and had a good bank holiday weekend..."

— Max & Emma Rayner, Babington House Hotel
```

Rules:

- `---` on its own line separates the bio from Recent Testimonials
- `**Venue name**` marks each testimonial heading
- Paragraphs separated by double newline (`\n\n`)

### 2. Client Testimonials → `data/testimonials.ts` and `data/reviews.ts`

Client Testimonials come from code, not the Admin DJ form:

- `data/testimonials.ts` – main testimonials list
- `data/reviews.ts` – extra reviews

On `/artists/djs`, DJ Nige is matched to these by keywords `"nige"` / `"nigel"` in the quote (`getDJTestimonials()` in `app/artists/djs/page.tsx`).

To add or change testimonials, edit those files.

---

## Where It’s Coming From

| Source | Content | Used by |
|--------|---------|---------|
| **WeddingEntertainmentClient.tsx** (hardcoded) | Short DJ Nige bio (first paragraph only) | `/weddings/wedding-entertainment` |
| **DJ.fullBio** (database) | Main bio + Recent Testimonials | `/artists/djs`, `/wedding-dj` Read More |
| **data/testimonials.ts** + **data/reviews.ts** | Client Testimonials | `/artists/djs` only |

The live site pre-work copy was most likely:

1. Hardcoded in `WeddingEntertainmentClient.tsx` (line 30)
2. Or on `/artists/djs` from the old setup

---

## How It Displays

| Page | Main Bio | Recent Testimonials | Client Testimonials |
|------|----------|---------------------|---------------------|
| **/artists/djs** (Read more & expand) | ✅ Parsed, paragraphs | ✅ Parsed from fullBio | ✅ From testimonials/reviews |
| **/wedding-dj** (Read More) | ✅ Raw text in one block | ❌ Shown as plain text (no parsing) | ❌ Not shown |
| **/weddings/wedding-entertainment** | ❌ Hardcoded, not from DB | ❌ Not shown | ❌ Not shown |

- `/artists/djs` has full parsing (`---`, `**venue**`, paragraphs).
- `/wedding-dj` Read More shows `fullBio` as raw text (no `---` / `**venue**` parsing).
- `/weddings/wedding-entertainment` uses a hardcoded `djs` array, not the database.

---

## Next Steps

1. **Paste into Admin**  
   Admin > DJs > Edit DJ Nige > Full bio → paste the full main bio + Recent Testimonials in the format above.

2. **Check Client Testimonials**  
   Confirm DJ Nige’s testimonials exist in `data/testimonials.ts` / `data/reviews.ts` and include “nige” or “nigel” in the quote.

3. **Optional improvements**
   - Update `/wedding-dj` Read More to parse `fullBio` like `/artists/djs`.
   - Migrate `/weddings/wedding-entertainment` to use `/api/djs` instead of hardcoded data.
