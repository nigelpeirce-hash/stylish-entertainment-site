# CookieYes Cookie Categorization Guide

**Date:** January 27, 2026  
**Site:** stylishentertainment.co.uk

## Cookie Analysis

### ✅ **Keep These Cookies (Legitimate for Your Next.js Site)**

#### **Necessary Cookies** (Required for basic functionality)

1. **`__cf_bm`** (Cloudflare Bot Management)
   - **Domain:** `.stylishentertainment.co.uk`
   - **Duration:** 1 hour
   - **Purpose:** Cloudflare bot protection (Vercel uses Cloudflare)
   - **Action:** ✅ Keep in "Necessary" category

2. **`cookieyes-consent`** (CookieYes Consent)
   - **Domain:** `stylishentertainment.co.uk`
   - **Duration:** 1 year
   - **Purpose:** Remembers user's cookie consent preferences
   - **Action:** ✅ Keep in "Necessary" category

3. **`cf-cookie-banner`** (CookieYes Banner)
   - **Domain:** `stylishentertainment.co.uk`
   - **Duration:** Session
   - **Purpose:** Stores cookie banner acceptance
   - **Action:** ✅ Keep in "Necessary" category

4. **`_GRECAPTCHA`** (Google reCAPTCHA)
   - **Domain:** `www.google.com`
   - **Duration:** 6 months
   - **Purpose:** Google reCAPTCHA v3 for spam protection on contact forms
   - **Action:** ✅ Keep in "Necessary" category (security/anti-spam)

5. **`rc::a`, `rc::f`, `rc::c`, `rc::b`** (Google reCAPTCHA)
   - **Domain:** `google.com`
   - **Duration:** Session/Never
   - **Purpose:** Google reCAPTCHA bot detection
   - **Action:** ✅ Keep in "Necessary" category (security/anti-spam)

6. **`csrftoken`** (Mixcloud CSRF Protection)
   - **Domain:** `.mixcloud.com`
   - **Duration:** 1 year
   - **Purpose:** CSRF protection for Mixcloud embeds (DJ pages use Mixcloud players)
   - **Action:** ✅ Keep in "Functional" category (third-party embed)

### ❌ **Remove These Cookies (From Old WordPress Site)**

These cookies are from your old WordPress site and should be **deleted** from CookieYes:

1. **`wpEmojiSettingsSupports`** (WordPress Emoji)
   - **Domain:** `stylishentertainment.co.uk`
   - **Duration:** Session
   - **Purpose:** WordPress emoji support (not used in Next.js)
   - **Action:** ❌ **DELETE** - This is from old WordPress site

2. **`elementor`** (WordPress Elementor)
   - **Domain:** `stylishentertainment.co.uk`
   - **Duration:** Never
   - **Purpose:** WordPress Elementor page builder (not used in Next.js)
   - **Action:** ❌ **DELETE** - This is from old WordPress site

## Recommended Actions in CookieYes Dashboard

### Step 1: Delete Old WordPress Cookies

1. Go to CookieYes dashboard → **Cookie List**
2. Find these cookies and click **Delete**:
   - `wpEmojiSettingsSupports`
   - `elementor`

### Step 2: Categorize Remaining Cookies

#### **Necessary Category:**
- `__cf_bm` (Cloudflare)
- `cookieyes-consent` (CookieYes)
- `cf-cookie-banner` (CookieYes)
- `_GRECAPTCHA` (Google reCAPTCHA)
- `rc::a`, `rc::f`, `rc::c`, `rc::b` (Google reCAPTCHA)

#### **Functional Category:**
- `csrftoken` (Mixcloud) - For DJ page embeds

### Step 3: Update Cookie Descriptions (Optional)

You can add custom descriptions in CookieYes to explain what each cookie does:

**Example descriptions:**
- **Cloudflare (`__cf_bm`):** "Protects site from bots and malicious traffic"
- **CookieYes (`cookieyes-consent`):** "Stores your cookie consent preferences"
- **Google reCAPTCHA:** "Protects contact forms from spam submissions"
- **Mixcloud (`csrftoken`):** "Required for embedded music players on DJ profile pages"

## Why These Cookies Exist

### Cloudflare (`__cf_bm`)
- **Why:** Vercel (your hosting) uses Cloudflare for DDoS protection
- **Needed:** Yes, for security

### CookieYes Cookies
- **Why:** Your cookie consent banner
- **Needed:** Yes, for GDPR compliance

### Google reCAPTCHA
- **Why:** Your contact forms use reCAPTCHA v3 for spam protection
- **Needed:** Yes, prevents spam submissions

### Mixcloud (`csrftoken`)
- **Why:** Your DJ profile pages embed Mixcloud music players
- **Needed:** Yes, for embedded content to work

### WordPress Cookies (OLD)
- **Why:** Leftover from old WordPress site
- **Needed:** ❌ No - Delete these

## Next Steps

1. ✅ **Delete** `wpEmojiSettingsSupports` and `elementor` cookies
2. ✅ **Verify** all other cookies are properly categorized
3. ✅ **Test** cookie banner on your live site
4. ✅ **Update** cookie descriptions if desired

## Cookie Policy Page

Make sure your cookie policy page (if you have one) lists these cookies with their purposes. CookieYes can generate this automatically.

---

**Note:** CookieYes may continue to discover cookies from old WordPress site if:
- Old site is still running
- DNS still points to old server
- Browser cache contains old cookies

If you see more WordPress cookies appearing, they're likely from browser cache or old site still being accessed. Clear browser cache or ensure old site is fully decommissioned.
