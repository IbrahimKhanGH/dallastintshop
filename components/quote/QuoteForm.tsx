"use client";

/* ============================================================
   Dallas Tint Shop — multi-step quote form
   Steps: 1) Service  2) Vehicle  3) Details  4) Contact  5) Confirmation

   Service comes first so every later question can be about what the
   customer actually wants: step 3 only asks the follow-ups for the services
   they picked (body style and windows for tint, areas for PPF, and so on).
   /quote?service=<slug> preselects a service — see QuoteFormFromUrl.

   On submit, one notification fires: POST to /api/notify → text to the
   owner's phone (app/api/notify/route.ts). This shop wants texts only.

   ⚠️ That makes the text the ONLY record of a lead, so it carries every
   answer: services, follow-up answers, body style, notes and contact
   details (lib/quote-message.ts builds it; tests/ prove nothing is
   dropped). If the Textbelt balance runs out, leads stop arriving — the
   route warns the owner at 50/25/10/5/3 credits.

   If the text fails, the confirmation screen hands the customer a prefilled
   text addressed to the shop, already containing their details — so there
   is no state where the customer believes they contacted the shop and the
   shop got nothing.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MakeCombobox from "./MakeCombobox";
import ContactSelect from "./ContactSelect";
import {
  BODY_STYLES,
  CONFIRM_MSGS,
  QUOTE_SERVICES,
  SHOP_SMS,
  STEPS,
  TOTAL_STEPS,
  quoteService,
  type ContactPref,
} from "@/lib/quote-config";
import { buildMessage, buildPayload, type QuoteAnswers } from "@/lib/quote-message";
import { BUSINESS } from "@/lib/business";
import { track } from "@/lib/analytics";

const CONFIRM_STEP = TOTAL_STEPS + 1;

/* Ceiling on the free-text notes box. Kept in sync with FIELD_CAPS.notes
   in lib/sms.ts, which is sized so a full notes box always arrives. */
const NOTES_MAX = 300;

type Errors = Record<string, boolean>;

/** Reads ?service= and preselects it. Must sit inside <Suspense>. */
export function QuoteFormFromUrl() {
  const param = useSearchParams().get("service") ?? "";
  return <QuoteForm initialService={quoteService(param) ? param : undefined} />;
}

