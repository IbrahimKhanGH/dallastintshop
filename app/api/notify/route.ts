/* ============================================================
   POST /api/notify — texts the shop when a quote comes in.

   Ported from the Wylie Car Care project (api/notify.js) to a Next.js
   App Router route handler. Behaviour is unchanged; only the request
   and response plumbing differs.

   Runs server-side so the Textbelt API key never reaches the browser.
   This shop is SMS-only: there is no second channel, so this text IS the
   lead. Everything the shop needs to act on it has to fit in here.

   Required environment variables (Vercel → Settings → Environment Variables):
     TEXTBELT_KEY  — API key from https://textbelt.com/purchase
     NOTIFY_PHONE  — destination number, digits only (e.g. 4695551234)

   Textbelt bills one credit per 160-character segment. This shop is
   SMS-only — there is no email carrying the full details — so the cap is
   four segments rather than two. Worst case that is ~6c per lead against a
   job worth hundreds; losing the customer's own description of the work to
   save 4c is a bad trade. Typical leads still come in at 1-2 segments.

   Tip: append "_test" to TEXTBELT_KEY to validate the key without
   spending a credit — the API returns success without sending.
   ============================================================ */

// POST handlers are dynamic by default, but be explicit: this must never
// be statically evaluated at build time.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_SMS_CHARS = 640; // 4 segments, ~6c worst case

// Credits run out silently: Textbelt just starts returning "Out of quota"
// and the shop stops hearing about quote requests. Warn the owner on the
// way down so topping up is a scheduled errand, not an emergency.
//
// Every send decrements the quota by exactly 1, so the counter passes
// through each of these numbers once and only once — no persistent state
// needed to avoid re-warning. The warning itself costs a credit, which is
// why the thresholds are spaced more than 1 apart (a warning can never
// skip the next one).
// 50 gives roughly two weeks' notice at a few quotes a day; the rest are
// escalating reminders. Five warnings over the life of a 700-credit bundle.
const QUOTA_WARN_AT = [50, 25, 10, 5, 3];

// The shop name Textbelt reports as the sender, and the prefix on the text
// itself. Kept in sync with BUSINESS.name in lib/data.ts.
const SHOP_NAME = "Dallas Tint Shop";

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

function clean(value: unknown, max?: number): string {
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

type QuoteBody = {
  name?: string;
  phone?: string;
  email?: string;
  vehicle?: string;
  body_style?: string;
  service?: string;
  preferred_contact?: string;
  botcheck?: string;
  elapsed_ms?: number | string;
};

function buildSms(body: QuoteBody): string {
  const name = clean(body.name, 40) || "Someone";
  const phone = clean(body.phone, 20);
  const vehicle = clean(body.vehicle, 40);
  const style = clean(body.body_style, 20);
  /* `service` arrives as "Ceramic Tint, PPF - <customer's own notes>", so
     this is the field that carries what they actually asked for. The form
     bounds the notes box at 300 characters, and 400 here leaves room for
     that plus every service chip. */
  const service = clean(body.service, 400);
  // Must be included: the form lets a customer choose "Email me" and then
  // requires their address, and the confirmation screen promises a reply by
  // email. Leaving it out of the only channel the shop reads would hand
  // them a lead they are unable to answer.
  const email = clean(body.email, 60);
  const pref = clean(body.preferred_contact, 20);

  const parts = [`${SHOP_NAME} - new quote`, name];
  if (phone) parts.push(phone);
  if (email && email !== "(not provided)") parts.push(email);
  // Vehicle and body style read as one unit: "2021 Toyota Camry (Sedan)"
  if (vehicle) parts.push(style ? `${vehicle} (${style})` : vehicle);
  else if (style) parts.push(style);
  if (service) parts.push(service);
  if (pref) parts.push(`Prefers: ${pref}`);

  /* Ordering matters on overflow: name, phone and vehicle come first so a
     trim only ever eats the tail of the notes, never the way to call them
     back. */
  let msg = neutralizeLinks(parts.join(" | "));
  if (msg.length > MAX_SMS_CHARS) msg = msg.slice(0, MAX_SMS_CHARS - 3) + "...";
  return msg;
}

type TextbeltResult = {
  success?: boolean;
  error?: string;
  textId?: string;
  quotaRemaining?: number;
};

/* Textbelt's docs show form-encoded curl examples, but the endpoint accepts
   a JSON body just as well (verified against key=textbelt_test).

   `sender` is a regulatory field naming the sending organisation. It isn't
   shown to the recipient in most countries, but Textbelt requires the
   business name be identifiable — buildSms() also leads with it in the body
   itself. No "Reply STOP" language is needed: these go to the shop owner's
   own phone, not to consumers. */
async function sendText(
  key: string,
  phone: string,
  message: string,
): Promise<TextbeltResult> {
  const res = await fetch("https://textbelt.com/text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, message, key, sender: SHOP_NAME }),
  });
  return (await res.json()) as TextbeltResult;
}

