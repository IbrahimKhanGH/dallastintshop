/* Turns the quote form's answers into what gets sent.

   Pure and dependency-free so tests/quote-message.test.ts can prove that
   every answer the customer gives reaches the shop — both in the payload
   /api/notify turns into a text, and in the fallback text the customer can
   send themselves if delivery fails. */

export type QuoteAnswers = {
  /** Selected services in display order, each with its follow-up answers */
  services: { label: string; answers: string[] }[];
  /** Only set when a service that needs it (tint) is selected */
  bodyStyle: string;
  notes: string;
  vehicle: string;
  name: string;
  phone: string;
  email: string;
  contactPref: string;
};

/** "Window Tint, PPF" */
export function serviceSummary(a: QuoteAnswers): string {
  return a.services.map((s) => s.label).join(", ");
}

/** "Window Tint: Windshield, Front two windows; PPF: Hood" */
export function detailsSummary(a: QuoteAnswers): string {
  return a.services
    .filter((s) => s.answers.length > 0)
    .map((s) => `${s.label}: ${s.answers.join(", ")}`)
    .join("; ");
}

/** Human-readable version — the prefilled fallback text and the log line. */
export function buildMessage(a: QuoteAnswers): string {
  const lines = [
    `New quote request from ${a.name}:`,
    `Vehicle: ${a.vehicle || "(not specified)"}`,
  ];
  if (a.bodyStyle) lines.push(`Body style: ${a.bodyStyle}`);
  lines.push(`Service: ${serviceSummary(a) || "(not specified)"}`);
  const details = detailsSummary(a);
  if (details) lines.push(`Details: ${details}`);
  if (a.notes.trim()) lines.push(`Notes: ${a.notes.trim()}`);
  lines.push(
    `Customer phone: ${a.phone}`,
    `Customer email: ${a.email.trim() || "(not provided)"}`,
    `Preferred contact: ${a.contactPref || "(not specified)"}`,
  );
  return lines.join("\n");
}

/** JSON body for POST /api/notify (field names match lib/sms.ts QuoteBody). */
export function buildPayload(
  a: QuoteAnswers,
  guard: { botcheck: string; elapsed_ms: number },
) {
  return {
    subject: `Quote Request — ${a.vehicle} (${a.name})`,
    from_name: a.name,
    name: a.name,
    phone: a.phone,
    email: a.email.trim() || "(not provided)",
    vehicle: a.vehicle,
    body_style: a.bodyStyle,
    service: serviceSummary(a) || "(not specified)",
    details: detailsSummary(a),
    notes: a.notes.trim(),
    preferred_contact: a.contactPref,
    message: buildMessage(a),
    botcheck: guard.botcheck,
    elapsed_ms: guard.elapsed_ms,
  };
}
