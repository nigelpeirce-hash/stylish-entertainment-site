# Admin 401 Unauthorized on Live – Checklist

If admin dashboard shows **401 Unauthorized**, no data, and API calls fail (threads, bookings, etc.) on the live site, work through this checklist.

---

## 1. Vercel environment variables (most common fix)

In **Vercel → Project → Settings → Environment Variables** (Production):

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXTAUTH_URL` | ✅ | **Must** match live URL exactly: `https://www.stylishentertainment.co.uk` (or your apex domain). No trailing slash. |
| `NEXTAUTH_SECRET` | ✅ | Same value as when users log in. If you change it, everyone must log in again. |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Same as `NEXTAUTH_URL`. |

**Frequent cause of 401:** `NEXTAUTH_URL` is still `http://localhost:3001` or a Vercel preview URL. Update it to your **production** domain, **redeploy**, then **log out and log in again**.

---

## 2. Cookie domain / SameSite

- NextAuth sets a **session cookie** for your domain. If you use `www.` in prod, stick to it; if you use apex, stick to that. Mixing (e.g. login on `www.` but API on apex) can prevent the cookie being sent.
- Ensure the site is **HTTPS** in production. `secure` cookies only work over HTTPS.

---

## 3. Log out and log in again

After changing `NEXTAUTH_URL` or `NEXTAUTH_SECRET`:

1. Log out from the live site (or clear cookies for the domain).
2. Log in again so a new session cookie is issued for the correct domain and secret.

---

## 4. Confirm you’re actually logged in

- Open **DevTools → Application (Chrome) → Cookies** and check the domain.
- You should see a NextAuth-related cookie (e.g. `next-auth.session-token` or `__Secure-next-auth.session-token`).
- If it’s missing on the live domain, the session isn’t being set – usually due to `NEXTAUTH_URL` or cookie domain.

---

## 5. Code-side changes (already in place)

- **requireAdmin:** Uses `auth()` (same as `/api/auth/session`) instead of `getToken`; `getToken` can fail after 308 redirects.
- **Trailing slashes:** Admin API fetch URLs use trailing slashes (e.g. `/api/admin/bookings/`) to avoid 308 redirects.
- **Admin fetchers:** Dashboard, bookings, threads, conflicts use `credentials: "include"`.
- **90-Day fetcher:** Uses `credentials: "include"` and attaches `status` to errors so we don’t retry on 401/403.
- **90-Day UI:** On 401, shows “Session expired or not authorized” and a “Log in again” link instead of generic error + retry.
- **CookieYes:** Not loaded on `/admin` to avoid the CookieYes 403 on admin pages.

---

## Quick fix to try first

1. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to `https://www.stylishentertainment.co.uk` (or your exact live URL) in Vercel **Production**.
2. Redeploy.
3. Clear cookies for the live site (or use an incognito window), then log in again.
4. Reopen **Admin** or **90-Day Command Centre** and confirm 401s are gone.
