# Email Domain Authentication Setup Guide

## DNS Records for Office@stylishentertainment.co.uk

To ensure 100% deliverability to Hotmail/Outlook and all email providers, you must add these DNS records to your domain provider (GoDaddy, Namecheap, etc.).

---

## 1. SPF (Sender Policy Framework) Record

**Purpose:** Authorises which servers can send emails on behalf of your domain.

### Type: TXT
### Name/Host: `@` (or leave blank/root domain)
### Value:
```
v=spf1 include:_spf.resend.com include:spf.mailgun.org ~all
```

**If using Resend only:**
```
v=spf1 include:_spf.resend.com ~all
```

**If using Mailgun only:**
```
v=spf1 include:spf.mailgun.org ~all
```

**Note:** If you already have an SPF record, **DO NOT CREATE A NEW ONE**. Instead, modify the existing record to include both:
```
v=spf1 include:_spf.resend.com include:spf.mailgun.org include:existing-provider.com ~all
```

---

## 2. DKIM (DomainKeys Identified Mail) Records

**Purpose:** Cryptographically signs emails to prove authenticity.

### Resend DKIM (if using Resend)

**Step 1:** Get your DKIM keys from Resend Dashboard:
1. Log in to [Resend Dashboard](https://resend.com/domains)
2. Go to **Domains** → Select `stylishentertainment.co.uk`
3. Copy the DKIM keys (usually 3 records: `resend._domainkey`, etc.)

**Step 2:** Add these DNS records:

#### Record 1
- **Type:** TXT
- **Name/Host:** `resend._domainkey` (or `resend._domainkey.stylishentertainment.co.uk`)
- **Value:** (Copy from Resend dashboard - typically starts with `v=DKIM1; k=rsa; p=...`)

#### Record 2
- **Type:** TXT
- **Name/Host:** `resend1._domainkey` (or `resend1._domainkey.stylishentertainment.co.uk`)
- **Value:** (Copy from Resend dashboard)

#### Record 3
- **Type:** TXT
- **Name/Host:** `resend2._domainkey` (or `resend2._domainkey.stylishentertainment.co.uk`)
- **Value:** (Copy from Resend dashboard)

### Mailgun DKIM (if using Mailgun)

**Step 1:** Get DKIM keys from Mailgun Dashboard:
1. Log in to [Mailgun Dashboard](https://app.mailgun.com/app/sending/domains)
2. Select your domain `stylishentertainment.co.uk`
3. Go to **Domain Settings** → **Sending** → **DKIM keys**

**Step 2:** Add DNS records:

#### Record 1
- **Type:** TXT
- **Name/Host:** `mailo._domainkey` (or `mailo._domainkey.stylishentertainment.co.uk`)
- **Value:** (Copy from Mailgun dashboard)

#### Record 2
- **Type:** TXT
- **Name/Host:** `mailo2._domainkey` (or `mailo2._domainkey.stylishentertainment.co.uk`)
- **Value:** (Copy from Mailgun dashboard)

---

## 3. DMARC (Domain-based Message Authentication, Reporting & Conformance) Record

**Purpose:** Tells receiving servers what to do with emails that fail SPF/DKIM checks and provides reporting.

### Type: TXT
### Name/Host: `_dmarc` (or `_dmarc.stylishentertainment.co.uk`)
### Value:
```
v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@stylishentertainment.co.uk; ruf=mailto:dmarc-reports@stylishentertainment.co.uk; pct=100; aspf=r; adkim=r; fo=1
```

**Explanation:**
- `v=DMARC1` - DMARC version
- `p=quarantine` - Policy: quarantine emails that fail (less strict than `p=reject`, but still protects)
- `rua=mailto:dmarc-reports@...` - Aggregate reports email address
- `ruf=mailto:dmarc-reports@...` - Forensic reports email address
- `pct=100` - Apply policy to 100% of emails
- `aspf=r` - SPF alignment: relaxed
- `adkim=r` - DKIM alignment: relaxed
- `fo=1` - Forensic reporting: send if both SPF and DKIM fail

**Note:** Start with `p=quarantine` and monitor reports. Once confident, you can change to `p=reject` for maximum protection.

---

## Step-by-Step Setup Instructions

### For GoDaddy:

1. Log in to your GoDaddy account
2. Go to **My Products** → **DNS** (or **Manage DNS**)
3. Find your domain `stylishentertainment.co.uk`
4. Click **Add** or **Edit** records:

   **Add SPF:**
   - Type: `TXT`
   - Name: `@`
   - Value: `v=spf1 include:_spf.resend.com include:spf.mailgun.org ~all`
   - TTL: `600` (or 1 hour)

   **Add DKIM (from Resend/Mailgun dashboard):**
   - Type: `TXT`
   - Name: `resend._domainkey` (copy exact name from provider)
   - Value: (copy from provider dashboard)
   - TTL: `600`

   **Add DMARC:**
   - Type: `TXT`
   - Name: `_dmarc`
   - Value: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@stylishentertainment.co.uk; ruf=mailto:dmarc-reports@stylishentertainment.co.uk; pct=100; aspf=r; adkim=r; fo=1`
   - TTL: `600`

5. **Save** all records
6. Wait 24-48 hours for DNS propagation

### For Namecheap:

1. Log in to Namecheap
2. Go to **Domain List** → Click **Manage** next to your domain
3. Go to **Advanced DNS** tab
4. Click **Add New Record**:

   **Add SPF:**
   - Type: `TXT Record`
   - Host: `@`
   - Value: `v=spf1 include:_spf.resend.com include:spf.mailgun.org ~all`
   - TTL: `Automatic`

   **Add DKIM:**
   - Type: `TXT Record`
   - Host: `resend._domainkey` (or provider-specific)
   - Value: (from provider dashboard)
   - TTL: `Automatic`

   **Add DMARC:**
   - Type: `TXT Record`
   - Host: `_dmarc`
   - Value: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@stylishentertainment.co.uk; ruf=mailto:dmarc-reports@stylishentertainment.co.uk; pct=100; aspf=r; adkim=r; fo=1`
   - TTL: `Automatic`

5. **Save** all records

---

## Verification

### Check DNS Records Online:

Use these tools to verify your records are live:

1. **MXToolbox SPF Check:**
   - https://mxtoolbox.com/spf.aspx
   - Enter: `stylishentertainment.co.uk`

2. **MXToolbox DKIM Check:**
   - https://mxtoolbox.com/dkim.aspx
   - Enter: `stylishentertainment.co.uk`

3. **MXToolbox DMARC Check:**
   - https://mxtoolbox.com/dmarc.aspx
   - Enter: `stylishentertainment.co.uk`

4. **Resend Domain Verification:**
   - Check in Resend Dashboard → Domains
   - Status should show "Verified" when all records are correct

---

## Testing Email Deliverability

After DNS propagation (24-48 hours):

1. **Send a test email** to a Hotmail/Outlook account
2. **Check email headers:**
   - Open the email in Outlook
   - Click **View** → **View Source** (or **Message Options**)
   - Look for:
     - `SPF: PASS`
     - `DKIM: PASS`
     - `DMARC: PASS`

3. **Use Email Testing Tools:**
   - **Mail-Tester.com:** Send email to provided address and check score (should be 10/10)
   - **MXToolbox Blacklist Check:** Ensure domain is not blacklisted

---

## Troubleshooting

### SPF Record Errors:

- **"Too many DNS lookups":** Limit `include:` statements (max 10)
- **"Multiple SPF records":** Delete duplicate SPF records (only one allowed)

### DKIM Errors:

- **"DKIM signature not found":** Check domain is verified in Resend/Mailgun
- **"Invalid DKIM signature":** Verify DNS record is exactly as provided by provider

### DMARC Errors:

- **"DMARC policy not found":** Ensure `_dmarc` record exists and is correctly formatted
- **"Reports not being sent":** Check `rua` email address is valid and receiving emails

---

## Important Notes

1. **DNS Propagation:** Changes can take 24-48 hours to propagate globally
2. **One SPF Record:** Only one SPF record per domain allowed
3. **Exact Match:** DKIM records must match provider dashboard exactly (no extra spaces)
4. **Email Address:** Ensure `dmarc-reports@stylishentertainment.co.uk` email exists to receive reports

---

## Summary of Records Needed

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| TXT | `@` | `v=spf1 include:_spf.resend.com include:spf.mailgun.org ~all` | SPF |
| TXT | `resend._domainkey` | (From Resend Dashboard) | DKIM |
| TXT | `resend1._domainkey` | (From Resend Dashboard) | DKIM |
| TXT | `resend2._domainkey` | (From Resend Dashboard) | DKIM |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@...` | DMARC |

**Note:** DKIM record names depend on your email provider. Check your Resend/Mailgun dashboard for exact names.