export default function QuoteForm({ initialService }: { initialService?: string }) {
  const [step, setStep] = useState(1);

  // service
  const [services, setServices] = useState<string[]>(initialService ? [initialService] : []);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [bodyStyle, setBodyStyle] = useState("");
  const [notes, setNotes] = useState("");

  // vehicle
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

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

  // Config order, not tap order, so the text always reads the same way.
  const selected = QUOTE_SERVICES.filter((s) => services.includes(s.key));
  const needsBodyStyle = selected.some((s) => s.needsBodyStyle);
  const notesRequired =
    selected.length > 0 && selected.every((s) => s.notesRequiredAlone);
  const notesHint =
    selected.length === 1 && selected[0].notesHint
      ? selected[0].notesHint
      : "Deadline, questions, anything else we should know…";

  // With make "Other", the model field holds make and model together.
  const vehicle = [year, make === "Other" ? "" : make, model].filter(Boolean).join(" ");

  const quote: QuoteAnswers = {
    services: selected.map((s) => ({
      label: s.label,
      // Only answers to questions this service actually asks
      answers: (answers[s.key] ?? []).filter((a) => s.followUp?.options.includes(a)),
    })),
    bodyStyle: needsBodyStyle ? bodyStyle : "",
    notes,
    vehicle,
    name,
    phone,
    email,
    contactPref,
  };

  /* ---------- step navigation ---------- */

  // Bring the card back to the top on advance so each step starts at its
  // heading rather than wherever the previous step happened to leave the
  // scroll position — on a phone the difference is a step that looks empty.
  useEffect(() => {
    if (step === 1) return;
    const card = cardRef.current;
    if (card) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: card.getBoundingClientRect().top + window.scrollY - 80,
        behavior: reduce ? "auto" : "smooth",
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

  function toggleService(key: string) {
    setServices((prev) => (prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]));
    clearError("service");
  }

  function toggleAnswer(key: string, option: string) {
    setAnswers((prev) => {
      const cur = prev[key] ?? [];
      return { ...prev, [key]: cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option] };
    });
  }

  /* ---------- validation ---------- */

  function validService(): boolean {
    const bad = services.length === 0;
    setErrors((e) => ({ ...e, service: bad }));
    return !bad;
  }

  function validVehicle(): boolean {
    const yearNum = parseInt(year.trim(), 10);
    const next: Errors = {
      year:
        !year.trim() ||
        isNaN(yearNum) ||
        yearNum < 1950 ||
        yearNum > new Date().getFullYear() + 1,
      make: !make.trim(),
      model: !model.trim(),
    };
    setErrors((e) => ({ ...e, ...next }));
    return !next.year && !next.make && !next.model;
  }

  function validDetails(): boolean {
    const next: Errors = {
      bodyStyle: needsBodyStyle && !bodyStyle,
      notes: notesRequired && !notes.trim(),
    };
    setErrors((e) => ({ ...e, ...next }));
    return !next.bodyStyle && !next.notes;
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
    if (step === 1 && !validService()) return;
    if (step === 2 && !validVehicle()) return;
    if (step === 3 && !validDetails()) return;
    track("quote_step", { step: step + 1 });
    setStep((s) => s + 1);
  }

  function back() {
    setStep((s) => Math.max(1, s - 1));
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
    // Enter in an earlier step's input submits the form; treat it as
    // "Continue" instead of sending a half-finished request.
    if (step < TOTAL_STEPS) {
      next();
      return;
    }
    if (!validContact()) return;
    if (submitting) return;

    setSubmitting(true);

    const payload = buildPayload(quote, {
      botcheck,
      elapsed_ms: Date.now() - loadedAt.current,
    });

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

    track("quote_submit", { services: payload.service });
    setTextOk(Boolean(textRes?.ok));
    setSubmitting(false);
    setStep(CONFIRM_STEP);
  }

  /* ---------- render ---------- */

  const progressPct = (Math.min(step, CONFIRM_STEP) / CONFIRM_STEP) * 100;
  const chipCls = (on: boolean) =>
    `inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
      on
        ? "border-brand-red bg-brand-red/15 text-white"
        : "border-white/15 bg-white/[0.03] text-white/80 hover:border-brand-red/60 hover:bg-brand-red/5"
    }`;

  return (
    <div ref={cardRef} className="card-edge rounded-md bg-black/60">
      {/* progress */}
      <div className="border-b border-white/10 px-6 pb-5 pt-6 sm:px-8">
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10" aria-hidden>
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
                        : "bg-white/10 text-white/60"
                  }`}
                >
                  {done ? "✓" : n === CONFIRM_STEP ? "★" : n}
                </span>
                <span
                  className={`h-display hidden truncate text-[11px] uppercase tracking-[0.25em] sm:block ${
                    active ? "text-white" : "text-white/60"
                  }`}
                >
                  {label}
                </span>
                <span className="sr-only sm:hidden">{label}</span>
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
          {/* ---------- step 1: service ---------- */}
          {step === 1 && (
            <StepShell title="What do you need?" sub="Tap everything you're interested in.">
              <Field error={errors.service} message="Pick at least one — choose Other if it's not listed.">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Services">
                  {QUOTE_SERVICES.map((s) => {
                    const on = services.includes(s.key);
                    return (
                      <button
                        key={s.key}
                        type="button"
                        data-chip
                        aria-pressed={on}
                        onClick={() => toggleService(s.key)}
                        className={chipCls(on)}
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
                          className={on ? "text-brand-red" : "text-white/55"}
                        >
                          {s.icon}
                        </svg>
                        {s.label}
                        {on && <Check />}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </StepShell>
          )}

          {/* ---------- step 2: vehicle ---------- */}
          {step === 2 && (
            <StepShell title="Your vehicle" sub="What are we working on?">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Year" htmlFor="year" error={errors.year} message="Enter a valid year.">
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

                <Field label="Make" htmlFor="make" error={errors.make} message="Which make?">
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
                label={make === "Other" ? "Make & model" : "Model"}
                htmlFor="model"
                error={errors.model}
                message={make === "Other" ? "Tell us the make and model." : "Which model?"}
              >
                <input
                  id="model"
                  placeholder={make === "Other" ? "e.g. Lotus Emira" : "Camry, F-150, Model 3…"}
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

          {/* ---------- step 3: details ---------- */}
          {step === 3 && (
            <StepShell
              title="A few details"
              sub="Only what helps us quote what you picked. Skip anything you're unsure of."
            >
              {needsBodyStyle && (
                <Field
                  label="Body style (for tint)"
                  error={errors.bodyStyle}
                  message="Pick one — tint pricing depends on the number of windows."
                >
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="group" aria-label="Body style">
                    {BODY_STYLES.map((b) => {
                      const on = bodyStyle === b.value;
                      return (
                        <button
                          key={b.value}
                          type="button"
                          data-chip
                          aria-pressed={on}
                          onClick={() => {
                            setBodyStyle(b.value);
                            clearError("bodyStyle");
                          }}
                          className={`flex flex-col items-center gap-1.5 rounded-sm border px-3 py-3.5 text-center transition-colors ${
                            on
                              ? "border-brand-red bg-brand-red/15 text-white"
                              : "border-white/15 bg-white/[0.03] text-white/80 hover:border-brand-red/60 hover:bg-brand-red/5"
                          }`}
                        >
                          <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                            className={on ? "text-brand-red" : "text-white/55"}
                          >
                            {b.icon}
                          </svg>
                          <span className="h-display text-sm uppercase tracking-widest">{b.value}</span>
                          <span className="text-[11px] text-white/60">{b.hint}</span>
                        </button>
                      );
                    })}
                  </div>
                </Field>
              )}

              {selected
                .filter((s) => s.followUp)
                .map((s) => (
                  <fieldset key={s.key}>
                    <legend className="h-display mb-2 text-[11px] uppercase tracking-[0.3em] text-white/75">
                      {s.label}: {s.followUp!.question}
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {s.followUp!.options.map((o) => {
                        const on = (answers[s.key] ?? []).includes(o);
                        return (
                          <button
                            key={o}
                            type="button"
                            data-chip
                            aria-pressed={on}
                            onClick={() => toggleAnswer(s.key, o)}
                            className={chipCls(on)}
                          >
                            {o}
                            {on && <Check />}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}

              <Field
                label={notesRequired ? "Tell us more" : "Anything else?"}
                htmlFor="notes"
                optional={!notesRequired}
                error={errors.notes}
                message="A quick description helps us quote this."
              >
                {/* Bounded so the text to the shop always carries it whole —
                    see FIELD_CAPS in lib/sms.ts. A counter rather than a
                    silent hard stop. */}
                <textarea
                  id="notes"
                  rows={3}
                  maxLength={NOTES_MAX}
                  placeholder={notesHint}
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    clearError("notes");
                  }}
                  aria-invalid={errors.notes || undefined}
                  className={inputCls(errors.notes)}
                />
                {notes.length > NOTES_MAX - 100 && (
                  <p
                    aria-live="polite"
                    className={`mt-1.5 text-right text-xs ${
                      notes.length >= NOTES_MAX ? "text-brand-red" : "text-white/60"
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
                <h3 className="h-display text-[11px] uppercase tracking-[0.3em] text-brand-red">
                  Your request
                </h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <SummaryRow label="Vehicle">
                    {vehicle || "—"}
                    {quote.bodyStyle && <span className="text-white/60"> · {quote.bodyStyle}</span>}
                  </SummaryRow>
                  {quote.services.map((s) => (
                    <SummaryRow key={s.label} label={s.label}>
                      {s.answers.length ? s.answers.join(", ") : "Yes"}
                    </SummaryRow>
                  ))}
                  {notes.trim() && <SummaryRow label="Notes">{notes.trim()}</SummaryRow>}
                </dl>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Name" htmlFor="name" error={errors.name} message="Tell us your name.">
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
              message={buildMessage(quote)}
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
                className="h-display min-h-11 rounded-sm border border-white/15 bg-white/[0.04] px-5 text-xs uppercase tracking-[0.25em] text-white/85 transition-colors hover:bg-white/10"
              >
                Back
              </button>
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={next}
                className="h-display group ml-auto inline-flex min-h-11 items-center gap-2 rounded-sm bg-red-grad px-6 text-xs uppercase tracking-[0.25em] text-white shadow-redGlow transition-all hover:-translate-y-0.5 hover:shadow-redGlowLg"
              >
                Continue
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="h-display ml-auto inline-flex min-h-11 items-center gap-2 rounded-sm bg-red-grad px-6 text-xs uppercase tracking-[0.25em] text-white shadow-redGlow transition-all hover:-translate-y-0.5 hover:shadow-redGlowLg disabled:cursor-not-allowed disabled:opacity-60"
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

function Check() {
  return (
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
  );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <dt className="w-28 shrink-0 text-white/60">{label}</dt>
      <dd className="min-w-0 text-white/90">{children}</dd>
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
          className="h-display px-6 py-3 text-xs uppercase tracking-[0.25em] text-white/60 transition-colors hover:text-white"
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
        <p className="mt-1.5 text-sm text-white/70">{sub}</p>
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
          className="h-display mb-2 block text-[11px] uppercase tracking-[0.3em] text-white/75"
        >
          {label}
          {optional && (
            <span className="ml-1 normal-case tracking-normal text-white/55">
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
  return `w-full rounded-sm border bg-white/[0.03] px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-white/40 focus:border-brand-red sm:text-sm ${
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
