import { Resend } from "resend";

// Lazy initialization to prevent build-time errors
// Validation happens at runtime when sendEmail is called
let resend: Resend | null = null;

// Check if we're in a build context (Next.js build process).
// Only treat as build when NEXT_PHASE is set – never mock at runtime when key is missing.
function isBuildTime(): boolean {
  return (
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-production-compile'
  );
}

function getResendClient(): Resend | null {
  // During build, return null to prevent errors
  if (isBuildTime()) {
    return null;
  }
  
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY missing! Emails will fail.");
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export default async function sendEmail({ 
  to, 
  subject, 
  html,
  text 
}: { 
  to: string; 
  subject: string; 
  html: string;
  text?: string;
}) {
  // During build, return mock response without throwing
  if (isBuildTime()) {
    return { data: { id: 'build-mock' }, error: null } as any;
  }
  
  // Validate at runtime, not at module load time
  if (!process.env.RESEND_DEFAULT_FROM) {
    throw new Error("RESEND_DEFAULT_FROM missing! Emails will fail.");
  }
  
  const client = getResendClient();
  if (!client) {
    throw new Error("Resend client not initialized");
  }
  
  return client.emails.send({
    from: process.env.RESEND_DEFAULT_FROM,
    to,
    subject,
    html,
    ...(text && { text }),
  });
}
