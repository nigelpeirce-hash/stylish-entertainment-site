import nodemailer from "nodemailer";

// Mailgun API configuration (preferred method)
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || "stylishentertainment.co.uk";
const MAILGUN_API_URL = process.env.MAILGUN_API_URL || "https://api.eu.mailgun.net/v3";

// Email transporter configuration (fallback to SMTP)
// Defaults to Mailgun SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.eu.mailgun.org",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify transporter configuration on module load
console.log("=== EMAIL MODULE LOADING ===");
console.log("Mailgun API Key:", MAILGUN_API_KEY ? "***SET***" : "not set");
console.log("Mailgun Domain:", MAILGUN_DOMAIN);
console.log("SMTP_HOST:", process.env.SMTP_HOST || "not set");
console.log("SMTP_USER:", process.env.SMTP_USER || "not set");
console.log("SMTP_PASSWORD:", process.env.SMTP_PASSWORD ? "***SET***" : "not set");

if (MAILGUN_API_KEY) {
  console.log("✅ Using Mailgun REST API for email sending");
} else if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
  console.log("⚠️ Using SMTP (Mailgun API key not set)");
  transporter.verify((error) => {
    if (error) {
      console.error("❌ Email transporter verification failed:", error);
    } else {
      console.log("✅ Email transporter is ready and verified!");
    }
  });
} else {
  console.warn("⚠️ Email not configured - neither API key nor SMTP credentials found");
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

// Send email using Mailgun REST API (preferred method)
async function sendEmailViaMailgunAPI({ to, subject, html, text, from }: EmailOptions) {
  const fromEmail = from || process.env.SMTP_FROM_EMAIL || `info@${MAILGUN_DOMAIN}`;
  
  const formData = new URLSearchParams();
  formData.append("from", `"Stylish Entertainment" <${fromEmail}>`);
  formData.append("to", to);
  formData.append("subject", subject);
  formData.append("html", html);
  if (text) {
    formData.append("text", text);
  } else {
    formData.append("text", html.replace(/<[^>]*>/g, ""));
  }
  
  // Add tracking and delivery options for better deliverability
  formData.append("o:tracking", "yes");
  formData.append("o:tracking-clicks", "yes");
  formData.append("o:tracking-opens", "yes");

  const response = await fetch(`${MAILGUN_API_URL}/${MAILGUN_DOMAIN}/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mailgun API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return { success: true, messageId: result.id || result.message };
}

export async function sendEmail({ to, subject, html, text, from }: EmailOptions) {
  try {
    console.log("sendEmail called - To:", to, "Subject:", subject);
    
    // Prefer Mailgun API over SMTP
    if (MAILGUN_API_KEY) {
      console.log("Using Mailgun REST API");
      const result = await sendEmailViaMailgunAPI({ to, subject, html, text, from });
      console.log("✅ Email sent via Mailgun API:", result.messageId);
      return result;
    }
    
    // Fallback to SMTP
    console.log("Using SMTP (Mailgun API not available)");
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn("Email not configured - SMTP credentials missing");
      return { success: false, error: "Email not configured" };
    }

    // Use verified Mailgun domain email or fallback to SMTP_USER
    const fromEmail = from || process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "info@stylishentertainment.co.uk";
    
    const mailOptions = {
      from: `"Stylish Entertainment" <${fromEmail}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ""), // Fallback to plain text version
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent via SMTP:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export default sendEmail;
