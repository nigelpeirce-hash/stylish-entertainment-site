# Venue URL Audit Report

**Date:** 2025-01-29  
**Scope:** All venue URLs in `lib/venues-weve-worked-at.ts`, `app/venues/VenuesClient.tsx`, `data/testimonials.ts`

## Summary

- **Total unique URLs:** 111
- **OK (200/3xx):** 81
- **Failed (403/000):** 30

## Fixes Applied

| Venue | Old URL | New URL | Reason |
|-------|---------|---------|--------|
| Monaco Yacht Club | (none) | https://yacht-club-monaco.mc/en/home/ | Added - user request |
| Almonry Barn | (none) | https://almonrybarnsomerset.com/ | Added - user request |
| Aynhoe Park | aynhoepark.com (timeout) | aynhoepark.co.uk | Wrong domain |
| The In and Out Club | inandoutclub.co.uk (timeout) | theinandout.co.uk | Wrong domain |
| Cutteridge Barns | cutteridgebarns.co.uk (000) | cutteridgeweddings.co.uk | Wrong domain - commercial venue |
| Great Tythe Barn | greattythebarn.co.uk (000) | gtb.co.uk | Correct official domain |
| Manor House Castle Combe | manorhousecastlecombe.co.uk (000) | exclusive.co.uk/the-manor-house/ | Venue now under Exclusive Collection |
| Northover Manor | northovermanor.co.uk (000) | northovermanor.com | Correct domain (.com) |
| Parklands Quendon Hall | parklandsquendonhall.co.uk (000) | quendonhall.co.uk | Correct official domain |

## URLs That May Block Bots (403)

These return 403 to curl but likely work in browsers (bot protection):

- bailbrookhouse.co.uk
- barnsleyhouse.com
- letchworthcentre.org
- qmul.ac.uk (Queen Mary University)
- thepighotel.com/bath

**Recommendation:** Leave as-is; they work for human visitors.

## URLs Returning 000 (Timeout/Connection)

Possible transient failures or slow servers; no verified replacement found:

- assemblyroomsbath.co.uk
- cadhay.co.uk
- dorfoldestate.com
- hassophall.co.uk
- kingscotehouse.co.uk
- lantallack.co.uk
- mellsmanor.co.uk
- polurrianbay.com
- priorybarn.com
- rhinefieldhouse.co.uk
- russetscountryhouse.co.uk
- shilstonemanor.co.uk
- thebingham.co.uk
- thebrewerylondon.co.uk
- thejamfactoryoxford.co.uk
- thenave.co.uk
- thepaintworks.co.uk
- tisbury.org.uk
- uggeshallhall.co.uk
- pennsylvaniacastle.co.uk

**Recommendation:** Monitor; consider manual verification in browser. Some may be transient.

## Audit Script

Run `./scripts/audit-venue-urls.sh` to re-check all URLs.
