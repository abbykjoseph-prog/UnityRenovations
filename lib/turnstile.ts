import "server-only";

// Server-side Cloudflare Turnstile verification. Never import this from client code:
// it reads the secret key.

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
// Cloudflare's official always-passes test secret, for local development only
const TEST_SECRET_KEY = "1x0000000000000000000000000000000AA";

function secretKey(): string | null {
  if (process.env.TURNSTILE_SECRET_KEY) return process.env.TURNSTILE_SECRET_KEY;
  return process.env.NODE_ENV === "development" ? TEST_SECRET_KEY : null;
}

/** First address in x-forwarded-for (the original client), if present. */
export function clientIp(request: Request): string | undefined {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
}

export type TurnstileResult = { ok: true } | { ok: false; reason: "missing-token" | "not-configured" | "failed" | "unreachable"; codes?: string[] };

export async function verifyTurnstile(token: unknown, ip?: string): Promise<TurnstileResult> {
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) return { ok: false, reason: "missing-token" };

  const secret = secretKey();
  if (!secret) return { ok: false, reason: "not-configured" };

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(SITEVERIFY_URL, { method: "POST", body, signal: AbortSignal.timeout(8000) });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    return data.success ? { ok: true } : { ok: false, reason: "failed", codes: data["error-codes"] ?? [] };
  } catch {
    return { ok: false, reason: "unreachable" };
  }
}
