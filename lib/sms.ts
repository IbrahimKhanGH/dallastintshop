/* ============================================================
   The text message the shop receives for each quote request.

   Pure functions, no I/O — used by app/api/notify/route.ts and covered by
   tests/quote-message.test.ts.

   Textbelt bills one credit per 160-character segment. This shop is
   SMS-only — there is no email carrying the full details — so every answer
   the customer gives has to fit in this text. MAX_SMS_CHARS is sized so a
   lead with every follow-up option ticked and a full notes box still
   arrives whole (a test proves it); typical leads are 1–2 segments.
   ============================================================ */

// The shop name Textbelt reports as the sender, and the prefix on the text
// itself. Matches BUSINESS.name in lib/business.ts.
export const SHOP_NAME = "Dallas Tint Shop";

export const MAX_SMS_CHARS = 1120; // 7 segments; only reached by extreme leads

// Per-field caps. Generous enough for everything the form can produce.
export const FIELD_CAPS = {
  name: 40,
  phone: 20,
  email: 60,
  pref: 20,
  vehicle: 60,
  style: 20,
  service: 160,
  details: 420,
  notes: 300,
} as const;

/* A single non-GSM-7 character (em dash, smart quote) flips the whole
   message to UCS-2 encoding, which drops the segment size from 160
   characters to 70 and doubles the credit cost. The form's own summary
   joins with " — ", so normalise to plain ASCII before sending. */
const ASCII_SWAPS: [RegExp, string][] = [
  [/[‐-―]/g, "-"], // hyphens, en/em dashes
  [/[‘’‛]/g, "'"],
  [/[“”‟]/g, '"'],
  [/…/g, "..."],
  [/[   ]/g, " "],
  [/•/g, "*"],
  [/°/g, " deg"],
];

/* Textbelt refuses to deliver any message containing a URL unless the key
   is whitelisted, and it reads an email address as one. That turns an
   ordinary lead — someone who picked "Email me", or typed a website in the
   notes — into a hard delivery failure, which is the one outcome this whole
   route exists to prevent. So defang anything link-shaped before sending:
   the shop can still read it, and the message goes through.

   Getting the key verified at textbelt.com/whitelist removes the
   restriction; this stays either way as the belt-and-braces. */
function neutralizeLinks(text: string): string {
  return text
    .replace(/https?:\/\//gi, "")
    .replace(/\bwww\./gi, "www ")
    .replace(/@/g, " at ")
    // only a dot glued to letters is domain-shaped; "3.5" and "Thanks. Ok"
    // are both left alone
    .replace(/\b([\w-]+)\.([a-z]{2,})\b/gi, "$1 dot $2");
}

export function clean(value: unknown, max?: number): string {
  if (typeof value !== "string") return "";
  let out = value;
  for (const [pattern, replacement] of ASCII_SWAPS) {
    out = out.replace(pattern, replacement);
  }
  // Anything still outside plain ASCII would cost double; drop it.
  out = out
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return max && out.length > max ? out.slice(0, max) : out;
}

export type QuoteBody = {
  name?: string;
  phone?: string;
  email?: string;
  vehicle?: string;
  body_style?: string;
  /** Service names, e.g. "Window Tint, PPF". Older clients also append
      " — <notes>" here; both shapes are accepted. */
  service?: string;
  /** Follow-up answers, e.g. "Window Tint: Windshield; PPF: Hood" */
  details?: string;
  /** Customer's free-text notes */
  notes?: string;
  preferred_contact?: string;
  botcheck?: string;
  elapsed_ms?: number | string;
};

export function buildSms(body: QuoteBody): string {
  const name = clean(body.name, FIELD_CAPS.name) || "Someone";
  const phone = clean(body.phone, FIELD_CAPS.phone);
  const vehicle = clean(body.vehicle, FIELD_CAPS.vehicle);
  const style = clean(body.body_style, FIELD_CAPS.style);
  const service = clean(body.service, FIELD_CAPS.service);
  const details = clean(body.details, FIELD_CAPS.details);
  const notes = clean(body.notes, FIELD_CAPS.notes);
  // Must be included: the form lets a customer choose "Email me" and then
  // requires their address, and the confirmation screen promises a reply by
  // email. Leaving it out of the only channel the shop reads would hand
  // them a lead they are unable to answer.
  const email = clean(body.email, FIELD_CAPS.email);
  const pref = clean(body.preferred_contact, FIELD_CAPS.pref);

  /* Ordering matters on overflow: contact details, preference and vehicle
     come first, so a trim can only ever eat the tail of the notes — never
     the way to call them back. */
  const parts = [`${SHOP_NAME} - new quote`, name];
  if (phone) parts.push(phone);
  if (email && email !== "(not provided)") parts.push(email);
  if (pref) parts.push(`Prefers: ${pref}`);
  // Vehicle and body style read as one unit: "2021 Toyota Camry (Sedan)"
  if (vehicle) parts.push(style ? `${vehicle} (${style})` : vehicle);
  else if (style) parts.push(style);
  if (service) parts.push(service);
  if (details) parts.push(details);
  if (notes) parts.push(`Notes: ${notes}`);

  let msg = neutralizeLinks(parts.join(" | "));
  if (msg.length > MAX_SMS_CHARS) msg = msg.slice(0, MAX_SMS_CHARS - 3) + "...";
  return msg;
}

/** Client-side checks are not enough — this endpoint is public. Returns a
    reason when the payload is not a real quote; null when it is. */
export function quoteValidationError(body: QuoteBody): string | null {
  const name = clean(body.name, FIELD_CAPS.name);
  const phoneDigits = clean(body.phone, FIELD_CAPS.phone).replace(/\D/g, "");
  const service = clean(body.service, FIELD_CAPS.service);
  if (name.length < 2) return "missing-name";
  if (phoneDigits.length < 10) return "missing-phone";
  if (!service || service === "(not specified)") return "missing-service";

  const pref = clean(body.preferred_contact, FIELD_CAPS.pref);
  if (pref === "Email me") {
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "missing-email";
  }
  return null;
}
