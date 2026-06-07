"use client";

import { useState, useRef, useEffect } from "react";
import { FiGlobe, FiCheck, FiChevronDown } from "react-icons/fi";
import { useApp } from "@/context/AppContext";

/**
 * Language dropdown – extensible for future languages.
 * Add a new entry to the LANGUAGES array to support more locales.
 *
 * Props:
 *   compact – boolean (default false) → shows only globe icon + chevron (for tight navbars)
 */

export const LANGUAGES = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi",   native: "हिन्दी",  flag: "🇮🇳" },
  // ── Add future languages here, e.g.:
  // { code: "mr", label: "Marathi", native: "मराठी", flag: "🇮🇳" },
];

export default function LanguageDropdown({ compact = false }) {
  const { language, setLanguage } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleSelect = (code) => {
    setLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          btn-base flex items-center gap-1.5 rounded-xl border border-border-main
          bg-bg-card text-text-main shadow-sm cursor-pointer
          ${compact ? "h-9 px-2.5" : "h-10 px-3"}
        `}
      >
        <FiGlobe className="h-4 w-4 text-text-muted flex-shrink-0" />
        {!compact && (
          <span className="text-xs font-semibold leading-none">
            {current.native}
          </span>
        )}
        <FiChevronDown
          className={`h-3.5 w-3.5 text-text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          className="
            lang-dropdown absolute right-0 top-full mt-2 z-50
            min-w-[160px] rounded-2xl border border-border-main
            bg-bg-card shadow-xl shadow-black/15
            overflow-hidden
          "
        >
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-border-main">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Select Language
            </span>
          </div>

          {/* Options */}
          <ul className="py-1.5">
            {LANGUAGES.map((lang) => {
              const isActive = lang.code === language;
              return (
                <li key={lang.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(lang.code)}
                    className={`
                      lang-option w-full flex items-center gap-3 px-4 py-2.5
                      text-sm font-medium transition-all duration-150 cursor-pointer
                      ${
                        isActive
                          ? "text-indigo-500 bg-indigo-500/8"
                          : "text-text-main hover:bg-bg-main"
                      }
                    `}
                  >
                    <span className="text-base leading-none select-none">
                      {lang.flag}
                    </span>
                    <div className="flex flex-col items-start">
                      <span className="leading-none">{lang.native}</span>
                      <span className="text-[10px] text-text-muted leading-none mt-0.5">
                        {lang.label}
                      </span>
                    </div>
                    {isActive && (
                      <FiCheck className="ml-auto h-3.5 w-3.5 text-indigo-500 flex-shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
