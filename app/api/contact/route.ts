import { NextResponse } from "next/server";
import { HONEYPOT_FIELD } from "@/lib/inquiry";
import { formatInquiryEmail, parseInquiry } from "@/lib/inquiry-schema";
import { clientIp, verifyTurnstile } from "@/lib/turnstile";
import { sendConfirmationEmail, sendInquiryEmail } from "@/lib/email";
import { formatConfirmationEmail } from "@/lib/confirmation-email";
import { TURNSTILE_FIELD } from "@/lib/turnstile-config";

const MAX_BODY_BYTES = 20_000;
// Submissions faster than this are almost certainly bots
const MIN_FILL_TIME_MS = 3_000;

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Request too large." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid body");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Spam checks: pretend success so bots don't learn anything.
  const honeypot = typeof body[HONEYPOT_FIELD] === "string" && (body[HONEYPOT_FIELD] as string).trim() !== "";
  const startedAt = Number(body.startedAt);
  const tooFast = Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_TIME_MS;
  if (honeypot || tooFast) {
    console.warn("[contact] Discarded likely spam submission", { honeypot, tooFast });
    return NextResponse.json({ ok: true });
  }

  // Bot check: verify the Cloudflare Turnstile token before anything else is processed or sent
  const turnstile = await verifyTurnstile(body[TURNSTILE_FIELD], clientIp(request));
  if (!turnstile.ok) {
    console.warn("[contact] Turnstile verification failed", { reason: turnstile.reason, codes: turnstile.codes });
    if (turnstile.reason === "not-configured") {
      return NextResponse.json({ ok: false, error: "verification-unavailable" }, { status: 503 });
    }
    return NextResponse.json({ ok: false, error: "verification-failed" }, { status: 400 });
  }

  const result = parseInquiry(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 });
  }

  const inquiry = result.data;
  const { subject, text, html } = formatInquiryEmail(inquiry);

  const sent = await sendInquiryEmail({
    subject,
    text,
    html,
    // Replies go straight to the visitor when they asked to be contacted by email
    replyTo: inquiry.contactMethod === "email" ? inquiry.email : undefined,
  });

  if (!sent.ok) {
    // Log what went wrong (variable names / Resend's error), never key values or the visitor's details
    if (sent.reason === "not-configured") {
      console.error("[contact] Email not sent: missing environment variables", sent.missing);
      return NextResponse.json({ ok: false, error: "email-unavailable" }, { status: 503 });
    }
    console.error("[contact] Email not sent: Resend error", sent.detail);
    return NextResponse.json({ ok: false, error: "send-failed" }, { status: 502 });
  }

  console.info("[contact] Inquiry emailed", { id: sent.id, path: inquiry.path });

  // The inquiry is through. Confirm to the visitor only if they chose email; a failure here
  // is logged but never shown to them.
  let confirmationSent = false;
  if (inquiry.contactMethod === "email") {
    const confirmation = await sendConfirmationEmail(inquiry.email, formatConfirmationEmail(inquiry));
    confirmationSent = confirmation.ok;
    if (!confirmation.ok) {
      const detail = confirmation.reason === "send-failed" ? confirmation.detail : `missing ${confirmation.missing.join(", ")}`;
      console.error("[contact] Confirmation not sent", detail);
    }
  }

  return NextResponse.json({ ok: true, confirmationSent });
}
