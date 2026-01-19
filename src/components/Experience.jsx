import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineBriefcase,
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineLink,
  HiOutlineXMark,
} from "react-icons/hi2";

import experienceData from "../data/experience.json";

/* ----------------------- helpers ----------------------- */

function useAppLanguage() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  useEffect(() => {
    const handler = (e) =>
      setLang(e?.detail?.lang || localStorage.getItem("lang") || "en");
    window.addEventListener("app:languageChanged", handler);
    return () => window.removeEventListener("app:languageChanged", handler);
  }, []);
  return lang;
}

function pickLang(value, lang) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || Object.values(value)[0] || "";
}

function formatPeriod(dates = {}) {
  const f = (v) => (v ? String(v).slice(0, 7) : "");
  return `${f(dates.start)} — ${dates.end ? f(dates.end) : "Present"}`;
}

function parseDateLike(v) {
  if (!v) return null;
  const s = String(v);
  // accept YYYY, YYYY-MM, YYYY-MM-DD
  const parts = s.split("-").map((x) => parseInt(x, 10));
  const y = parts[0];
  const m = parts[1] ? parts[1] - 1 : 0;
  const d = parts[2] || 1;
  if (!y || Number.isNaN(y)) return null;
  return new Date(Date.UTC(y, m, d));
}

function diffInDays(a, b) {
  const ms = Math.abs(b - a);
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function formatDuration(dates = {}) {
  const start = parseDateLike(dates.start);
  const end = dates.end ? parseDateLike(dates.end) : null;
  if (!start) return "";
  if (!end) {
    // ongoing -> compute until today
    const now = new Date();
    const days = diffInDays(start, now);
    // show months/years for ongoing
    const totalMonths = Math.max(1, Math.round(days / 30.437));
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    if (years >= 1) return months ? `${years}y ${months}mo` : `${years}y`;
    return `${totalMonths}mo`;
  }
  const days = diffInDays(start, end);
  // If same month or extremely short, show days
  if (days <= 2) return ""; // treat as one-day/very short -> no duration
  if (days < 31) return `${days} days`;
  const totalMonths = Math.max(1, Math.round(days / 30.437));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years >= 1) return months ? `${years}y ${months}mo` : `${years}y`;
  return `${totalMonths}mo`;
}

function getFlagCode(country) {
  if (!country) return "";
  const map = {
    Colombia: "co",
    Argentina: "ar",
    Brazil: "br",
    Panama: "pa",
    Mexico: "mx",
    "United States": "us",
    Canada: "ca",
    England: "gb",
    France: "fr",
    Spain: "es",
    Netherlands: "nl",
    Belgium: "be",
    "South Korea": "kr",
    Japan: "jp",
    "Hong Kong": "hk",
  };
  return map[country] || "";
}

/* ----------------------- Card ----------------------- */

