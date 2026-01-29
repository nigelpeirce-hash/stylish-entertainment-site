# Home Page Demo – Styling & Colour Notes

This is a **design-only** reference. No backend changes. Use the demo to preview styling before applying to the live site.

## How to view the demo

- **Option A:** Run the dev server and open:  
  `http://localhost:3001/home-page-demo.html`
- **Option B:** Open the file directly in a browser:  
  `public/home-page-demo.html`

---

## What the demo changes (styling & colours)

### 1. **Section backgrounds (warmer, more contrast)**

- **Current live:** Flat grays (`gray-900`, `gray-800`, `gray-700`).
- **Demo:** Slightly warmer darks with more contrast between sections:
  - Darkest: `#0f1419` (section–dark)
  - Mid: `#1a2332` (section–mid)
  - Warm: `#1c1f26` (section–warm)
  - Lighter: `#252b36` (section–lighter)

This keeps the luxe dark feel but adds depth and separation between blocks.

### 2. **Gold accent (unchanged, used more consistently)**

- Champagne gold stays `#E6C84A`.
- Used for:
  - Eyebrow badges, borders, hover states
  - Gradient on “Entertainment”, “Do”, “Clients Say”, “Team”
  - Buttons (outline + primary)
  - Card borders and hover glow

### 3. **Section dividers**

- **New:** Thin horizontal “gold line” between major sections:
  - Gradient: transparent → gold (25–40% opacity) → transparent.
- Gives a clear visual break without heavy borders.

### 4. **Cards (services, testimonials, team)**

- Background: `rgba(26, 35, 50, 0.7)` with backdrop blur where it fits.
- Border: `rgba(230, 200, 74, 0.35)`.
- **Hover:** Border brightens to ~60% gold + soft gold box-shadow (`0 0 24–32px` gold glow).
- Service card images: slight scale on hover (e.g. 1.08) + darker gradient overlay on hover.

### 5. **Buttons**

- **Outline (e.g. “Meet Our DJs”):** Gold border, transparent fill; on hover: light gold tint + scale 1.03 + gold glow.
- **Primary (e.g. “Read All Testimonials”):** Gold fill, dark text; on hover: lighter gold + scale 1.03 + glow.

### 6. **Typography**

- Same fonts: Raleway (body/UI), Playfair Display (team names).
- Gradient headings: gold → gold-light → gold, with a subtle drop-shadow for a soft glow.
- Eyebrow labels: small caps, letter-spacing, gold colour, pill-style background/border.

### 7. **Hero**

- Single full-bleed image in the demo (no slider).
- Stronger bottom gradient overlay (black 50% → 10% → transparent) so text would sit better if you add copy over the image later.
- Hero text block below uses the same gradient background as in the demo (section–warm → section–mid → section–dark).

### 8. **Light leaks**

- Same idea as live: two fixed gold orbs (top-right, bottom-left), blur, low opacity (~12% in demo).
- Keeps the ambient “luxe” feel without distracting.

---

## Applying this to the live site (CSS / Tailwind only)

1. **Tailwind / globals**
   - Add the demo’s section colours to `tailwind.config.ts` (e.g. `section-dark`, `section-mid`, `section-warm`, `section-lighter`) or keep using gray and tune with a tiny bit of custom CSS.
   - Add a utility for the **section divider** (e.g. `.section-divider` in `globals.css` with the gradient line).
   - Optionally add a **gold glow** utility (e.g. `shadow-gold` or `ring-gold`) for cards and buttons.

2. **Home page (`app/page.tsx`)**
   - Swap section backgrounds from `bg-gray-900` / `bg-gray-800` / `bg-gray-700` to the new tokens (or equivalent Tailwind/custom classes).
   - Insert `<hr className="section-divider" />` (or a decorative div) between main sections.
   - Ensure card hover states use the gold border + box-shadow as in the demo.
   - Keep existing motion (Framer Motion) and structure; only adjust classNames and any inline styles for colour/glow.

3. **Buttons**
   - In `components/ui/button.tsx` (or where the homepage buttons are styled), mirror the demo’s outline and primary hover (scale, glow). You can do this with Tailwind (e.g. `hover:shadow-[0_0_24px_rgba(230,200,74,0.35)]`) plus `hover:scale-105` if not already there.

4. **No backend or logic changes**  
   Everything above is CSS, Tailwind classes, and optional small tweaks in `globals.css`. No API or component behaviour changes are required.

---

## Summary

- **Demo file:** `public/home-page-demo.html`  
- **Purpose:** Preview a slightly warmer, more contrasted colour system, gold dividers, and stronger card/button hovers before committing to the live home page.
- **Next step:** Open the demo, compare with the live home page, and if you like it, apply the section colours, divider, and hover styles to the live site as above.
