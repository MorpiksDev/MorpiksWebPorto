import { Resend } from "resend";

/**
 * PRD 10.2: enquiries go through Resend to info@morpiks.com.
 * Sender no-reply@morpiks.com once the domain is verified. Until then set
 * CONTACT_FROM to Resend's sandbox sender ("onboarding@resend.dev").
 */

const SUBJECT_LABELS: Record<string, string> = {
  consultation: "Free consultation",
  project: "New project",
  procurement: "Procurement",
  general: "General enquiry",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 120, email: 200, message: 5000 };

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(body.name);
  const email = str(body.email);
  const message = str(body.message);
  const subjectKey = str(body.subject);
  const lang = str(body.lang) === "id" ? "id" : "en";

  // Honeypot filled: pretend success so bots get no signal.
  if (str(body.company)) return Response.json({ ok: true });

  const errors: string[] = [];
  if (!name || name.length > LIMITS.name) errors.push("name");
  if (!email || email.length > LIMITS.email || !EMAIL_RE.test(email)) errors.push("email");
  if (!message || message.length > LIMITS.message) errors.push("message");
  if (errors.length) return Response.json({ error: "Invalid fields", fields: errors }, { status: 422 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return Response.json({ error: "Email service not configured" }, { status: 503 });
  }

  const subjectLabel = SUBJECT_LABELS[subjectKey] ?? SUBJECT_LABELS.general;
  const from = process.env.CONTACT_FROM || "Morpiks Website <no-reply@morpiks.com>";
  const to = process.env.CONTACT_TO || "info@morpiks.com";

  const text = [
    `Subject: ${subjectLabel}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Language: ${lang.toUpperCase()}`,
    "",
    message,
  ].join("\n");

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Inter,sans-serif;color:#111111;line-height:1.6">
      <p style="margin:0 0 4px;color:#333333;font-size:13px">New enquiry from morpiks.com</p>
      <h2 style="margin:0 0 16px;font-size:20px">${escapeHtml(subjectLabel)}</h2>
      <p style="margin:0"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin:0 0 16px"><strong>Language:</strong> ${lang.toUpperCase()}</p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[Morpiks] ${subjectLabel}: ${name}`,
      text,
      html,
    });
    if (error) {
      console.error("[contact] Resend error", error);
      return Response.json({ error: "Failed to send" }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error", err);
    return Response.json({ error: "Failed to send" }, { status: 500 });
  }
}