function ExperienceCard({ item, onOpen }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 hover:bg-white/80 dark:hover:bg-white/10"
    >
      {/* Hover glow (matches project cards) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
        <div className="absolute -inset-24 bg-gradient-to-r from-cyan-400/0 via-cyan-400/18 to-indigo-400/0 blur-2xl" />
      </div>
      {/* Banner */}
      <div className="relative h-32 w-full overflow-hidden">
        {item.featuredImage ? (
          <img
            src={item.featuredImage}
            alt={item.title}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-cyan-400/15 via-white/5 to-indigo-400/15" />
        )}

        {/* Country flag */}
        {item.country && getFlagCode(item.country) && (
          <div className="absolute right-3 top-3 h-10 w-10 rounded-xl border-2 border-white/40 backdrop-blur overflow-hidden flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
            <span
              className={`fi fi-${getFlagCode(item.country)} fis`}
              title={item.country}
              style={{
                fontSize: '1.75rem',
                transform: 'scale(1.1)',
                display: 'block',
                lineHeight: 1
              }}
            ></span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-cyan-700 dark:text-cyan-200/70">
          {item.typeLabel || item.type}
        </p>

        <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white line-clamp-2">
          {item.title}
        </h3>

        <div className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-300/85">
          {item.organization && (
            <div className="flex items-center gap-2">
              <HiOutlineBriefcase className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              {item.organization}
            </div>
          )}
          <div className="flex items-center gap-2">
            <HiOutlineMapPin className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
            {[item.location, item.country].filter(Boolean).join(" • ")}
          </div>
          <div className="flex items-center gap-2">
            <HiOutlineCalendarDays className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
            {formatPeriod(item.dates)}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-600 dark:text-slate-300/70">
            Click for details
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/15 px-3 py-2 text-sm font-semibold text-cyan-700 dark:text-cyan-200 ring-1 ring-cyan-300/30">
            Show details
            <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

/* ----------------------- Modal ----------------------- */

function ExperienceModal({ item, onClose }) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[90]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 20 }}
            className="absolute left-1/2 top-1/2 w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-black/10 dark:border-white/10 px-5 py-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest text-cyan-700 dark:text-cyan-200/70">
                  {item.typeLabel || item.type}
                </p>
                <p className="mt-0.5 text-lg sm:text-xl font-semibold text-slate-900 dark:text-white break-words leading-snug pr-4">
                  {item.title}{item.organization ? ` • ${item.organization}` : ""}
                </p>
              </div>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/15 px-3 py-2 text-sm font-semibold text-cyan-800 dark:text-cyan-200 ring-1 ring-cyan-300/30 hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <HiOutlineXMark className="h-5 w-5" />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>

            {/* Body */}
            <div className="grid gap-4 p-5 md:grid-cols-[1fr_0.9fr]">
              {/* Mobile image */}
              <div className="md:hidden overflow-hidden rounded-xl">
                {item.featuredImage && (
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="h-44 w-full object-cover"
                  />
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                {/* Meta (vertical neon list) */}
                <div className="space-y-2 text-sm font-semibold text-cyan-700 dark:text-cyan-200">
                  {(item.location || item.country) && (
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true">📍</span>
                      <span>{[item.location, item.country].filter(Boolean).join(" • ")}</span>
                    </div>
                  )}
                  {item.dates && (
                    <div className="flex items-center gap-2">
                      <HiOutlineCalendarDays className="h-4 w-4" />
                      <span>{formatPeriod(item.dates)}</span>
                    </div>
                  )}
                  {item.dates && formatDuration(item.dates) && (
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true">⏱️</span>
                      <span>{formatDuration(item.dates)}</span>
                    </div>
                  )}
                </div>

                {/* Summary */}
                {item.summary ? (
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300/85">
                    {item.summary}
                  </p>
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-300/70">
                    No description available yet.
                  </p>
                )}

                {/* Bullets */}
                {item.bullets?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Highlights</p>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300/85">
                      {item.bullets.slice(0, 10).map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-500" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies */}
                {item.technologies?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Technologies</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.technologies.slice(0, 14).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-950/20 px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100/90"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop image */}
              <div className="hidden md:block overflow-hidden rounded-xl">
                {item.featuredImage && (
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ----------------------- Section ----------------------- */

export default function Experience() {
  const lang = useAppLanguage();
  const [page, setPage] = useState(1);
  const [active, setActive] = useState(null);

  const items = useMemo(
    () =>
      (Array.isArray(experienceData) ? experienceData : experienceData?.items || []).map((e) => ({
        ...e,
        typeLabel: pickLang(e.typeLabel || e.type, lang),
        title: pickLang(e.title, lang) || e.title,
        summary: pickLang(e.summary || e.description, lang),
        // bullets may be array of strings or i18n objects
        bullets: Array.isArray(e.bullets)
          ? e.bullets.map((b) => (typeof b === "string" ? b : pickLang(b, lang))).filter(Boolean)
          : [],
        technologies: Array.isArray(e.technologies) ? e.technologies : [],
        links: Array.isArray(e.links)
          ? e.links
              .map((l) => ({
                label: typeof l?.label === "string" ? l.label : pickLang(l?.label, lang) || "Link",
                url: l?.url,
              }))
              .filter((l) => l.url)
          : [],
      })),
    [lang]
  );

  const pageSize = 6;
  const totalPages = Math.ceil(items.length / pageSize);
  const pageItems = items.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section id="experience" className="relative">
      <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white">
        Experience
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((item) => (
          <ExperienceCard
            key={item.id}
            item={item}
            onOpen={() => setActive(item)}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-slate-600 dark:text-slate-300/70">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-xl border px-4 py-2 text-sm disabled:opacity-40"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-xl border px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <ExperienceModal item={active} onClose={() => setActive(null)} />
    </section>
  );
}