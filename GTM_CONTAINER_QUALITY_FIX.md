# GTM Container Quality – Fix “Urgent” Action Items

Your GTM container (**GTM-WB3F6V7**) is showing **Urgent** with two action items:

1. **Additional domains detected for configuration** – Add domains where your tag runs.
2. **Missing Google tags** – Add a Google tag in GTM for each destination you send data to.

Work through the steps below. Allow **up to 24 hours** after changes for Container Quality to update.

---

## Quick start – where to click

1. Open [tagmanager.google.com](https://tagmanager.google.com) → select container **GTM-WB3F6V7**.
2. On the **GTM home** screen, find **Container quality** (or **Tag quality**) near the top.
3. Click **View issues** or **View all issues** to open **Action items**.
4. You’ll see the two items above. Fix **Missing Google tags** first (add the Google tag), then **Additional domains** (add your domains to that tag’s configuration).

---

## 1. Monitored domains / Additional domains detected

GTM has detected your container running on domain(s) that aren’t in your configured list. Add them so diagnostics and measurement work correctly.

### Steps

1. Open [Google Tag Manager](https://tagmanager.google.com) → select container **GTM-WB3F6V7**.
2. On the GTM **home** screen, find the **Container quality** / **Tag quality** section (often at the top or in a sidebar).
3. Click **View issues** or **View all issues** (or similar) to open the action items.
4. Find **“Additional domains detected for configuration”** (or **“Manage which domains are monitored”**).
5. Click **Add** / **Manage domains** and add:
   - `www.stylishentertainment.co.uk`
   - `stylishentertainment.co.uk`
6. If you use **Vercel preview** URLs (e.g. `*.vercel.app`), you can add the main preview domain **or** leave them out and only monitor production. Your choice.
7. Save. The “Additional domains detected” warning should clear once GTM re-evaluates.

**Where to add domains:** Often in the **Google tag** settings: GTM → **Google tags** tab (or Tags → your Google tag) → open the tag → **Configure your domains** (or **Show all** → **Configure your domains**). Add `www.stylishentertainment.co.uk` and `stylishentertainment.co.uk` there. If the “Additional domains” action item offers an **Add** button for specific detected domains, use that as well.

---

## 2. Missing Google tags – Add a Google tag in GTM

Your site sends data to **Google Analytics 4** (e.g. **G-349239221**). GTM wants a **Google tag** *inside* the container for that destination. Right now, GA is loaded separately via the `GoogleAnalytics` component in your app. Moving GA into GTM fixes “Missing Google tags” and keeps everything in one place.

### 2a. Create the Google tag in GTM

1. In GTM, go to **Tags** → **New**.
2. Click **Tag Configuration** → choose **Google tag**.
3. **Tag ID:** `G-349239221` (your GA4 Measurement ID).  
   - Get it from [GA4](https://analytics.google.com) → **Admin** → **Data Streams** → your web stream → **Measurement ID**.
4. **Triggering:** Click **Triggering** → **Initialization – All Pages** (or **All Pages**).  
   - This loads the Google tag on every page load.
5. **Name** the tag (e.g. `GA4 – Google tag`).
6. **Save**.

### 2b. Remove duplicate GA from your site (recommended)

Your app currently loads GA **twice**:

- Via the **GoogleAnalytics** component (gtag.js + `gtag('config', 'G-349239221')`).
- Soon via the **Google tag** you just added in GTM.

Running both can double-count events. **Remove** the `GoogleAnalytics` component from the app and rely only on GTM for GA.

**Code change:** In `app/layout.tsx`, remove the `GoogleAnalytics` import and `<GoogleAnalytics />` usage. Keep **GTM** and **CookieYes** as they are.  
(See “Optional code change” below for the exact edit.)

### 2c. Publish and verify

1. In GTM, click **Submit** → **Publish** (add a version name if you like, e.g. “Add Google tag + domains”).
2. On your live site, open [Tag Assistant](https://tagassistant.google.com) (or DevTools → Network) and confirm:
   - GTM loads.
   - The **Google tag** fires (e.g. requests to `googletagmanager.com` / `google-analytics.com`).
   - GA4 receives data ( **Reports** → **Realtime** in GA4).

After this, “Missing Google tags” should clear once Container Quality updates.

---

## 3. CookieYes 403 (from GTM) – reminder

If you still see a **403** for `cdn-cookieyes.com` triggered by **GTM**:

- Your app already loads CookieYes via the **CookieYes** component.
- Find any **tag in GTM** that loads CookieYes (or `cdn-cookieyes.com` / `1246a38a4c6731928c675e0f`).
- **Disable or delete** that tag, then **Publish**.

See **`COOKIEYES_GTM_403_FIX.md`** for details.

---

## 4. Optional code change – remove `GoogleAnalytics` component

**Do this only after** you’ve added the **Google tag** in GTM and published. Otherwise GA will stop until the tag is live.

In **`app/layout.tsx`**:

1. **Remove** the import:  
   `import GoogleAnalytics from "@/components/GoogleAnalytics";`
2. **Remove** the component usage (the line on its own):  
   `<GoogleAnalytics />`

Keep `GoogleTagManager` and `CookieYes`. Redeploy, then verify GA via Tag Assistant and GA4 Realtime.

---

**Reference:** [Troubleshoot tag issues with Tag Diagnostics](https://support.google.com/tagmanager/answer/14681508) (Google Help).

---

## Checklist

- [ ] Add **www.stylishentertainment.co.uk** and **stylishentertainment.co.uk** to monitored/configured domains in GTM.
- [ ] Create **Google tag** in GTM (Tag ID: `G-349239221`, trigger: **Initialization – All Pages**).
- [ ] **Publish** the GTM container.
- [ ] **(Recommended)** Remove `GoogleAnalytics` from `app/layout.tsx` and redeploy.
- [ ] **Verify** GA4 Realtime and Tag Assistant.
- [ ] **Optional:** Remove or fix CookieYes tag in GTM if you still see the 403.
- [ ] Re-check **Container quality** in GTM after 24 hours.

---

## Summary

| Issue | Fix |
|-------|-----|
| Additional domains detected | Add `www.stylishentertainment.co.uk` and `stylishentertainment.co.uk` to monitored/configured domains. |
| Missing Google tags | Add a **Google tag** in GTM (GA4 `G-349239221`), fire on All Pages; remove `GoogleAnalytics` from the app. |
| CookieYes 403 from GTM | Disable/delete the CookieYes tag in GTM; app loads CookieYes via `CookieYes` component. |
