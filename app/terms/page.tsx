import type { Metadata } from "next";
import { LegalPage, CONTACT_LINE } from "@/lib/legal";
import { BUSINESS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms of Use — Dallas Tint Shop",
  description: "Terms covering use of the Dallas Tint Shop website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="August 2026">
      <p>
        These terms cover your use of this website. They don&apos;t cover the
        work we do on your vehicle — that&apos;s set out in the invoice and
        warranty paperwork you get at the shop.
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
        The reviews shown are quoted from our Google Business Profile, in the
        reviewer&apos;s own words. We don&apos;t edit them for content and we
        don&apos;t post reviews we didn&apos;t receive.
      </p>

      <h2>Warranties</h2>
      <p>
        Warranty terms are set by the film and coating manufacturers and are
        provided in writing when work is completed. Nothing on this website
        extends, replaces or overrides that paperwork.
      </p>

      <h2>Availability</h2>
      <p>
        We aim to keep the site accurate and online, but we don&apos;t guarantee
        either. Hours, pricing and services can change — call ahead if it
        matters.
      </p>

      <h2>Contact</h2>
      <p>{CONTACT_LINE}</p>
      <p className="text-white/45">
        {BUSINESS.name}, {BUSINESS.address}
      </p>
    </LegalPage>
  );
}
