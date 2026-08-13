"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MAKES } from "@/lib/quote-config";

/* Filter-as-you-type make picker.

   On a phone, typing "toy" and tapping Toyota beats thumbing out the whole
   word — and the shop gets "Toyota" instead of "toyta". Free text is still
   accepted: the list narrows but never blocks, so an uncommon make can
   always be typed in full.

   Matches on prefix rather than substring, which is what makes a two- or
   three-character prefix land on the right make instead of burying it. */

type Props = {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
};

export default function MakeCombobox({
  value,
  onChange,
  invalid,
  describedBy,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const query = value.trim().toLowerCase();
  const matches = query
    ? MAKES.filter((m) => m.toLowerCase().startsWith(query))
    : MAKES;

  // Close when focus or a click lands outside the widget.
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  // A stale highlight pointing past the end of a freshly filtered list would
  // commit the wrong make on Enter.
  useEffect(() => {
    setActiveIdx(-1);
  }, [value]);

  function commit(make: string) {
    onChange(make);
    setOpen(false);
    setActiveIdx(-1);
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveIdx((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i < 0 ? matches.length - 1 : Math.max(i - 1, 0)));
    } else if (e.key === "Enter") {
      // Only intercept Enter when a suggestion is actually highlighted —
      // otherwise it belongs to the form's own "next step" handling.
      if (open && activeIdx >= 0 && matches[activeIdx]) {
        e.preventDefault();
        commit(matches[activeIdx]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        ref={inputRef}
        id="make"
        name="make"
        type="text"
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          activeIdx >= 0 ? `${listId}-opt-${activeIdx}` : undefined
        }
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        placeholder="Start typing…"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className={`w-full rounded-sm border bg-white/[0.03] px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-red sm:text-sm ${
          invalid ? "border-brand-red" : "border-white/10"
        }`}
      />

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Vehicle makes"
          className="no-scrollbar absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-sm border border-white/15 bg-[#0b0b0b] py-1 shadow-xl shadow-black/60"
        >
          {matches.length === 0 ? (
            <li className="px-4 py-2.5 text-sm text-white/40">
              No matches — type your make
            </li>
          ) : (
            matches.map((make, i) => (
              <li
                key={make}
                id={`${listId}-opt-${i}`}
                role="option"
                aria-selected={i === activeIdx}
                // mousedown fires before the input's blur, so the click isn't
                // lost to the list closing out from under it.
                onMouseDown={(e) => {
                  e.preventDefault();
                  commit(make);
                }}
                onMouseEnter={() => setActiveIdx(i)}
                className={`cursor-pointer px-4 py-2.5 text-sm transition-colors ${
                  i === activeIdx
                    ? "bg-brand-red/20 text-white"
                    : "text-white/80 hover:bg-white/5"
                }`}
              >
                {make}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
