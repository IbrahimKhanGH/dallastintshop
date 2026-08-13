import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BUSINESS } from "@/lib/data";

/* Shared shell for the two legal pages. Deliberately plain: these exist to
   be accurate and findable, not to be designed. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen bg-brand-black">
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6 sm:pt-36 lg:px-8">
        <h1 className="h-display text-4xl uppercase text-white sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-white/45">Last updated {updated}</p>
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-white/70 [&_a]:text-white [&_a]:underline [&_a]:decoration-brand-red [&_a]:underline-offset-4 [&_h2]:h-display [&_h2]:pt-4 [&_h2]:text-lg [&_h2]:uppercase [&_h2]:text-white">
          {children}
        </div>
        <Link
          href="/"
          className="h-display mt-12 inline-block text-xs uppercase tracking-[0.25em] text-white/45 transition-colors hover:text-white"
        >
          ← Back to home
        </Link>
      </section>
      <Footer />
    </main>
  );
}

export const CONTACT_LINE = (
  <>
    Questions? Call{" "}
    <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a> or visit us at {BUSINESS.address}.
  </>
);
