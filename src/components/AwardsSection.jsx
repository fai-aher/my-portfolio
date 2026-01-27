import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineTrophy,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlineBuildingOffice2,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { RiMedalLine } from "react-icons/ri";

import awardsData from "../data/awards.json";

/**
 * AwardsSection
 * - Responsive (mobile-first)
 * - Dark/light friendly using Tailwind `dark:` variants
 * - i18n-ready (EN/ES/JA/KO) using language persisted by Header
 * - Data-driven from `src/data/awards.json`
 */

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
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || Object.values(value)[0] || "";
}

// Medal colors based on award type
const MEDAL_COLORS = {
  competition: {
    bg: "bg-amber-500/20",
    border: "border-amber-400/30",
    icon: "text-amber-500 dark:text-amber-400",
    glow: "from-amber-400/0 via-amber-400/20 to-amber-400/0",
    badge: "bg-amber-600/40 text-white border-amber-500/50",
  },
  honor: {
    bg: "bg-blue-500/20",
    border: "border-blue-400/30",
    icon: "text-blue-500 dark:text-blue-400",
    glow: "from-blue-400/0 via-blue-400/20 to-blue-400/0",
    badge: "bg-blue-600/40 text-white border-blue-500/50",
  },
  scholarship: {
    bg: "bg-purple-500/20",
    border: "border-purple-400/30",
    icon: "text-purple-500 dark:text-purple-400",
    glow: "from-purple-400/0 via-purple-400/20 to-purple-400/0",
    badge: "bg-purple-600/40 text-white border-purple-500/50",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const cardStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function TypePill({ label, active, onClick, color }) {
  const baseClasses =
    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs sm:text-sm transition focus:outline-none focus:ring-2 focus:ring-cyan-400/50";

  const activeClasses = active
    ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-700 dark:text-cyan-200"
    : "border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-900 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/10";

  const dotColor = active
    ? "bg-cyan-500/80 dark:bg-cyan-300/80"
    : color || "bg-slate-400/60 dark:bg-slate-500/60";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${activeClasses}`}
      type="button"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {label}
    </button>
  );
}

function AwardCard({ award, lang, colors }) {
  const title = pickLang(award.title, lang);
  const description = pickLang(award.description, lang);
  const organization = pickLang(award.organization, lang);
  const location = pickLang(award.location, lang);
  const year = award.date ? String(award.date).slice(0, 4) : "";
  const typeLabel = pickLang(awardsData.ui.filters[award.type], lang);

  return (
    <motion.article
      variants={cardAnim}
      className="group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5"
    >
      {/* Card glow on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition"
      >
        <div className={`absolute -inset-24 bg-gradient-to-r ${colors.glow} blur-2xl`} />
      </div>

      {/* Featured Image */}
      {award.featuredImage && (
        <div className="relative overflow-hidden">
          <img
            src={award.featuredImage}
            alt={title}
            className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            draggable={false}
          />
          {/* Type badge overlay */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${colors.badge}`}
            >
              <RiMedalLine className="h-3.5 w-3.5" />
              {typeLabel}
            </span>
          </div>
          {/* Year badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
              <HiOutlineCalendarDays className="h-3.5 w-3.5" />
              {year}
            </span>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="relative p-5">
        {/* Header with medal icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-snug">
              {title}
            </h3>
          </div>
          <span
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${colors.border} ${colors.bg}`}
          >
            <RiMedalLine className={`h-5 w-5 ${colors.icon}`} />
          </span>
        </div>

        {/* Description */}
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300/85 leading-relaxed">
          {description}
        </p>

        {/* Meta information */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <HiOutlineBuildingOffice2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            {organization}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <HiOutlineMapPin className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            {location}
          </span>
        </div>

        {/* Action button */}
        {award.link && (
          <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5">
            <a
              href={award.link}
              target={award.link.startsWith("http") ? "_blank" : undefined}
              rel={award.link.startsWith("http") ? "noreferrer" : undefined}
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
            >
              {pickLang(awardsData.ui.view, lang)}
              <HiOutlineArrowTopRightOnSquare className="h-4 w-4 opacity-80" />
            </a>
          </div>
        )}
      </div>

      {/* Bottom gradient line */}
      <div className={`h-px bg-gradient-to-r ${colors.glow}`} />
    </motion.article>
  );
}

export default function AwardsSection() {
  const lang = useAppLanguage();
  const ui = awardsData.ui;

  const [filter, setFilter] = useState("all");
  const [startIndex, setStartIndex] = useState(0);

  // Build UI-friendly items from awards.json
  const items = useMemo(() => {
    return (awardsData.awards || []).map((a) => ({
      ...a,
      type: a.type || "honor",
    }));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((a) => a.type === filter);
  }, [filter, items]);

  useEffect(() => {
    setStartIndex(0);
  }, [filter]);

  // Filter dot colors
  const filterDotColors = {
    scholarship: "bg-purple-500/80 dark:bg-purple-400/80",
    competition: "bg-amber-500/80 dark:bg-amber-400/80",
    honor: "bg-blue-500/80 dark:bg-blue-400/80",
  };

  const visibleCount = 3;
  const maxStart = Math.max(0, filtered.length - visibleCount);
  const windowAwards = filtered.slice(startIndex, startIndex + visibleCount);
  const canPrev = startIndex > 0;
  const canNext = startIndex < maxStart;

  return (
    <div className="relative">
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-8 -top-10 -z-10 h-40 bg-gradient-to-r from-indigo-400/0 via-cyan-400/10 to-indigo-400/0 blur-2xl"
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeUp}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/70 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10">
                <HiOutlineTrophy className="h-6 w-6 text-cyan-500 dark:text-cyan-300" />
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {pickLang(ui.sectionTitle, lang)}
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-slate-700 dark:text-slate-300/85">
              {pickLang(ui.sectionDescription, lang)}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2">
            <RiMedalLine className="h-5 w-5 text-cyan-500 dark:text-cyan-300/90" />
            <span className="text-xs text-slate-700 dark:text-slate-200/80">
              {filtered.length} {pickLang(ui.itemsLabel, lang)}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          <TypePill
            label={pickLang(ui.filters.all, lang)}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <TypePill
            label={pickLang(ui.filters.scholarship, lang)}
            active={filter === "scholarship"}
            onClick={() => setFilter("scholarship")}
            color={filterDotColors.scholarship}
          />
          <TypePill
            label={pickLang(ui.filters.competition, lang)}
            active={filter === "competition"}
            onClick={() => setFilter("competition")}
            color={filterDotColors.competition}
          />
          <TypePill
            label={pickLang(ui.filters.honor, lang)}
            active={filter === "honor"}
            onClick={() => setFilter("honor")}
            color={filterDotColors.honor}
          />
        </div>

        {filtered.length > 0 && (
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-600 dark:text-slate-300/70">
              {startIndex + 1}–{Math.min(startIndex + visibleCount, filtered.length)} / {filtered.length}
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-2 py-1.5">
              <button
                type="button"
                onClick={() => setStartIndex((i) => Math.max(0, i - 1))}
                disabled={!canPrev}
                className={
                  "grid h-9 w-9 place-items-center rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-cyan-400/50 " +
                  (canPrev
                    ? "border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-white"
                    : "cursor-not-allowed border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 text-slate-400 dark:text-slate-500")
                }
                aria-label="Previous awards"
              >
                <HiOutlineChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => setStartIndex((i) => Math.min(maxStart, i + 1))}
                disabled={!canNext}
                className={
                  "grid h-9 w-9 place-items-center rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-cyan-400/50 " +
                  (canNext
                    ? "border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-white"
                    : "cursor-not-allowed border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 text-slate-400 dark:text-slate-500")
                }
                aria-label="Next awards"
              >
                <HiOutlineChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Grid */}
        <motion.div
          className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={cardStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          key={`${filter}-${startIndex}`}
        >
          {windowAwards.map((award) => (
            <AwardCard
              key={award.id}
              award={award}
              lang={lang}
              colors={MEDAL_COLORS[award.type] || MEDAL_COLORS.honor}
            />
          ))}
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="mt-6 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-8 text-center">
            <RiMedalLine className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              No awards found for this filter.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