/* ---------- abuse guards ----------------------------------------
   This endpoint is public and unauthenticated: anyone can POST to it
   directly and burn the whole Textbelt bundle in a minute. None of the
   checks below are individually strong, but together they make casual
   abuse more work than it's worth, and the global cap bounds the damage
   from anything that gets through.

   State lives in module scope, which on Vercel survives between
   invocations on a warm instance but is lost when instances cycle or
   scale out. That's a real limitation — see DAILY_TEXT_CAP below. For a
   hard guarantee this needs a shared store (Vercel KV / Upstash).
------------------------------------------------------------------- */

const RATE_WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 1; // per IP per minute
const MAX_PER_DAY_IP = 3; // per IP per day
const DAILY_TEXT_CAP = 15; // global per day; a busy day at the shop is ~5
const MONTHLY_TEXT_CAP = 150; // hard ceiling on spend from this endpoint
const DEDUPE_MS = 10 * 60 * 1000;
const MIN_FILL_MS = 3000; // humans can't complete a 4-step form faster
const DAY_MS = 24 * 60 * 60 * 1000;

const ipHits = new Map<string, number[]>(); // ip -> [timestamps]
const recent = new Map<string, number>(); // phone -> timestamp of last text sent
let dailyCap: { day: string | null; sent: number } = { day: null, sent: 0 };
let monthlyCap: { month: string | null; sent: number } = { month: null, sent: 0 };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function thisMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  return fwd.split(",")[0].trim() || "unknown";
}

// Keeps the Maps from growing without bound on a long-lived instance.
function prune(map: Map<string, number[] | number>, maxAgeMs: number): void {
  const cutoff = Date.now() - maxAgeMs;
  map.forEach((v, k) => {
    const last = Array.isArray(v) ? v[v.length - 1] : v;
    if (last < cutoff) map.delete(k);
  });
}

// Returns a string reason to reject, or null to allow.
function rejectReason(req: Request, body: QuoteBody): string | null {
  // 1. Honeypot — the form ships botcheck empty; bots fill every field.
  if (body.botcheck) return "honeypot";

  // 2. Submitted too fast to be a real person filling four steps.
  const elapsed = parseInt(String(body.elapsed_ms), 10);
  if (!isNaN(elapsed) && elapsed < MIN_FILL_MS) return "too-fast";

  /* 3. Must originate from a page on this deployment, and must say so.
        This used to be `if (origin) { ...check... }`, which meant a request
        carrying no Origin header at all skipped the check — a bare
        `curl -X POST` at this URL went straight through to Textbelt and
        spent real credits. A browser always sends Origin on a cross-origin
        POST and Referer on a same-origin one, so requiring one of them
        costs a real customer nothing.

        A determined attacker can still forge the header. This stops the
        drive-by case; the caps below are what bound the damage from anyone
        who bothers. */
  const host = req.headers.get("host");
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const claimed = origin ?? referer;
  if (!claimed) return "no-origin";
  try {
    if (new URL(claimed).host !== host) return "bad-origin";
  } catch {
    return "bad-origin";
  }

  // 4. Per-IP rate limit, short window and daily.
  const ip = clientIp(req);
  const now = Date.now();
  prune(ipHits, DAY_MS);
  const stamps = (ipHits.get(ip) ?? []).filter((t) => now - t < DAY_MS);
  if (stamps.filter((t) => now - t < RATE_WINDOW_MS).length >= MAX_PER_WINDOW) {
    return "rate-minute";
  }
  if (stamps.length >= MAX_PER_DAY_IP) return "rate-day";
  stamps.push(now);
  ipHits.set(ip, stamps);

  /* 5. Global ceilings — the backstop that bounds spend even if an attacker
        rotates IPs past every check above.

        ⚠️ These counters live in module scope. On Vercel that survives
        between invocations on a warm instance but resets on a cold start and
        is not shared across instances, so the real ceiling is roughly
        (cap x live instances), not the cap. They bound the damage; they do
        not hard-stop it. The genuine hard stop is the Textbelt balance
        itself — keep it small and top it up, rather than loading $100 into
        a key a public endpoint can spend. Vercel's WAF rate limiting, or
        moving these counters to Vercel KV, is what makes this exact. */
  if (dailyCap.day !== today()) dailyCap = { day: today(), sent: 0 };
  if (dailyCap.sent >= DAILY_TEXT_CAP) return "daily-cap";

  if (monthlyCap.month !== thisMonth()) monthlyCap = { month: thisMonth(), sent: 0 };
  if (monthlyCap.sent >= MONTHLY_TEXT_CAP) return "monthly-cap";

  return null;
}

