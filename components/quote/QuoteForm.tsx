"use client";

/* ============================================================
   Dallas Tint Shop — multi-step quote form
   Steps: 1) Vehicle  2) Body style  3) Service  4) Contact  5) Confirmation

   Ported from the Wylie Car Care project (js/quote.js). The step machine,
   validation, dual-channel delivery and fallbacks are unchanged in
   behaviour; the DOM manipulation became React state and the CSS became
   Tailwind on this site's brand.

   On submit, one notification fires: POST to /api/notify → text to the
   owner's phone (app/api/notify/route.ts). This shop wants texts only.

   ⚠️ That makes the text the ONLY record of a lead, so it has to carry
   everything: the customer's notes ride inside `service` (see serviceLine
   below) and the notes box is capped at NOTES_MAX to keep a full lead
   inside four Textbelt segments. If the balance runs out, leads stop
   arriving at all — the route warns the owner at 50/25/10/5/3 credits.
   If a permanent archive is ever wanted back, the email channel was a
   second parallel POST to Web3Forms — see git history for
   app/api/email/route.ts.

   If the text fails, the confirmation screen hands the customer a prefilled
   text addressed to the shop, already containing their details — so there
   is no state where the customer believes they contacted the shop and the
   shop got nothing.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MakeCombobox from "./MakeCombobox";
import ContactSelect from "./ContactSelect";
import {
  BODY_STYLES,
  CONFIRM_MSGS,
  SERVICE_CHIPS,
  SHOP_SMS,
  STEPS,
  TOTAL_STEPS,
  type ContactPref,
} from "@/lib/quote-config";
import { BUSINESS } from "@/lib/data";

const CONFIRM_STEP = TOTAL_STEPS + 1;

/* Ceiling on the free-text notes box. The notes ride along inside the
   `service` field of the text to the shop, and Textbelt charges per
   160-character segment — 300 keeps a fully-loaded lead inside four
   segments (~6c). Kept in sync with the 400-char `service` cap in
   app/api/notify/route.ts. */
const NOTES_MAX = 300;

type Errors = Record<string, boolean>;

