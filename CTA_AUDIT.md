# CTA Audit – One CTA Per Page

**Goal:** No page should have 2 CTAs. Each page either has its own prominent CTA section OR uses the site-wide CTA.

## Logic (components/SiteWideCTA.tsx)

- **PREFIX_HIDE** – Site-wide CTA hidden on all paths under: `/admin`, `/contact`, `/contact-us`, `/thank-you`
- **EXACT_HIDE** – Site-wide CTA hidden on pages that have their own prominent CTA section

## Pages with Own CTA (site-wide hidden)

| Path | CTA type |
|------|----------|
| `/what-we-do` | Check Availability |
| `/what-we-do/lighting` | Check Availability |
| `/what-we-do/equipment-dj-band-sound-kit` | Check Availability |
| `/what-we-do/venue-decoration` | **Site-wide CTA** (no page CTA) |
| `/services` | Discuss Your Requirements |
| `/services/venue-styling` | Get in Touch |
| `/services/lighting-design` | Get in Touch |
| `/services/djs` | Get in Touch |
| `/services/kit-hire` | Get in Touch |
| `/services/fire-pit-hire` | Get in Touch |
| `/parties` | Get in Touch |
| `/parties/private-parties` | Get in Touch |
| `/parties/christmas` | Request a Proposal |
| `/parties/corporate` | Request a Corporate Proposal |
| `/parties/corporate-events` | Get in Touch |
| `/artists/djs` | Get in Touch / Get Your Free Quote |
| `/artists/musicians` | Get in Touch |
| `/artists/party-djs` | Check Availability / Get in Touch |
| `/wedding-dj` | Check Your Date / Check Availability |
| `/weddings/wedding-lighting` | Inquire Online |
| `/weddings/wedding-entertainment` | Tile CTAs |
| `/party-planning-and-organising` | Request an Event Proposal |
| `/hire` | Contact link |
| `/kin-house-wiltshire` | Get in Touch |
| `/mells-barn-weddings` | Get in Touch |
| `/babington-wedding-info` | Get in Touch |
| `/pennard-house-lighting` | Request a Quote |
| `/venues/north-cadbury-court` | Get in Touch |

## Pages Using Site-wide CTA

All other public pages (home, about, galleries, blogs, etc.) use the site-wide CTA:  
“Ready to create something extraordinary?” + Get in Touch / Call.
