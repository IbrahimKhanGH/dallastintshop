import { LegalPage, CONTACT_LINE } from "@/lib/legal";
import { BUSINESS, WARRANTY } from "@/lib/business";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: "Terms covering use of the Dallas Tint Shop website.",
  path: "/terms",
});

/* ⚠️ REVIEW BEFORE RELEASE: the "Warranties" section and the intro were
   changed in September 2026 to match the client's "Lifetime Warranty*"
   wording. The previous text said warranty terms were "set by the film and
   coating manufacturers" — an unconfirmed claim, removed. The new text
   only repeats the approved footnote. Have the owner (or their counsel)
   review both sections. */

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="September 2026">
      <p>
        These terms cover your use of this website. They don&apos;t cover the
        work we do on your vehicle — the terms for that are the ones the shop
        gives you for your job.
      </p>

      <h2>Quotes are estimates</h2>
      <p>
        Anything you receive through the quote form is an estimate based on what
        you told us. Final pricing depends on the vehicle in person: condition,
        glass, existing film or wrap, and the coverage you choose. We&apos;ll
        confirm the price with you before any work starts.
      </p>

      <h2>Photos on this site</h2>
      <p>
        Every photo and video here is our own work, shot at our shop in
        Richardson. They show completed jobs on customer vehicles and are not a
        guarantee of an identical result on yours — materials, colours and
        finishes vary by vehicle.
      </p>

      <h2>Reviews</h2>
      <p>
        Reviews on this site come from our Google Business Profile, in the
        reviewer&apos;s own words — either loaded from Google directly or quoted
        from it word for word. We don&apos;t edit them and we don&apos;t post
        reviews we didn&apos;t receive.
      </p>

      <h2>Warranties</h2>
      <p>
        Our work is backed by our {WARRANTY.label}. {WARRANTY.note} Nothing on
        this website adds to or changes the warranty terms the shop gives you
        for your job.
      </p>

      <h2>Availability</h2>
      <p>
        We aim to keep the site accurate and online, but we don&apos;t guarantee
        either. Hours, pricing and services can change — call ahead if it
        matters.
      </p>

      <h2>Contact</h2>
      <p>{CONTACT_LINE}</p>
      <p className="text-white/60">
        {BUSINESS.name}, {BUSINESS.addressLine}
      </p>
    </LegalPage>
  );
}
