/* ============================================================
   Quote form configuration.

   Everything shop-specific lives here. Reusing this engine for
   another shop means editing this file and the BUSINESS block in
   lib/data.ts — the step machine, validation, delivery, and abuse
   guards are all industry-agnostic and need no changes.
   ============================================================ */

import type { ReactNode } from "react";

/* ---------- shop constants ---------- */

// Where the fallback "text us directly" link points when the automated
// text fails. Digits only. Matches BUSINESS.phone / their Google listing.
export const SHOP_SMS = "4696552884";

/* This shop is SMS-only: quotes reach them through /api/notify (Textbelt)
   and nowhere else. There is deliberately no email channel and no shop
   inbox constant — see the note at the top of components/quote/QuoteForm.tsx
   for what that costs and how the Web3Forms archive worked if it's wanted
   back. Reselling this engine to a shop that wants email? Restore
   app/api/email/route.ts from git history. */

/* ---------- vehicle makes ---------- */

// Filters as the customer types, so "toy" → Toyota is two taps on a phone
// instead of six characters. Free text is still accepted for anything
// not on the list.
export const MAKES = [
  "Acura",
  "Alfa Romeo",
  "Audi",
  "BMW",
  "Buick",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Dodge",
  "Ford",
  "Genesis",
  "GMC",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Kia",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Lucid",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Porsche",
  "Ram",
  "Rivian",
  "Subaru",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

/* ---------- body style ---------- */

/* Tint pricing keys off how many windows a car has far more than the exact
   model, so this is the single most useful pricing input on the form —
   worth its own step. */
export type BodyStyle = {
  value: string;
  hint: string;
  icon: ReactNode;
};

export const BODY_STYLES: BodyStyle[] = [
  {
    value: "Sedan",
    hint: "4 doors",
    icon: (
      <>
        <path d="M3 13l2-5a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 8l2 5v4h-3M6 17H3v-4" />
        <path d="M8 13V6.6M15 13V6.6" />
        <circle cx="7.5" cy="17" r="2" />
        <circle cx="16.5" cy="17" r="2" />
      </>
    ),
  },
  {
    value: "Coupe",
    hint: "2 doors",
    icon: (
      <>
        <path d="M3 13l3-5.2A2 2 0 0 1 7.8 6.8h7.4A2 2 0 0 1 17 8l4 5v4h-3M6 17H3v-4" />
        <path d="M11 13V7" />
        <circle cx="7.5" cy="17" r="2" />
        <circle cx="16.5" cy="17" r="2" />
      </>
    ),
  },
  {
    value: "SUV",
    hint: "Incl. wagons",
    icon: (
      <>
        <path d="M3 14V9a2 2 0 0 1 2-2h12.5L21 11v5h-2.5M6.5 16H3" />
        <path d="M9 7v5M15 7v5M3 12h18" />
        <circle cx="7.5" cy="16" r="2" />
        <circle cx="16.5" cy="16" r="2" />
      </>
    ),
  },
  {
    value: "Truck",
    hint: "Pickup",
    icon: (
      <>
        <path d="M2 15V8h9l2.5 4H22v3h-2M6 15H2" />
        <path d="M7 8v4M11 8v4" />
        <circle cx="7.5" cy="16" r="2" />
        <circle cx="17.5" cy="16" r="2" />
      </>
    ),
  },
  {
    value: "Van",
    hint: "Minivan / cargo",
    icon: (
      <>
        <path d="M2 15V8a1 1 0 0 1 1-1h13l5 5v3h-2M6 15H2" />
        <path d="M8 7v5M13 7v5M2 12h19" />
        <circle cx="7.5" cy="16" r="2" />
        <circle cx="17.5" cy="16" r="2" />
      </>
    ),
  },
  {
    value: "Other",
    hint: "Tell us below",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7M12 17h.01" />
      </>
    ),
  },
];

/* ---------- service chips ---------- */

/* Tapping beats typing on a phone. Multi-select, and the step passes if the
   customer taps anything OR types anything — nobody gets blocked because
   they couldn't name what they want.

   Tint options come first because they're the volume business; the rest of
   the shop's services follow so a PPF or wrap lead has somewhere to land.
   Detailing is intentionally absent — the shop does not offer it. */
export type ServiceChip = {
  label: string;
  icon: ReactNode;
};

export const SERVICE_CHIPS: ServiceChip[] = [
  {
    label: "Full Car Tint",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M12 5v14M3 12h18" />
      </>
    ),
  },
  {
    label: "Front Two",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M12 5v14" />
        <path d="M3.5 7.5h7v9h-7z" />
      </>
    ),
  },
  {
    label: "Windshield Strip",
    icon: (
      <>
        <path d="M3 16l2.5-8A2 2 0 0 1 7.4 6.5h9.2A2 2 0 0 1 18.5 8L21 16z" />
        <path d="M3.8 9.5h16.4" />
      </>
    ),
  },
  {
    label: "Tint Removal",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M8.5 9.5l7 5M15.5 9.5l-7 5" />
      </>
    ),
  },
  {
    label: "PPF",
    icon: (
      <>
        <path d="M12 2.5l7.5 3v6c0 4.4-3.1 8.4-7.5 10-4.4-1.6-7.5-5.6-7.5-10v-6z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    label: "Vinyl Wrap",
    icon: (
      <>
        <path d="M4 7c4-2.5 12-2.5 16 0v10c-4 2.5-12 2.5-16 0z" />
        <path d="M4 12c4-2.5 12-2.5 16 0" />
      </>
    ),
  },
  {
    label: "Ceramic Coating",
    icon: (
      <>
        <path d="M12 3s6 6.4 6 10.2a6 6 0 0 1-12 0C6 9.4 12 3 12 3z" />
        <path d="M9.5 13.5a2.5 2.5 0 0 0 2.5 2.5" />
      </>
    ),
  },
  {
    label: "Paint Correction",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4a8 8 0 0 1 0 16" />
        <path d="M9 9.5c1.5-1.5 4.5-1.5 6 0" />
      </>
    ),
  },
  {
    label: "Powder Coating",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
      </>
    ),
  },
  {
    label: "Other",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7M12 17h.01" />
      </>
    ),
  },
];

/* ---------- contact preference ---------- */

/* Email stays optional unless the customer picks "Email me" — one less
   required field is one less reason to abandon on the last step. */
export const CONTACT_OPTS = [
  { value: "Text me", label: "Text me back" },
  { value: "Call me", label: "Call me back" },
  { value: "Email me", label: "Email me back" },
] as const;

export type ContactPref = (typeof CONTACT_OPTS)[number]["value"];

/* Confirmation copy is chosen by what they picked, so the promise on screen
   matches the channel they'll actually hear back on. */
export const CONFIRM_MSGS: Record<ContactPref, string> = {
  "Text me":
    "We'll text you back with your estimate — usually within a few hours during business hours.",
  "Call me":
    "We'll give you a call back with your estimate — usually within a few hours during business hours.",
  "Email me":
    "We'll email you back with your estimate — usually within a few hours during business hours.",
};

/* ---------- steps ---------- */

export const STEPS = ["Vehicle", "Style", "Service", "Contact"] as const;
export const TOTAL_STEPS = STEPS.length; // interactive steps before confirmation
