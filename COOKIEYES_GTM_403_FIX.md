# CookieYes 403 from GTM – Fix

## What’s happening

Console shows:

```
GET https://cdn-cookieyes.com/client_data/src=%22https://cdn-cookieyes.com/client_data/1246a38a4c6731928c675e0f/script.js%22/script.js
net::ERR_ABORTED 403 (Forbidden)
```

The stack trace points to **gtm.js** (Google Tag Manager). So **GTM** is loading (or trying to load) CookieYes, and the URL is wrong: it has `src="https://..."` encoded in the path, which produces a malformed request and a 403.

The **Next.js app** already loads CookieYes via the `CookieYes` component in `app/layout.tsx` (correct URL, skip on `/admin` and localhost). You don’t need GTM to load it as well.

---

## Fix: Remove or fix the CookieYes tag in GTM

1. Open [Google Tag Manager](https://tagmanager.google.com/) and select container **GTM-WB3F6V7**.
2. Go to **Tags** and look for any tag that:
   - Loads the CookieYes script, or
   - Uses a Custom HTML / Custom Script that references `cdn-cookieyes.com` or `1246a38a4c6731928c675e0f`.
3. Either:
   - **Disable or delete** that tag (recommended), since the site loads CookieYes itself, or  
   - **Fix** the tag so it uses exactly:  
     `https://cdn-cookieyes.com/client_data/1246a38a4c6731928c675e0f/script.js`  
     with no extra `src="..."` or quotes in the URL.
4. **Submit** a new GTM version and **Publish**.

After that, the 403 from GTM should stop. CookieYes will still run via the app.

---

## Preload “not used” warning

You may also see:

> The resource ... was preloaded using link preload but not used within a few seconds.

That can come from Next.js preloading a `priority` image (e.g. homepage slider) whose final `src` or timing doesn’t match the preload (e.g. due to shuffle or responsive `sizes`). It’s usually harmless. If you want to chase it, we can revisit the slider `priority` / `sizes` or any custom `preload` in `layout.tsx`.
