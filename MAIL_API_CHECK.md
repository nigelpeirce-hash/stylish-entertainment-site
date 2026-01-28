# How to Check If the Mail API Is Set Up Correctly

The app uses **Resend** for transactional email (contact form, autoresponders, booking emails, etc.). Use these checks to verify configuration.

---

## Confirm config at runtime (most important)

Hit this in your browser or curl:

- **Local:** `http://localhost:3001/api/check-email-status`
- **Production:** `https://your-domain.com/api/check-email-status`

You want to see **all green**:

```json
{
  "resendReady": true,
  "details": {
    "resendConfigured": true,
    "resendDefaultFromSet": true,
    "recipientEmail": "info@stylishentertainment.co.uk",
    "fromEmail": "STYLISH Entertainment <info@stylishentertainment.co.uk>"
  }
}
```

If **`resendReady` is still `false`** → the server has not restarted after changing env vars, or the variable is missing in that environment (e.g. Vercel project env not set).

---

## 1. Required environment variables

Ensure these are set (locally in `.env.local`, or in Vercel **Settings → Environment Variables**):

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Resend API key (starts with `re_`, typically 35+ chars). Get from [Resend → API Keys](https://resend.com/api-keys). |
| `RESEND_DEFAULT_FROM` | Default "From" address for `sendEmail` (e.g. `STYLISH Entertainment <info@stylishentertainment.co.uk>`). |
| `CONTACT_FORM_EMAIL` | Where contact form submissions are sent (defaults to `info@stylishentertainment.co.uk` if unset). |

**Optional:** `SMTP_FROM_EMAIL` is used as a fallback "From" in some test endpoints only; Resend + `getResendConfig` use `info@stylishentertainment.co.uk` for contact form.

---

## 2. Config-only checks (no email sent)

### `GET /api/check-email-status`

Quick overview of what’s configured:

```bash
curl http://localhost:3001/api/check-email-status
```

Returns `resendConfigured`, `RESEND_DEFAULT_FROM` set, `CONTACT_FORM_EMAIL`, and hints.

### `GET /api/test-resend`

Resend-specific config check (API key format, length, placeholder detection):

```bash
curl http://localhost:3001/api/test-resend
```

Use this to confirm `RESEND_API_KEY` is present and looks valid before sending.

---

## 3. Send a test email

### `POST /api/test-resend`

Sends a real test email via Resend to `CONTACT_FORM_EMAIL` (or `body.email` if provided):

```bash
curl -X POST http://localhost:3001/api/test-resend
# Optional: send to a specific address
curl -X POST http://localhost:3001/api/test-resend \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com"}'
```

- Success → you get `success: true` and an `emailId`. Check inbox (and spam).
- Failure → error message and `details` from Resend.

Also check [Resend → Emails](https://resend.com/emails) for delivery status.

### `GET /api/test-email`

Uses `sendEmail` (same as portal invites, etc.) and sends to `CONTACT_FORM_EMAIL`. Good to verify `RESEND_DEFAULT_FROM` and `sendEmail` path:

```bash
curl http://localhost:3001/api/test-email
```

---

## 4. Contact form email audit

### `GET /api/contact/audit?limit=10`

Shows recent contact form submissions and whether business + confirmation emails were sent:

```bash
curl "http://localhost:3001/api/contact/audit?limit=10"
```

Response includes:

- `environment`: `RESEND_API_KEY` set, `CONTACT_FORM_EMAIL`, `NODE_ENV`
- `recentSubmissions`: per-submission `emailStatus` (e.g. `businessEmailSent`, `confirmationEmailSent`, errors)
- `summary`: counts of sent/failed business and confirmation emails

Use this to verify that contact form emails are actually sending in production.

---

## 5. Manual check: contact form

1. Submit the contact form on `/contact-us` (or your contact page).
2. Check **Resend Dashboard → Logs** for the outbound message.
3. Check `CONTACT_FORM_EMAIL` inbox for the business notification.
4. Check the submitter’s inbox for the autoresponder.
5. Optionally call `/api/contact/audit` and confirm the latest submission shows `businessEmailSent` and `confirmationEmailSent`.

---

## 6. Production (Vercel)

- Use **Vercel → Project → Settings → Environment Variables** and ensure `RESEND_API_KEY`, `RESEND_DEFAULT_FROM`, and optionally `CONTACT_FORM_EMAIL` are set for the right environments.
- Call the same endpoints on your deployed URL, e.g.  
  `https://your-domain.com/api/check-email-status`  
  `https://your-domain.com/api/test-resend` (GET first, then POST if you want to send a test).

---

## Quick checklist

- [ ] `RESEND_API_KEY` set and valid (not placeholder, `re_` prefix, 35+ chars).
- [ ] `RESEND_DEFAULT_FROM` set (for `sendEmail` / portal emails).
- [ ] `CONTACT_FORM_EMAIL` set or OK with default `info@stylishentertainment.co.uk`.
- [ ] `GET /api/check-email-status` shows Resend configured.
- [ ] `GET /api/test-resend` reports configured and valid key.
- [ ] `POST /api/test-resend` sends a test email and you receive it.
- [ ] Contact form submission → business + autoresponder emails received.
- [ ] `GET /api/contact/audit` shows recent submissions with emails sent.

If any step fails, check [RESEND_SETUP.md](./RESEND_SETUP.md) and [EMAIL_TROUBLESHOOTING.md](./EMAIL_TROUBLESHOOTING.md).
