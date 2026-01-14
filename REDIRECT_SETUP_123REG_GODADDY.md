# Domain Redirect Setup: 123 Reg & GoDaddy

Since you're using **123 Reg** and **GoDaddy**, here are step-by-step instructions for both:

## Option 1: 123 Reg (Primary Instructions)

### Step-by-Step Guide:

1. **Log into 123 Reg**
   - Go to: https://www.123-reg.co.uk/
   - Click "Sign In" (top right)
   - Enter your account credentials

2. **Access Domain Management**
   - After logging in, click "My Account" or "Domain Names"
   - Find `stylishweddingdisco.co.uk` in your domain list
   - Click "Manage" or the domain name

3. **Find DNS/Domain Forwarding Settings**
   - Look for "DNS Management" or "Domain Settings"
   - Scroll to find "Domain Forwarding" or "URL Redirect" section
   - If you don't see it immediately, look under "Advanced Settings"

4. **Set Up the Redirect**
   - Enable "Domain Forwarding" or "URL Redirect"
   - Set redirect type: **301 (Permanent Redirect)**
   - Destination URL: `https://stylishentertainment.co.uk`
   - **CRITICAL**: Make sure "Keep path" or "Preserve path" is **ENABLED**
     - This means: `stylishweddingdisco.co.uk/wedding-djs/` → `stylishentertainment.co.uk/wedding-djs/`
     - Then our Next.js redirects handle: `stylishentertainment.co.uk/wedding-djs/` → `/artists/djs/`

5. **Save Changes**
   - Click "Save" or "Update"
   - Changes can take 24-48 hours to propagate (often works within hours)

### If you can't find Domain Forwarding in 123 Reg:

**Alternative Method - DNS Records:**
1. Go to DNS Management
2. Look for "A Records" or "CNAME Records"
3. Contact 123 Reg support and ask them to set up a 301 redirect
4. Or use the contact form: https://www.123-reg.co.uk/support/

---

## Option 2: GoDaddy (If managing DNS there)

### Step-by-Step Guide:

1. **Log into GoDaddy**
   - Go to: https://dcc.godaddy.com/
   - Sign in with your account

2. **Access Domain Settings**
   - Click "My Products" or "Domains"
   - Find `stylishweddingdisco.co.uk`
   - Click the three dots (⋯) or "DNS" button

3. **Set Up Domain Forwarding**
   - Scroll down to "Forwarding" section
   - Click "Add" or "Edit"
   - Set:
     - **Forward to**: `https://stylishentertainment.co.uk`
     - **Forward type**: **301 (Permanent)** ← IMPORTANT!
     - **Settings**: **Keep path** (Yes/Enabled)
   - Click "Save"

4. **Wait for Propagation**
   - Changes typically take effect within 1-4 hours
   - Can take up to 24-48 hours globally

---

## Important Settings Checklist

✅ **Redirect Type**: 301 (Permanent) - NOT 302 (Temporary)
✅ **Destination**: `https://stylishentertainment.co.uk` (with https)
✅ **Keep Path**: YES/Enabled - This is critical!
✅ **Forward all subdomains**: Usually optional, but can be enabled

---

## Testing the Redirect

After setting up (wait 1-4 hours for propagation):

1. **Test in Browser** (use private/incognito mode):
   - Visit: `https://stylishweddingdisco.co.uk/wedding-djs/`
   - Should redirect to: `https://stylishentertainment.co.uk/artists/djs/`
   - (First to `/wedding-djs/`, then Next.js redirects to `/artists/djs/`)

2. **Test with Terminal** (curl):
   ```bash
   curl -I https://stylishweddingdisco.co.uk/wedding-djs/
   ```
   Should show:
   ```
   HTTP/2 301
   Location: https://stylishentertainment.co.uk/wedding-djs/
   ```

3. **Online Redirect Checker**:
   - Use: https://httpstatus.io/redirect-check
   - Enter: `https://stylishweddingdisco.co.uk/wedding-djs/`
   - Should show full redirect chain

---

## Which Provider Should You Use?

**If the domain is registered at 123 Reg:**
- Set up the redirect at 123 Reg (primary method)
- GoDaddy might just be DNS management - check where the domain is actually registered

**If the domain is registered at GoDaddy:**
- Set up the redirect at GoDaddy
- 123 Reg might just be DNS management

**To find out:**
- Check where you renewed the domain last
- Check your emails for renewal notices
- Or check the WHOIS: https://whois.net/

---

## Need Help?

If you're stuck:
- **123 Reg Support**: https://www.123-reg.co.uk/support/contact/
- **GoDaddy Support**: https://www.godaddy.com/help (24/7 chat)

---

## Next Steps After Redirect is Set Up

1. ✅ Wait 24-48 hours for propagation
2. ✅ Test the redirect (see above)
3. ✅ Update Google Search Console (use "Change of Address" tool)
4. ✅ Monitor redirect status in Google Search Console
5. ✅ Submit new sitemap: `https://stylishentertainment.co.uk/sitemap.xml`
