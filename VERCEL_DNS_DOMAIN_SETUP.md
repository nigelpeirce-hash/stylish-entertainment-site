# Vercel: Custom Domain as Sole Domain (DNS Transfer Readiness)

Use this checklist so **stylishentertainment.co.uk** (and **www**) point to Vercel and act as your main URLs instead of the default `*.vercel.app` domain.

---

## 1. Vercel-side setup (do this first)

### Add your domains

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → your project (e.g. **stylish-entertainment-site**).
2. Go to **Settings** → **Domains**.
3. Click **Add** and add:
   - `stylishentertainment.co.uk` (apex)
   - `www.stylishentertainment.co.uk` (www)
4. If Vercel suggests adding `www` when you add the apex, accept it.

### Note the DNS records Vercel shows

After adding each domain, Vercel shows the exact records to use. Write them down:

- **Apex (`stylishentertainment.co.uk`):** usually an **A** record:
  - **Type:** A  
  - **Name/Host:** `@` (or root)  
  - **Value:** `76.76.21.21` (confirm in Vercel; it can vary)

- **www (`www.stylishentertainment.co.uk`):** usually a **CNAME** record:
  - **Type:** CNAME  
  - **Name/Host:** `www`  
  - **Value:** something like `cname.vercel-dns.com` or a **project-specific** target, e.g. `xxx.your-project.vercel-dns.com`  

Use the **exact** values from your project’s Domains page.

### Set primary domain and redirects

1. In **Settings** → **Domains**, you want one **primary** domain (the “sole” one).
2. Your site uses **www** in metadata/canonicals, so make **`www.stylishentertainment.co.uk`** primary.
3. Add an explicit redirect:
   - **From:** `stylishentertainment.co.uk` (apex)  
   - **To:** `www.stylishentertainment.co.uk`  
   Use **More options** (⋮) → **Edit** on the apex domain → **Redirect to** → `www.stylishentertainment.co.uk`.

### Verify in Vercel before changing DNS

- Domains will show as **“Invalid Configuration”** or **“Pending”** until DNS is updated. That’s expected.
- Ensure both apex and www are added, redirect is set, and you’ve saved. You’re then “ready” for the DNS transfer.

---

## 2. DNS best practice before you switch

If the domain is **already live** elsewhere:

1. **~24 hours before** changing records: at your current DNS provider, **lower TTL** on the existing A/CNAME for the domain to **60** (or 300) seconds.
2. After that propagates, when you eventually switch to Vercel’s records, traffic will move over quickly.

Check propagation with [whatsmydns.net](https://www.whatsmydns.net).

---

## 3. DNS at your registrar

Where you manage DNS (e.g. 123 Reg, GoDaddy, Namecheap, Cloudflare):

### Apex: `stylishentertainment.co.uk`

| Type | Name/Host | Value        | TTL   |
|------|-----------|--------------|-------|
| A    | `@`       | `76.76.21.21`| 3600  |

(Use the A record target Vercel shows if it’s different.)

### www: `www.stylishentertainment.co.uk`

| Type  | Name/Host | Value                          | TTL   |
|-------|-----------|--------------------------------|-------|
| CNAME | `www`     | `cname.vercel-dns.com` or **project-specific** | 3600  |

**Important:** Use the **exact** CNAME target from your project’s **Domains** page (it can be project-specific).

### Don’t remove email-related records

Keep existing **MX**, **TXT** (SPF, DKIM, DMARC, etc.) for email. Only add/update the **A** and **CNAME** above. See `DNS_EMAIL_SETUP.md` if you need to add or adjust email records.

---

## 4. After you update DNS

1. Wait **5–60 minutes** (often quicker; can be up to 24–48h).
2. In Vercel **Settings** → **Domains**, check that both domains show **Valid** / **Ready**.
3. Visit:
   - `https://www.stylishentertainment.co.uk`
   - `https://stylishentertainment.co.uk` (should redirect to www)
4. Confirm SSL works (HTTPS, no browser warnings). Vercel provisions certificates automatically once DNS is correct.

---

## 5. Env and app config

Ensure production uses your custom domain:

- **`NEXT_PUBLIC_SITE_URL`** and **`NEXTAUTH_URL`** (if used):  
  `https://www.stylishentertainment.co.uk`
- **`metadataBase`** in `app/layout.tsx`:  
  `https://www.stylishentertainment.co.uk`  
  (already set in this project.)
- Any **CORS**, **OAuth redirect URIs**, or **CookieYes** etc.: use `https://www.stylishentertainment.co.uk` (and `https://stylishentertainment.co.uk` if you allow apex in redirects).

---

## 6. “Sole” domain = use only the custom domain

- The **`*.vercel.app`** deployment URL remains available; Vercel doesn’t let you turn it off.
- To treat the custom domain as your **only** public domain:
  - Use **www.stylishentertainment.co.uk** (and **stylishentertainment.co.uk** via redirect) everywhere: links, SEO, ads, emails, social.
  - Don’t link to or advertise the `*.vercel.app` URL.
- Search engines and users will then see only your custom domain.

---

## Quick checklist

- [ ] Domains **stylishentertainment.co.uk** and **www.stylishentertainment.co.uk** added in Vercel.
- [ ] Redirect: apex → www configured in Vercel.
- [ ] A record for apex and CNAME for www added at DNS provider (values from Vercel).
- [ ] Email records (MX, SPF, DKIM, etc.) unchanged.
- [ ] Both domains show **Valid** in Vercel.
- [ ] `https://www.stylishentertainment.co.uk` and `https://stylishentertainment.co.uk` work; apex redirects to www.
- [ ] Env vars and app config use `https://www.stylishentertainment.co.uk`.

---

## Links

- [Vercel: Add a domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- [Vercel: Working with DNS](https://vercel.com/docs/projects/domains/working-with-dns)
- [Vercel: Deploying & redirecting](https://vercel.com/docs/domains/deploying-and-redirecting)
