"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { BUSINESS } from "@/lib/data";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Why Us", href: "#why" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/80 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="h-display text-sm uppercase tracking-widest text-white/80 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={BUSINESS.phoneHref}
            className="h-display text-sm uppercase tracking-widest text-white/80 transition-colors hover:text-white"
          >
            {BUSINESS.phone}
          </a>
          <a
            href="#contact"
            className="h-display group relative inline-flex items-center gap-2 overflow-hidden rounded-sm bg-red-grad px-5 py-2.5 text-sm uppercase tracking-widest text-white shadow-redGlow transition-all hover:-translate-y-0.5 hover:shadow-redGlowLg"
          >
            <span>Get a Quote</span>
            <span className="absolute inset-y-0 right-0 w-10 -skew-x-12 bg-white/15 opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="grid h-10 w-10 place-items-center rounded-sm border border-white/10 bg-white/[0.04] lg:hidden"
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 top-0 h-[2px] w-full bg-white transition-transform ${
                open ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-[2px] w-full bg-brand-red transition-transform ${
                open ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-white/5 bg-black/95 backdrop-blur-xl transition-[max-height] duration-300 lg:hidden ${
          open ? "max-h-[80vh]" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="h-display border-b border-white/5 py-4 text-xl uppercase tracking-widest text-white/90"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <a
              href={BUSINESS.phoneHref}
              className="h-display rounded-sm border border-white/15 bg-white/[0.04] py-3 text-center text-sm uppercase tracking-widest text-white"
            >
              Call {BUSINESS.phone}
            </a>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="h-display rounded-sm bg-red-grad py-3 text-center text-sm uppercase tracking-widest text-white shadow-redGlow"
            >
              Get a Quote
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
