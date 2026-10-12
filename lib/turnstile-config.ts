// Cloudflare Turnstile site key (public; safe for client code).
// Cloudflare's official always-passes test key is used only in local development
// when no key is set. Production and preview builds never fall back to it.
const TEST_SITE_KEY = "1x00000000000000000000AA";

export const turnstileSiteKey: string =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || (process.env.NODE_ENV === "development" ? TEST_SITE_KEY : "");

/** Body field the contact module uses to send the Turnstile token. */
export const TURNSTILE_FIELD = "turnstileToken";