export default function QuoteForm() {
  const [step, setStep] = useState(1);

  // vehicle
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [bodyStyle, setBodyStyle] = useState("");

  // service
  const [services, setServices] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  // contact
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contactPref, setContactPref] = useState<ContactPref | "">("");

  /* Honeypot. Real customers never see this field, so a non-empty value on
     submit means a bot walked the form and filled every input. Read into
     the payload rather than hardcoded empty, so the server-side check
     actually catches form-filling bots and not just raw JSON POSTs. */
  const [botcheck, setBotcheck] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  // Delivery outcome, which decides what the confirmation screen offers.
  const [textOk, setTextOk] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  /* Sent with the submission so the server can reject anything filled out
     faster than a human plausibly could — see rejectReason() in the route. */
  const loadedAt = useRef(Date.now());

  /* ---------- derived ---------- */

  const vehicle = [year, make, model].filter(Boolean).join(" ");
  const serviceLine = [services.join(", "), notes.trim()]
    .filter(Boolean)
    .join(" — ");

  /* ---------- step navigation ---------- */

  // Bring the card back to the top on advance so each step starts at its
  // heading rather than wherever the previous step happened to leave the
  // scroll position — on a phone the difference is a step that looks empty.
  useEffect(() => {
    if (step === 1) return;
    const card = cardRef.current;
    if (card) {
      window.scrollTo({
        top: card.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    }
    if (step <= TOTAL_STEPS) {
      const first = stepRef.current?.querySelector<HTMLElement>(
        "input, textarea, button[role='combobox'], [data-chip]",
      );
      first?.focus({ preventScroll: true });
    }
  }, [step]);

  function clearError(field: string) {
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  }

  /* ---------- validation ---------- */

  function validVehicle(): boolean {
    const yearNum = parseInt(year.trim(), 10);
    const next: Errors = {
      year:
        !year.trim() ||
        isNaN(yearNum) ||
        yearNum < 1990 ||
        yearNum > new Date().getFullYear() + 1,
      make: !make.trim(),
      model: !model.trim(),
    };
    setErrors((e) => ({ ...e, ...next }));
    return !next.year && !next.make && !next.model;
  }

  function validBodyStyle(): boolean {
    const bad = !bodyStyle;
    setErrors((e) => ({ ...e, bodyStyle: bad }));
    return !bad;
  }

  // Passes on a tap OR a typed note — nobody is blocked because they
  // couldn't name what they want done.
  function validService(): boolean {
    const bad = services.length === 0 && !notes.trim();
    setErrors((e) => ({ ...e, service: bad }));
    return !bad;
  }

  function validContact(): boolean {
    const emailFmtOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const next: Errors = {
      name: name.trim().length < 2,
      phone: phone.replace(/\D/g, "").length < 10,
      // Required only when they asked to be emailed; otherwise validated
      // for format only if they chose to fill it in.
      email:
        contactPref === "Email me"
          ? !email.trim() || !emailFmtOk
          : email.trim().length > 0 && !emailFmtOk,
      contactPref: !contactPref,
    };
    setErrors((e) => ({ ...e, ...next }));
    return !next.name && !next.phone && !next.email && !next.contactPref;
  }

  function next() {
    if (step === 1 && !validVehicle()) return;
    if (step === 2 && !validBodyStyle()) return;
    if (step === 3 && !validService()) return;
    setStep((s) => s + 1);
  }

  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  /* ---------- message the shop receives ---------- */

  function buildMessage(): string {
    return (
      `New quote request from ${name}:\n` +
      `Vehicle: ${vehicle}\n` +
      `Body style: ${bodyStyle || "(not specified)"}\n` +
      `Service: ${serviceLine || "(not specified)"}\n` +
      `Customer phone: ${phone}\n` +
      `Customer email: ${email.trim() || "(not provided)"}\n` +
      `Preferred contact: ${contactPref || "(not specified)"}`
    );
  }

  /* ---------- manual fallback links ---------- */

  // iOS wants "&body=", Android and everything else want "?body=".
  function smsHref(body: string): string {
    const isIOS =
      typeof navigator !== "undefined" &&
      (/iP(hone|od|ad)/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    return `sms:${SHOP_SMS}${isIOS ? "&" : "?"}body=${encodeURIComponent(body)}`;
  }

  /* ---------- submit ---------- */

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validContact()) return;

    setSubmitting(true);

    const message = buildMessage();
    const payload = {
      subject: `Quote Request — ${vehicle} (${name})`,
      from_name: name,
      name,
      phone,
      email: email.trim() || "(not provided)",
      vehicle,
      body_style: bodyStyle,
      service: serviceLine || "(not specified)",
      preferred_contact: contactPref,
      message,
      botcheck,
      elapsed_ms: Date.now() - loadedAt.current,
    };

    /* Resolves to the parsed response, or null if the request or the parse
       failed. Never rejects — the customer sees a confirmation either way,
       and the null is what triggers the fallback links. */
    async function post(url: string, data: unknown) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        return await res.json();
      } catch {
        return null;
      }
    }

    // text — the heads-up that buzzes the owner's phone, and the only
    // channel this shop uses
    const textRes = await post("/api/notify", payload);

    setTextOk(Boolean(textRes?.ok));
    setSubmitting(false);
    setStep(CONFIRM_STEP);
  }

  /* ---------- render ---------- */

  const progressPct = (Math.min(step, CONFIRM_STEP) / CONFIRM_STEP) * 100;

  return (
    <div ref={cardRef} className="card-edge rounded-md bg-black/60 backdrop-blur">
      {/* progress */}
      <div className="border-b border-white/10 px-6 pb-5 pt-6 sm:px-8">
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-red-grad transition-[width] duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <ol className="mt-4 flex items-center justify-between gap-2">
          {[...STEPS, "Done"].map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <li
                key={label}
                className="flex min-w-0 flex-1 items-center gap-2"
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] transition-colors ${
                    done
                      ? "bg-brand-red text-white"
                      : active
                        ? "bg-white text-black"
                        : "bg-white/10 text-white/40"
                  }`}
                >
                  {done ? "✓" : n === CONFIRM_STEP ? "★" : n}
                </span>
                <span
                  className={`h-display hidden truncate text-[10px] uppercase tracking-[0.25em] sm:block ${
                    active ? "text-white" : "text-white/40"
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <form onSubmit={onSubmit} noValidate className="px-6 py-7 sm:px-8">
        {/* Honeypot — real customers never see or fill this. */}
        <input
          type="text"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          value={botcheck}
          onChange={(e) => setBotcheck(e.target.value)}
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />

        <div ref={stepRef}>
          {/* ---------- step 1: vehicle ---------- */}
          {step === 1 && (
            <StepShell
              title="Your vehicle"
              sub="Let's start with what you drive."
            >
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Year"
                  htmlFor="year"
                  error={errors.year}
                  message="Enter a year from 1990 onward."
                >
                  <input
                    id="year"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="2021"
                    value={year}
                    onChange={(e) => {
                      setYear(e.target.value.replace(/\D/g, ""));
                      clearError("year");
                    }}
                    aria-invalid={errors.year || undefined}
                    className={inputCls(errors.year)}
                  />
                </Field>

                <Field
                  label="Make"
                  htmlFor="make"
                  error={errors.make}
                  message="Which make?"
                >
                  <MakeCombobox
                    value={make}
                    onChange={(v) => {
                      setMake(v);
                      clearError("make");
                    }}
                    invalid={errors.make}
                  />
                </Field>
              </div>

              <Field
                label="Model"
                htmlFor="model"
                error={errors.model}
                message="Which model?"
              >
                <input
                  id="model"
                  placeholder="Camry, F-150, Model 3…"
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    clearError("model");
                  }}
                  aria-invalid={errors.model || undefined}
                  className={inputCls(errors.model)}
                />
              </Field>
            </StepShell>
          )}

          {/* ---------- step 2: body style ---------- */}
          {step === 2 && (
            <StepShell
              title="Body style"
              sub="Tint pricing comes down to how many windows you've got."
            >
              <Field error={errors.bodyStyle} message="Pick one to continue.">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {BODY_STYLES.map((s) => {
                    const selected = bodyStyle === s.value;
                    return (
                      <button
                        key={s.value}
                        type="button"
                        data-chip
                        aria-pressed={selected}
                        onClick={() => {
                          setBodyStyle(s.value);
                          clearError("bodyStyle");
                        }}
                        className={`group flex flex-col items-center gap-2 rounded-sm border px-3 py-4 text-center transition-all ${
                          selected
                            ? "border-brand-red bg-brand-red/15 text-white shadow-redGlow"
                            : "border-white/12 bg-white/[0.03] text-white/75 hover:border-brand-red/60 hover:bg-brand-red/5"
                        }`}
                      >
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                          className={
                            selected ? "text-brand-red" : "text-white/50"
                          }
                        >
                          {s.icon}
                        </svg>
                        <span className="h-display text-sm uppercase tracking-widest">
                          {s.value}
                        </span>
                        <span className="text-[10px] text-white/40">
                          {s.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </StepShell>
          )}

          {/* ---------- step 3: service ---------- */}
          {step === 3 && (
            <StepShell
              title="What do you need?"
              sub="Tap anything that applies, or just describe it below."
            >
              <Field
                error={errors.service}
                message="Pick a service or tell us what you're after."
              >
                <div className="flex flex-wrap gap-2">
                  {SERVICE_CHIPS.map((chip) => {
                    const selected = services.includes(chip.label);
                    return (
                      <button
                        key={chip.label}
                        type="button"
                        data-chip
                        aria-pressed={selected}
                        onClick={() => {
                          setServices((prev) =>
                            prev.includes(chip.label)
                              ? prev.filter((s) => s !== chip.label)
                              : [...prev, chip.label],
                          );
                          clearError("service");
                        }}
                        className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all sm:min-h-0 sm:px-3.5 sm:text-xs ${
                          selected
                            ? "border-brand-red bg-brand-red/15 text-white"
                            : "border-white/12 bg-white/[0.03] text-white/75 hover:border-brand-red/60 hover:bg-brand-red/5"
                        }`}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                          className={
                            selected ? "text-brand-red" : "text-white/45"
                          }
                        >
                          {chip.icon}
                        </svg>
                        {chip.label}
                        {selected && (
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                            className="text-brand-red"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Anything else?" htmlFor="notes">
                {/* Bounded at 300 so the text to the shop stays inside four
                    Textbelt segments. This box is the only free-text the
                    shop receives, so it must never be silently swallowed —
                    hence the counter rather than a hard stop with no
                    explanation. */}
                <textarea
                  id="notes"
                  rows={3}
                  maxLength={NOTES_MAX}
                  placeholder="Shade you're after, deadline, questions…"
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    clearError("service");
                  }}
                  className={inputCls(false)}
                />
                {notes.length > NOTES_MAX - 100 && (
                  <p
                    aria-live="polite"
                    className={`mt-1.5 text-right text-xs ${
                      notes.length >= NOTES_MAX ? "text-brand-red" : "text-white/45"
                    }`}
                  >
                    {notes.length >= NOTES_MAX
                      ? `${NOTES_MAX} character limit reached — call us with the rest`
                      : `${NOTES_MAX - notes.length} characters left`}
                  </p>
                )}
              </Field>
            </StepShell>
          )}

          {/* ---------- step 4: contact ---------- */}
          {step === 4 && (
            <StepShell
              title="How can we reach you?"
              sub="Last step — we'll come back with an honest estimate."
            >
              {/* Reading their request back cuts the "did that go through?"
                  feeling, and with it the duplicate submissions. */}
              <div className="rounded-sm border border-white/10 bg-white/[0.02] p-4">
                <h3 className="h-display text-[10px] uppercase tracking-[0.3em] text-brand-red">
                  Your request
                </h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-white/45">Vehicle</dt>
                    <dd className="text-white/90">
                      {vehicle || "—"}
                      {bodyStyle && (
                        <span className="text-white/50"> · {bodyStyle}</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-white/45">Service</dt>
                    <dd className="text-white/90">{serviceLine || "—"}</dd>
                  </div>
                </dl>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Name"
                  htmlFor="name"
                  error={errors.name}
                  message="Tell us your name."
                >
                  <input
                    id="name"
                    autoComplete="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearError("name");
                    }}
                    aria-invalid={errors.name || undefined}
                    className={inputCls(errors.name)}
                  />
                </Field>

                <Field
                  label="Phone"
                  htmlFor="phone"
                  error={errors.phone}
                  message="Enter a 10-digit phone number."
                >
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(214) 000-0000"
                    value={phone}
                    onChange={(e) => {
                      setPhone(formatPhone(e.target.value));
                      clearError("phone");
                    }}
                    aria-invalid={errors.phone || undefined}
                    className={inputCls(errors.phone)}
                  />
                </Field>
              </div>

              <Field
                label="Preferred contact"
                error={errors.contactPref}
                message="How should we get back to you?"
              >
                <ContactSelect
                  value={contactPref}
                  onChange={(v) => {
                    setContactPref(v);
                    clearError("contactPref");
                    clearError("email");
                  }}
                  invalid={errors.contactPref}
                />
              </Field>

              <Field
                label="Email"
                htmlFor="email"
                // Required only when they asked to be emailed back.
                optional={contactPref !== "Email me"}
                error={errors.email}
                message="Enter a valid email address."
              >
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  aria-invalid={errors.email || undefined}
                  className={inputCls(errors.email)}
                />
              </Field>
            </StepShell>
          )}

          {/* ---------- step 5: confirmation ---------- */}
          {step === CONFIRM_STEP && (
            <Confirmation
              contactPref={contactPref}
              textOk={textOk}
              message={buildMessage()}
              smsHref={smsHref}
            />
          )}
        </div>

        {/* ---------- nav ---------- */}
        {step <= TOTAL_STEPS && (
          <div className="mt-7 flex items-center gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={back}
                className="h-display rounded-sm border border-white/15 bg-white/[0.04] px-5 py-3.5 text-xs uppercase tracking-[0.25em] text-white/80 transition-colors hover:bg-white/10"
              >
                Back
              </button>
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={next}
                className="h-display group ml-auto inline-flex items-center gap-2 rounded-sm bg-red-grad px-6 py-3.5 text-xs uppercase tracking-[0.25em] text-white shadow-redGlow transition-all hover:-translate-y-0.5 hover:shadow-redGlowLg"
              >
                Continue
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="h-display ml-auto inline-flex items-center gap-2 rounded-sm bg-red-grad px-6 py-3.5 text-xs uppercase tracking-[0.25em] text-white shadow-redGlow transition-all hover:-translate-y-0.5 hover:shadow-redGlowLg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Request Quote"}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

/* ---------- confirmation screen ---------- */

function Confirmation({
  contactPref,
  textOk,
  message,
  smsHref,
}: {
  contactPref: ContactPref | "";
  textOk: boolean;
  message: string;
  smsHref: (body: string) => string;
}) {
  /* Two delivery outcomes, two different things to say:
       - text landed  → normal confirmation, no fallbacks
       - text failed  → the customer's own phone is the only remaining
                        delivery path, and the copy says so plainly */
  const nothingLanded = !textOk;

  return (
    <div className="py-4 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-red/15">
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="text-brand-red"
        >
          {nothingLanded ? (
            <>
              <path d="M12 8v5M12 16h.01" />
              <circle cx="12" cy="12" r="9" />
            </>
          ) : (
            <path d="M20 6L9 17l-5-5" />
          )}
        </svg>
      </div>

      <h2 className="h-display mt-5 text-4xl uppercase text-white sm:text-5xl">
        {nothingLanded ? "Almost there" : "Request received!"}
      </h2>

      <p
        aria-live="polite"
        className="mx-auto mt-3 max-w-md text-sm text-white/70"
      >
        {nothingLanded
          ? "We couldn't confirm delivery of your request. Send it to us directly with the button below — it's already filled in for you."
          : contactPref
            ? CONFIRM_MSGS[contactPref]
            : "We'll be in touch with your estimate shortly."}
      </p>

      <div className="mt-7 flex flex-col items-stretch gap-3 sm:mx-auto sm:max-w-sm">
        {/* A lead who's already hot gets a path to close now instead of
            waiting on a callback. */}
        {!nothingLanded && (
          <a
            href={BUSINESS.phoneHref}
            className="h-display inline-flex items-center justify-center gap-2 rounded-sm bg-red-grad px-6 py-4 text-xs uppercase tracking-[0.2em] text-white shadow-redGlow transition-all hover:-translate-y-0.5"
          >
            Can&apos;t wait? Call {BUSINESS.phone}
          </a>
        )}

        {!textOk && (
          <a
            href={smsHref(message)}
            className={
              nothingLanded
                ? "h-display inline-flex items-center justify-center gap-2 rounded-sm bg-red-grad px-6 py-4 text-xs uppercase tracking-[0.2em] text-white shadow-redGlow transition-all hover:-translate-y-0.5"
                : "h-display inline-flex items-center justify-center gap-2 rounded-sm border border-white/15 bg-white/[0.04] px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-white/85 transition-colors hover:bg-white/10"
            }
          >
            {nothingLanded ? "Text us your request" : "Text us a copy to be sure"}
          </a>
        )}

        <Link
          href="/"
          className="h-display px-6 py-3 text-xs uppercase tracking-[0.25em] text-white/45 transition-colors hover:text-white"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

/* ---------- small building blocks ---------- */

function StepShell({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="h-display text-3xl uppercase text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-white/55">{sub}</p>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  error,
  message,
  children,
}: {
  label?: string;
  htmlFor?: string;
  optional?: boolean;
  error?: boolean;
  message?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {label && (
        <label
          htmlFor={htmlFor}
          className="h-display mb-2 block text-[10px] uppercase tracking-[0.3em] text-white/60"
        >
          {label}
          {optional && (
            <span className="ml-1 normal-case tracking-normal text-white/30">
              (optional)
            </span>
          )}
        </label>
      )}
      {children}
      {error && message && (
        <p role="alert" className="mt-1.5 text-xs text-brand-red">
          {message}
        </p>
      )}
    </div>
  );
}

function inputCls(invalid?: boolean): string {
  /* text-base (16px) on mobile is not a style choice: iOS Safari zooms the
     viewport whenever a focused input is smaller than 16px, and it does not
     zoom back out. Dropping to text-sm from `sm:` up keeps the desktop look
     unchanged. */
  return `w-full rounded-sm border bg-white/[0.03] px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-red sm:text-sm ${
    invalid ? "border-brand-red" : "border-white/10"
  }`;
}

// Formats to (214) 555-0123 as they type. Digits-only under the hood, so
// validation and the SMS payload never see the punctuation.
function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
