"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CONTACT_OPTS, type ContactPref } from "@/lib/quote-config";

/* How the customer wants to hear back. Drives two things beyond the lead
   itself: whether email is required on this step, and which promise the
   confirmation screen makes. */

type Props = {
  value: ContactPref | "";
  onChange: (value: ContactPref) => void;
  invalid?: boolean;
  describedBy?: string;
};

export default function ContactSelect({
  value,
  onChange,
  invalid,
  describedBy,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const selected = CONTACT_OPTS.find((o) => o.value === value);

  function commit(pref: ContactPref) {
    onChange(pref);
    setOpen(false);
    setActiveIdx(-1);
    triggerRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveIdx((i) => Math.min(i + 1, CONTACT_OPTS.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i < 0 ? CONTACT_OPTS.length - 1 : Math.max(i - 1, 0)));
    } else if ((e.key === "Enter" || e.key === " ") && open && activeIdx >= 0) {
      e.preventDefault();
      commit(CONTACT_OPTS[activeIdx].value);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={`flex w-full items-center justify-between rounded-sm border bg-white/[0.03] px-4 py-3 text-left text-base outline-none transition-colors focus:border-brand-red sm:text-sm ${
          invalid ? "border-brand-red" : "border-white/10"
        } ${selected ? "text-white" : "text-white/30"}`}
      >
        {selected ? selected.label : "Choose one…"}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className={`shrink-0 text-white/40 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Preferred contact method"
          className="absolute z-30 mt-1 w-full overflow-hidden rounded-sm border border-white/15 bg-[#0b0b0b] py-1 shadow-xl shadow-black/60"
        >
          {CONTACT_OPTS.map((opt, i) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onMouseDown={(e) => {
                e.preventDefault();
                commit(opt.value);
              }}
              onMouseEnter={() => setActiveIdx(i)}
              className={`flex min-h-11 cursor-pointer items-center px-4 py-2.5 text-base transition-colors sm:min-h-0 sm:text-sm ${
                i === activeIdx
                  ? "bg-brand-red/20 text-white"
                  : "text-white/80 hover:bg-white/5"
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