// Same customer submitting twice in ten minutes: the shop already got the
// first text, so skip the duplicate rather than spending another credit.
function isDuplicate(body: QuoteBody): boolean {
  const phone = clean(body.phone, 20);
  if (!phone) return false;
  prune(recent, DEDUPE_MS);
  const last = recent.get(phone);
  if (last && Date.now() - last < DEDUPE_MS) return true;
  recent.set(phone, Date.now());
  return false;
}

// Best-effort second text warning the owner that credits are running low.
// Never allowed to affect the customer's submission, so every failure here
// is swallowed after logging.
async function warnLowQuota(
  key: string,
  phone: string,
  remaining: number,
): Promise<void> {
  try {
    await sendText(
      key,
      phone,
      `${SHOP_NAME}: only ${remaining} text credits left. ` +
        "Top up at textbelt.com/purchase or quote alerts will stop.",
    );
    console.log("notify: low-quota warning sent at", remaining);
  } catch (err) {
    console.error(
      "notify: low-quota warning failed:",
      err instanceof Error ? err.message : err,
    );
  }
}

export async function POST(req: Request): Promise<Response> {
  const key = process.env.TEXTBELT_KEY;
  const phone = (process.env.NOTIFY_PHONE ?? "").replace(/\D/g, "");

  if (!key || !phone) {
    console.error("notify: TEXTBELT_KEY or NOTIFY_PHONE is not set");
    return Response.json({ ok: false, error: "Not configured" });
  }

  let body: QuoteBody;
  try {
    body = (await req.json()) as QuoteBody;
  } catch {
    body = {};
  }
  if (!body || typeof body !== "object") body = {};

  // Blocked requests get ok:true — the customer is told everything is fine,
  // while a spammer learns nothing about which check caught them. Reasons go
  // to the logs only.
  const reason = rejectReason(req, body);
  if (reason) {
    console.warn(`notify: blocked (${reason}) ip:`, clientIp(req));
    return Response.json({ ok: true, skipped: reason });
  }

  if (isDuplicate(body)) {
    console.log("notify: duplicate within 10min, not resending");
    return Response.json({ ok: true, skipped: "duplicate" });
  }

  try {
    const message = buildSms(body);
    // Logged so the exact text is recoverable from the Vercel dashboard
    // without needing the shop phone in hand. Also shows the segment count,
    // which is what Textbelt actually bills per.
    console.log(
      `notify: sending (${message.length} chars, ` +
        `${Math.ceil(message.length / 160)} credit(s)):`,
      message,
    );

    const result = await sendText(key, phone, message);
    if (result.success) {
      dailyCap.sent++;
      monthlyCap.sent++;
    }

    if (!result.success) {
      // Most likely "Out of quota" — surfaces in the Vercel function logs.
      // ok:false makes the browser offer the customer a manual text link.
      console.error(
        "notify: textbelt refused:",
        result.error,
        "quota:",
        result.quotaRemaining,
      );
      return Response.json({ ok: false, error: result.error || "Send failed" });
    }

    // textId can be fed to Textbelt's delivery-status lookup if a text is
    // ever reported missing — worth having in the logs.
    console.log(
      "notify: sent, textId:",
      result.textId,
      "quota remaining:",
      result.quotaRemaining,
    );

    if (
      typeof result.quotaRemaining === "number" &&
      QUOTA_WARN_AT.includes(result.quotaRemaining)
    ) {
      await warnLowQuota(key, phone, result.quotaRemaining);
    }

    return Response.json({ ok: true, quotaRemaining: result.quotaRemaining });
  } catch (err) {
    console.error(
      "notify: textbelt request threw:",
      err instanceof Error ? err.message : err,
    );
    // Never fail the customer's submission over a text we couldn't send.
    return Response.json({ ok: false, error: "Send failed" });
  }
}
