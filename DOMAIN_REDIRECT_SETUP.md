# Domain-Level Redirect Setup Guide

## Overview

Setting up a domain-level 301 redirect from `stylishweddingdisco.co.uk` → `stylishentertainment.co.uk` will:
- Catch ALL URLs automatically (even ones not in the redirect list)
- Preserve SEO value by telling Google the entire site has moved
- Redirect visitors to the new domain at the DNS/hosting level
- Work in combination with the Next.js redirects we've configured

## Setup Instructions by Provider

### Option 1: DNS/Hosting Provider (Most Common)

#### If using cPanel/WHM:
1. Log into your hosting control panel
2. Go to "Redirects" or "Domain Redirects"
3. Select `stylishweddingdisco.co.uk`
4. Set redirect type to: **301 (Permanent)**
5. Redirect to: `https://stylishentertainment.co.uk`
6. Keep path: **Yes** (so `/wedding-djs/` redirects to `stylishentertainment.co.uk/wedding-djs/` and then our Next.js redirects take over)
7. Save

#### If using Cloudflare:
1. Log into Cloudflare dashboard
2. Select the domain `stylishweddingdisco.co.uk`
3. Go to "Rules" → "Redirect Rules" (or "Page Rules" in older accounts)
4. Create a new redirect rule:
   - URL Pattern: `*stylishweddingdisco.co.uk/*`
   - Status Code: **301 (Permanent Redirect)**
   - Destination URL: `https://stylishentertainment.co.uk/$1`
5. Save

#### If using Namecheap:
1. Log into Namecheap
2. Go to "Domain List"
3. Click "Manage" next to `stylishweddingdisco.co.uk`
4. Go to "Advanced DNS" tab
5. Add an A record OR use "URL Redirect Record":
   - Type: URL Redirect Record
   - Host: @
   - Value: `https://stylishentertainment.co.uk`
   - Redirect Type: **301 (Permanent)**
6. Save

#### If using GoDaddy:
1. Log into GoDaddy Domain Manager: https://dcc.godaddy.com/
2. Select `stylishweddingdisco.co.uk`
3. Click "DNS" or "Manage DNS"
4. Look for "Forwarding" section
5. Add domain forwarding:
   - Forward to: `https://stylishentertainment.co.uk`
   - Forward type: **301 (Permanent)**
   - Forward settings: Keep path (Yes)
6. Save

#### If using 123 Reg (UK):
1. Log into your 123 Reg account: https://www.123-reg.co.uk/
2. Go to "My Domains" section
3. Find `stylishweddingdisco.co.uk` and click "Manage"
4. Look for "DNS" or "DNS Management" section
5. Go to "Domain Forwarding" or "URL Redirect" settings
6. Add a redirect:
   - Redirect type: **301 (Permanent Redirect)**
   - Redirect to: `https://stylishentertainment.co.uk`
   - **Important**: Enable "Keep path" or "Preserve path" option
   - This ensures `/wedding-djs/` becomes `stylishentertainment.co.uk/wedding-djs/`
7. Save changes
8. **Note**: 123 Reg changes can take up to 24 hours to propagate

#### If using Google Domains/Cloud Identity:
1. Log into Google Domains
2. Select `stylishweddingdisco.co.uk`
3. Go to "DNS" section
4. Scroll to "Synthetic records"
5. Add a synthetic record:
   - Type: Subdomain forward
   - Subdomain: @ (or leave blank for root)
   - Forward to: `https://stylishentertainment.co.uk`
   - Forward type: **Permanent (301)**
6. Save

### Option 2: Server-Level (Apache/Nginx)

If you have server access, you can configure redirects at the web server level:

#### Apache (.htaccess):
```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^stylishweddingdisco\.co\.uk [NC]
RewriteRule ^(.*)$ https://stylishentertainment.co.uk/$1 [R=301,L]
```

#### Nginx:
```nginx
server {
    server_name stylishweddingdisco.co.uk;
    return 301 https://stylishentertainment.co.uk$request_uri;
}
```

## Testing the Redirect

After setting up the redirect:

1. **Test in browser** (private/incognito mode):
   - Visit: `https://stylishweddingdisco.co.uk/wedding-djs/`
   - Should redirect to: `https://stylishentertainment.co.uk/wedding-djs/`
   - Then Next.js redirect should send to: `https://stylishentertainment.co.uk/artists/djs/`

2. **Test with curl** (terminal):
   ```bash
   curl -I https://stylishweddingdisco.co.uk/wedding-djs/
   ```
   Should show: `HTTP/1.1 301 Moved Permanently`
   And: `Location: https://stylishentertainment.co.uk/wedding-djs/`

3. **Check redirect chain**:
   - Use online tools like: https://httpstatus.io/redirect-check
   - Enter: `https://stylishweddingdisco.co.uk/wedding-djs/`
   - Should show the full redirect chain

## Important Notes

1. **Keep Path**: When setting up the domain redirect, make sure to keep the path. This means:
   - Old URL: `stylishweddingdisco.co.uk/wedding-djs/`
   - Redirects to: `stylishentertainment.co.uk/wedding-djs/`
   - Then our Next.js redirect takes over: → `stylishentertainment.co.uk/artists/djs/`

2. **SSL/HTTPS**: Make sure the redirect goes to `https://stylishentertainment.co.uk` (with https)

3. **Propagation Time**: DNS changes can take 24-48 hours to propagate globally, though often works within minutes

4. **Both Redirects Work Together**:
   - Domain-level redirect: Catches everything at the domain level
   - Next.js redirects: Handle specific URL mapping on the new site
   - Both work together seamlessly

## Who is your hosting/DNS provider?

If you tell me your provider, I can give you more specific step-by-step instructions!
