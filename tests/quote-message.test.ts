/* Proves every answer the quote form collects reaches the shop's text,
   and that older payloads (notes inside `service`) still work. No network:
   these are pure functions — nothing is sent to Textbelt. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { QUOTE_SERVICES } from "../lib/quote-config";
import { buildMessage, buildPayload, type QuoteAnswers } from "../lib/quote-message";
import { MAX_SMS_CHARS, buildSms, clean, quoteValidationError } from "../lib/sms";

const guard = { botcheck: "", elapsed_ms: 60_000 };

function answers(over: Partial<QuoteAnswers> = {}): QuoteAnswers {
  return {
    services: [{ label: "Window Tint", answers: ["Windshield"] }],
    bodyStyle: "Sedan",
    notes: "",
    vehicle: "2021 Toyota Camry",
    name: "Test Customer",
    phone: "(214) 555-0100",
    email: "",
    contactPref: "Text me",
    ...over,
  };
}

// SMS output is ASCII-normalised; compare against the same normalisation.
const inSms = (sms: string, s: string) => sms.includes(clean(s));

test("worst case: every service, every follow-up option and a full notes box all fit", () => {
  const worst = answers({
    services: QUOTE_SERVICES.map((s) => ({ label: s.label, answers: s.followUp?.options ?? [] })),
    bodyStyle: "Other",
    notes: "N".repeat(300),
    vehicle: "2026 Other Aston Martin Valkyrie AMR Pro Special Edition",
    name: "Maximilian Alexander Longname-Customer",
    phone: "(214) 555-0100",
    email: "maximilian.alexander@example-domain.com",
    contactPref: "Email me",
  });
  const sms = buildSms(buildPayload(worst, guard));

  assert.ok(sms.length <= MAX_SMS_CHARS, `sms is ${sms.length} chars`);
  assert.ok(!sms.endsWith("..."), "message was truncated");
  for (const s of QUOTE_SERVICES) {
    assert.ok(inSms(sms, s.label), `missing service ${s.label}`);
    for (const o of s.followUp?.options ?? []) assert.ok(inSms(sms, o), `missing "${o}" for ${s.label}`);
  }
  assert.ok(sms.includes("N".repeat(300)), "notes not carried whole");
  assert.ok(sms.includes("(Other)"), "body style missing");
  assert.ok(sms.includes("Prefers: Email me"));
  assert.ok(sms.includes("maximilian dot alexander at example-domain dot com"), "email missing");
});

test("typical tint lead is short and complete", () => {
  const sms = buildSms(buildPayload(answers({ notes: "20% please" }), guard));
  assert.equal(
    sms,
    "Dallas Tint Shop - new quote | Test Customer | (214) 555-0100 | Prefers: Text me | " +
      "2021 Toyota Camry (Sedan) | Window Tint | Window Tint: Windshield | Notes: 20% please",
  );
  assert.ok(sms.length <= 160 * 2);
});

test("non-tint lead carries no body style", () => {
  const p = buildPayload(
    answers({ services: [{ label: "Chrome Delete", answers: ["Grille"] }], bodyStyle: "" }),
    guard,
  );
  assert.equal(p.body_style, "");
  assert.ok(buildSms(p).includes("Chrome Delete: Grille"));
  assert.ok(!buildSms(p).includes("(Sedan)"));
});

test("fallback text the customer can send contains every answer", () => {
  const a = answers({
    services: [
      { label: "PPF", answers: ["Hood", "Mirrors"] },
      { label: "Powder Coating", answers: [] },
    ],
    bodyStyle: "",
    notes: "Wheels in gloss black",
    email: "me@example.com",
  });
  const msg = buildMessage(a);
  for (const s of ["PPF, Powder Coating", "PPF: Hood, Mirrors", "Wheels in gloss black", "me@example.com", "Text me"]) {
    assert.ok(msg.includes(s), `missing ${s}`);
  }
});

test("legacy payload (notes inside service, no details) still produces a full text", () => {
  const sms = buildSms({
    name: "Old Client",
    phone: "2145550100",
    vehicle: "2020 Ford F-150",
    body_style: "Truck",
    service: "Full Car Tint, PPF — want it by Friday",
    preferred_contact: "Call me",
  });
  assert.ok(sms.includes("2020 Ford F-150 (Truck)"));
  assert.ok(sms.includes("Full Car Tint, PPF - want it by Friday"));
  assert.ok(sms.includes("Prefers: Call me"));
});

test("server rejects quotes missing name, phone, service, or email-when-preferred", () => {
  const base = {
    name: "Test Customer",
    phone: "(214) 555-0100",
    service: "Window Tint",
    preferred_contact: "Text me",
  };
  assert.equal(quoteValidationError(base), null);
  assert.equal(quoteValidationError({ ...base, name: "A" }), "missing-name");
  assert.equal(quoteValidationError({ ...base, phone: "555" }), "missing-phone");
  assert.equal(quoteValidationError({ ...base, service: "" }), "missing-service");
  assert.equal(quoteValidationError({ ...base, service: "(not specified)" }), "missing-service");
  assert.equal(
    quoteValidationError({ ...base, preferred_contact: "Email me", email: "not-an-email" }),
    "missing-email",
  );
  assert.equal(
    quoteValidationError({ ...base, preferred_contact: "Email me", email: "me@example.com" }),
    null,
  );
});
