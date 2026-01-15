// Local i18n for modal section titles
const MODAL_I18N = {
  highlights: {
    en: "Highlights",
    es: "Aspectos destacados",
    ja: "ハイライト",
    ko: "주요 내용",
  },
  technologies: {
    en: "Technologies",
    es: "Tecnologías",
    ja: "使用技術",
    ko: "사용 기술",
  },
  noDescription: {
    en: "No description available yet.",
    es: "Aún no hay una descripción disponible.",
    ja: "まだ説明がありません。",
    ko: "아직 설명이 없습니다.",
  },
  timelineIntro: {
    en: "The timeline starts from the present year. To view past years, please scroll the timeline to the left.",
    es: "La línea de tiempo inicia desde el año presente. Para ver años pasados, por favor mueve la línea de tiempo hacia la izquierda.",
    ja: "タイムラインは現在の年から始まります。過去の年を表示するには、タイムラインを左にスクロールしてください。",
    ko: "타임라인은 현재 연도에서 시작됩니다. 과거 연도를 보려면 타임라인을 왼쪽으로 스크롤하세요.",
  },
};
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
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

function parseYM(v) {
  // accept YYYY, YYYY-MM, YYYY-MM-DD
  if (!v) return null;
  const s = String(v);
  const parts = s.split("-").map((x) => parseInt(x, 10));
  const y = parts[0];
  const m = parts[1] ? parts[1] : 1; // 1..12
  if (!y || Number.isNaN(y)) return null;
  return { y, m };
}

function ymToIndex(ym) {
  // month index from year 0 (stable ordering)
  return ym.y * 12 + (ym.m - 1);
}

function indexToYM(idx) {
  const y = Math.floor(idx / 12);
  const m = (idx % 12) + 1;
  return { y, m };
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function ymToLabel({ y, m }, lang = "en") {
  const monthNames = {
    en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    es: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
    ja: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
    ko: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
  };
  const arr = monthNames[lang] || monthNames.en;
  return lang === "ja" || lang === "ko" ? `${y} ${arr[m - 1]}` : `${arr[m - 1]} ${y}`;
}

function formatFullDate(value, lang = "en") {
  const d = parseDateLike(value);
  if (!d) return "";
  try {
    return new Intl.DateTimeFormat(lang, {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(d);
  } catch {
    // fallback
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    return `${dd}-${mm}-${d.getUTCFullYear()}`;
  }
}

function formatMonthName(value, lang = "en") {
  const d = parseDateLike(value);
  if (!d) return "";
  try {
    return new Intl.DateTimeFormat(lang, { month: "long", timeZone: "UTC" }).format(d);
  } catch {
    // fallback to numeric month
    return String(d.getUTCMonth() + 1);
  }
}

function formatPeriod(dates = {}) {
  const f = (v) => (v ? String(v).slice(0, 7) : "");
  return `${f(dates.start)} — ${dates.end ? f(dates.end) : "Present"}`;
}

function diffInDays(a, b) {
  const ms = Math.abs(b - a);
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function parseDateLike(v) {
  if (!v) return null;
  const s = String(v);
  const parts = s.split("-").map((x) => parseInt(x, 10));
  const y = parts[0];
  const m = parts[1] ? parts[1] - 1 : 0;
  const d = parts[2] || 1;
  if (!y || Number.isNaN(y)) return null;
  return new Date(Date.UTC(y, m, d));
}

function formatDuration(dates = {}, lang = "en") {
  const start = parseDateLike(dates.start);
  const end = dates.end ? parseDateLike(dates.end) : null;
  const units = {
    en: { day: "day", days: "days", mo: "mo", y: "y" },
    es: { day: "día", days: "días", mo: "meses", y: "años" },
    ja: { day: "日", days: "日", mo: "ヶ月", y: "年" },
    ko: { day: "일", days: "일", mo: "개월", y: "년" },
  };
  const u = units[lang] || units.en;
  if (!start) return "";
  if (!end) {
    const now = new Date();
    const days = diffInDays(start, now);
    const totalMonths = Math.max(1, Math.round(days / 30.437));
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    if (years >= 1) return months ? `${years}${u.y} ${months}${u.mo}` : `${years}${u.y}`;
    return `${totalMonths}${u.mo}`;
  }
  const days = diffInDays(start, end);
  if (days <= 2) return ""; // treat as one-day/very short -> no duration
  if (days < 31) return `${days} ${days === 1 ? u.day : u.days}`;
  const totalMonths = Math.max(1, Math.round(days / 30.437));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years >= 1) return months ? `${years}${u.y} ${months}${u.mo}` : `${years}${u.y}`;
  return `${totalMonths}${u.mo}`;
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, [query]);
  return matches;
}

function countryToFlagEmoji(country) {
  if (!country) return "";
  const c = String(country).trim().toLowerCase();

  // Common aliases used in resumes
  const map = {
    "united states": "🇺🇸",
    "usa": "🇺🇸",
    "u.s.a.": "🇺🇸",
    "us": "🇺🇸",
    "colombia": "🇨🇴",
    "japan": "🇯🇵",
    "korea": "🇰🇷",
    "south korea": "🇰🇷",
    "republic of korea": "🇰🇷",
    "france": "🇫🇷",
    "spain": "🇪🇸",
    "germany": "🇩🇪",
    "canada": "🇨🇦",
    "united kingdom": "🇬🇧",
    "uk": "🇬🇧",
    "england": "🇬🇧",
    "china": "🇨🇳",
    "singapore": "🇸🇬",
    "mexico": "🇲🇽",
    "brazil": "🇧🇷",
    "argentina": "🇦🇷",
    "chile": "🇨🇱",
    "peru": "🇵🇪",
    "netherlands": "🇳🇱",
  };

  if (map[c]) return map[c];

  // If already an emoji flag, return as-is
  if (/^[\u{1F1E6}-\u{1F1FF}]{2}$/u.test(country)) return country;

  return "";
}

/* ----------------------- Modal (reused style) ----------------------- */

function ExperienceModal({ item, onClose, lang }) {
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
                  {pickLang(item.title, lang) || item.title}
                  {(pickLang(item.organization, lang) || item.organization) ? ` • ${pickLang(item.organization, lang) || item.organization}` : ""}
                </p>
              </div>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/15 px-3 py-2 text-sm font-semibold text-cyan-800 dark:text-cyan-200 ring-1 ring-cyan-300/30 hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <HiOutlineXMark className="h-5 w-5" />
                <span className="hidden sm:inline">{pickLang(item.ui?.close, lang) || "Close"}</span>
              </button>
            </div>

            {/* Body */}
            <div className="grid gap-12 p-10 md:grid-cols-[1fr_0.9fr]">
              {/* Mobile image */}
              <div className="md:hidden overflow-hidden rounded-xl">
                {item.featuredImage && (
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="h-44 w-full object-cover"
                    draggable={false}
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
                      <span>
                        {[
                          pickLang(item.locationLabel, lang) || item.location,
                          item.country,
                        ].filter(Boolean).join(" • ")}
                      </span>
                    </div>
                  )}
                  {item.dates && (
                    <div className="flex items-center gap-2">
                      <HiOutlineCalendarDays className="h-4 w-4" />
                      <span>{formatPeriod(item.dates)}</span>
                    </div>
                  )}
                  {item.dates && formatDuration(item.dates, lang) && (
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true">⏱️</span>
                      <span>{formatDuration(item.dates, lang)}</span>
                    </div>
                  )}
                </div>

                {/* Summary */}
                {item.summary ? (
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300/85 text-justify">
                    {pickLang(item.summary, lang) || item.summary}
                  </p>
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-300/70 text-justify">
                    {pickLang(MODAL_I18N.noDescription, lang)}
                  </p>
                )}

                {/* Bullets */}
                {item.bullets?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white text-justify">
                      {pickLang(MODAL_I18N.highlights, lang)}
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300/85 text-justify">
                      {item.bullets.slice(0, 10).map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-500" />
                          <span>{pickLang(h, lang) || h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies */}
                {item.technologies?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {pickLang(MODAL_I18N.technologies, lang)}
                    </p>
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
                    draggable={false}
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

/* ----------------------- Timeline Item Card ----------------------- */

function ExpandableMarker({ item, hovered, onOpen, lang }) {
  const src = item.logo;
  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className={[
        "relative",
        "rounded-2xl border",
        "border-black/10 dark:border-white/10",
        hovered ? "bg-white dark:bg-slate-950" : "bg-white dark:bg-slate-950",
        "shadow-xl",
      ].join(" ")}
      style={{
        width: hovered ? 340 : 44,
        minHeight: 44,
        // Let content decide height when hovered; keep a safety max to avoid huge cards
        maxHeight: hovered ? 260 : 44,
        overflow: hovered ? "auto" : "visible",
      }}
    >
      <div className={hovered ? "flex h-full items-start gap-4 px-4 py-4" : "flex h-full items-center justify-center"}>
        <div className="relative shrink-0">
          <div
            className={[
              "h-11 w-11 overflow-hidden rounded-2xl",
              "border border-black/10 dark:border-white/10",
              hovered
                ? "bg-cyan-500/15 ring-2 ring-cyan-300/40 shadow-[0_0_22px_rgba(34,211,238,0.25)]"
                : "bg-white/90 dark:bg-white/5",
              "transition",
            ].join(" ")}
          >
            {src ? (
              <img
                src={src}
                alt={item.organization || item.title}
                className="h-full w-full object-contain"
                draggable={false}
              />
            ) : (
              <HiOutlineBriefcase className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
            )}
          </div>
          {countryToFlagEmoji(item.country) && (
            <div
              className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-slate-950 shadow"
              title={item.country}
            >
              <span className="text-sm leading-none">
                {countryToFlagEmoji(item.country)}
              </span>
            </div>
          )}
        </div>

        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-w-0 flex-1 flex flex-col gap-3"
          >
            <div>
              <p className="text-base font-semibold leading-snug text-slate-900 dark:text-white break-words">
                {pickLang(item.title, lang) || item.title}
              </p>
              <p className="text-sm text-slate-600 dark:text-white/70">
                {pickLang(item.organization, lang) || item.organization || "—"}
              </p>
            </div>

            <div className="h-px w-full bg-black/10 dark:bg-white/10" />
            <button
              onClick={onOpen}
              className="mt-1 w-full rounded-2xl bg-cyan-500/15 px-4 py-3 text-sm font-semibold text-cyan-700 dark:text-cyan-200 ring-1 ring-cyan-300/30 hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            >
              {pickLang(item.ui?.showMore, lang) || "Show more details"}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ----------------------- Section ----------------------- */

export default function ExperiencesTimeline() {
  const lang = useAppLanguage();
  const isMobile = useMediaQuery("(max-width: 640px)");
  // Pixel layout base unit (must be defined before axis memo)
  const unit = isMobile ? 44 : 28; // month width in px (desktop compresses)

  // Force timeline to start at Jan 2018
  const timelineStartIdx = ymToIndex({ y: 2018, m: 1 });

  const [hoveredId, setHoveredId] = useState(null);
  const [active, setActive] = useState(null);

  const scrollRef = useRef(null);

  // Start the timeline view from the end (most recent)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Scroll after layout
    requestAnimationFrame(() => {
      el.scrollLeft = el.scrollWidth;
    });
  }, []);

  // Same mapping strategy as Experience.jsx
  const items = useMemo(() => {
    const raw = Array.isArray(experienceData)
      ? experienceData
      : experienceData?.items || [];
    return raw
      .map((e) => ({
        ...e,
        logo: e.logo,
        typeLabel: pickLang(e.typeLabel || e.type, lang),
        title: pickLang(e.title, lang) || e.title,
        summary: pickLang(e.summary || e.description, lang),
        bullets: Array.isArray(e.bullets)
          ? e.bullets
              .map((b) => (typeof b === "string" ? b : pickLang(b, lang)))
              .filter(Boolean)
          : [],
        technologies: Array.isArray(e.technologies) ? e.technologies : [],
      }))
      .filter((e) => e?.dates?.start); // must have a start
  }, [lang]);

  // Build axis with gap compression (skip long periods with no experiences)
  const { axis, minIdx, maxIdx, xForIdx, totalWidth, leftPad } = useMemo(() => {
    const now = new Date();
    const nowYM = { y: now.getFullYear(), m: now.getMonth() + 1 };

    const ranges = items.map((it) => {
      const s = parseYM(it.dates?.start);
      const e = parseYM(it.dates?.end || `${nowYM.y}-${pad2(nowYM.m)}`);
      const sIdx = ymToIndex(s);
      const eIdx = ymToIndex(e);
      return [Math.min(sIdx, eIdx), Math.max(sIdx, eIdx)];
    });

    // Clamp ranges to timelineStartIdx
    const clampedRanges = ranges
      .map(([a, b]) => [Math.max(a, timelineStartIdx), b])
      .filter(([a, b]) => b >= a);

    const min = timelineStartIdx;
    const max = Math.max(...clampedRanges.map((r) => r[1]));

    // covered months set
    const covered = new Set();
    for (const [a, b] of clampedRanges) {
      for (let i = a; i <= b; i++) covered.add(i);
    }

    const axisPoints = [];
    // compress gaps >= 12 months with a single "gap" token
    const GAP_THRESHOLD = 12;

    let i = min;
    while (i <= max) {
      if (covered.has(i)) {
        axisPoints.push({ kind: "month", idx: i });
        i += 1;
        continue;
      }

      // run of uncovered months
      let j = i;
      while (j <= max && !covered.has(j)) j += 1;
      const gapLen = j - i;

      if (gapLen >= GAP_THRESHOLD) {
        axisPoints.push({ kind: "gap", fromIdx: i, toIdx: j - 1 });
      } else {
        // keep short gaps as real months (looks nicer)
        for (let k = i; k < j; k++) axisPoints.push({ kind: "month", idx: k });
      }
      i = j;
    }

    // build x mapping
    const idxToX = new Map();
    let x = 0;
    const leftPad = unit * 1.25; // ensure first month label is visible
    x = leftPad;

    // gap visual width: compress to ~2 months on desktop, ~3 on mobile
    // NOTE: we reference `isMobile` and `unit` from closure via dependency array below.
    const gapWidth = (isMobile ? 3 : 2) * unit;

    for (const p of axisPoints) {
      if (p.kind === "month") {
        idxToX.set(p.idx, x);
        x += unit;
      } else {
        // map every month in the gap to the same x start so bars stay continuous-ish
        for (let k = p.fromIdx; k <= p.toIdx; k++) idxToX.set(k, x);
        x += gapWidth;
      }
    }

    return {
      axis: axisPoints,
      minIdx: min,
      maxIdx: max,
      xForIdx: (idx) => idxToX.get(idx) ?? 0,
      totalWidth: Math.max(unit * 6, x),
      leftPad,
    };
  }, [items, isMobile, unit, timelineStartIdx]);

  // Lane packing to avoid overlaps (different rows)
  const lanes = useMemo(() => {
    const now = new Date();
    const nowYM = { y: now.getFullYear(), m: now.getMonth() + 1 };
    const nowIdx = ymToIndex(nowYM);

    const norm = items
      .map((it) => {
        const s = parseYM(it.dates?.start);
        const e = parseYM(it.dates?.end) || nowYM;
        const sIdxRaw = ymToIndex(s);
        const eIdx = Math.max(sIdxRaw, ymToIndex(e));
        const simplifyToEnd =
          String(it.dates?.start || "").startsWith("2013") &&
          String(it.dates?.end || "").startsWith("2019");
        return {
          ...it,
          _sIdx: simplifyToEnd ? timelineStartIdx : Math.max(sIdxRaw, timelineStartIdx),
          _eIdx: eIdx,
          _isOngoing: !it.dates?.end,
          _durationMonths: eIdx - sIdxRaw + 1,
          _simplifyToEnd: simplifyToEnd,
          _singleMark: simplifyToEnd ? true : eIdx - sIdxRaw + 1 <= 1,
          _nowIdx: nowIdx,
        };
      })
      .sort((a, b) => a._sIdx - b._sIdx || b._eIdx - a._eIdx);

    const laneEnds = []; // last end per lane
    const out = [];
    for (const it of norm) {
      let lane = 0;
      while (lane < laneEnds.length && laneEnds[lane] >= it._sIdx) lane++;
      if (lane === laneEnds.length) laneEnds.push(it._eIdx);
      else laneEnds[lane] = it._eIdx;
      out.push({ ...it, _lane: lane });
    }
    return { items: out, laneCount: laneEnds.length };
  }, [items, timelineStartIdx]);

  // Pixel layout
  const timelineWidthPx = totalWidth;
  const laneHeight = 120; // more vertical space between overlapping experiences
  // Extra bottom space so the last row hover-cards are not clipped by the section border
  const bottomPad = isMobile ? 88 : 104; // 60% smaller than before
  const containerHeight = (lanes.laneCount + 1) * laneHeight + bottomPad;

  // Show fewer month labels to avoid clutter
  const labelEvery = isMobile ? 3 : 6;

  return (
    <section id="experience-timeline" className="relative overflow-x-hidden">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white">
          Experience Timeline
        </h2>
        <p className="hidden sm:block text-sm text-slate-600 dark:text-slate-300/70">
          Hover an item to highlight its full duration
        </p>
      </div>

      {/* Introductory text */}
      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300/85">
        {pickLang(MODAL_I18N.timelineIntro, lang)}
      </p>

      {/* Wrapper */}
      <div
        className={[
          "mt-6 rounded-2xl border border-black/10 dark:border-white/10",
          "bg-white/60 dark:bg-white/5",
          "shadow-sm",
          "overflow-x-hidden",
        ].join(" ")}
      >
        {/* Scroll container (mobile always scrolls; desktop can still scroll if needed) */}
        <div ref={scrollRef} className="overflow-x-auto">
          <div
            className="relative"
            style={{
              width: timelineWidthPx,
              minWidth: "100%",
              height: containerHeight,
            }}
          >
            {/* Subtle grid + month labels */}
            <div className="absolute inset-0">
              {/* Vertical month lines */}
              {axis.map((p, i) => {
                if (p.kind === "gap") {
                  // draw a subtle break indicator
                  const x = (() => {
                    const anyIdx = p.fromIdx;
                    return xForIdx(anyIdx);
                  })();

                  return (
                    <div
                      key={`gap-${p.fromIdx}-${p.toIdx}`}
                      className="absolute top-0 h-full"
                      style={{ left: x }}
                    >
                      <div className="h-full w-px bg-transparent" />
                      <div
                        className="absolute top-6 -translate-x-1/2 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-2 py-1 text-[11px] text-slate-700 dark:text-slate-200/80"
                        style={{ left: 0 }}
                        title="Skipped years with no experiences"
                      >
                        …
                      </div>
                    </div>
                  );
                }

                const idx = p.idx;
                const ym = indexToYM(idx);
                const x = xForIdx(idx);

                // label density control
                const isLabel = i % labelEvery === 0 || i === 0 || i === axis.length - 1;
                const isJan = ym.m === 1;

                return (
                  <div key={`${ym.y}-${ym.m}`} className="absolute top-0 h-full" style={{ left: x }}>
                    <div
                      className={[
                        "h-full",
                        isJan
                          ? "w-px bg-slate-900/10 dark:bg-white/10"
                          : "w-px bg-slate-900/5 dark:bg-white/5",
                      ].join(" ")}
                    />

                    {isLabel && (
                      <div
                        className="absolute top-3 -translate-x-1/2 whitespace-nowrap text-[11px] text-slate-600 dark:text-slate-300/70"
                        style={{ left: 0 }}
                      >
                        {ymToLabel(ym, lang)}
                      </div>
                    )}

                    {isJan && (
                      <div
                        className="absolute top-8 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-slate-700 dark:text-slate-200/80"
                        style={{ left: 0 }}
                      >
                        {ym.y}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Items */}
            {lanes.items.map((it) => {
              const startX = xForIdx(it._sIdx);
              const endX = xForIdx(it._eIdx);
              const y = laneHeight + it._lane * laneHeight;

              const hovered = hoveredId === it.id;

              const barLeft = startX;
              const barRight = endX + unit; // right edge of the end month
              const barWidth = Math.max(unit, barRight - barLeft);
              const barTop = 22; // a bit lower, with more breathing room
              const clampedBarRight = Math.min(barRight, timelineWidthPx - 8);
              const timelineStartX = xForIdx(timelineStartIdx);
              const simplifyEllipsisX = Math.max(8, timelineStartX - unit * 0.9);

              // If the expanded card would overflow the right edge, expand it to the left.
              // ExpandableMarker hovered width is 340px.
              const expandedWidth = 340;
              const edgeBuffer = 16;
              const expandLeftOnHover = clampedBarRight + expandedWidth / 2 + edgeBuffer > timelineWidthPx;

              // Clamp hover card so it never goes below the timeline bottom.
              // ExpandableMarker maxHeight on hover is 260.
              const markerBaseTop = 44;
              const bottomBuffer = 20;
              const maxExpandedHeight = 260;
              const overflowAmount = (y + markerBaseTop + maxExpandedHeight + bottomBuffer) - containerHeight;
              const markerTop = hovered
                ? Math.max(8, markerBaseTop - Math.max(0, overflowAmount))
                : markerBaseTop;

              return (
                <motion.div
                  key={it.id}
                  className="absolute"
                  style={{ left: 0, top: y }}
                  onMouseEnter={() => setHoveredId(it.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Simplified high school span: continuous line from Jan 2018 to graduation */}
                  {it._simplifyToEnd && (
                    <>
                      <div
                        className={[
                          "absolute rounded-full",
                          hovered
                            ? "bg-cyan-400/30 dark:bg-cyan-300/25"
                            : "bg-slate-900/10 dark:bg-white/10",
                        ].join(" ")}
                        style={{
                          left: timelineStartX,
                          top: barTop,
                          width: Math.max(unit, clampedBarRight - timelineStartX),
                          height: 10,
                        }}
                      />
                      <div
                        className="absolute -translate-x-1/2 rounded-full border border-black/10 dark:border-white/10 bg-white/90 dark:bg-slate-950 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200/80"
                        style={{ left: simplifyEllipsisX, top: barTop - 26 }}
                        title="Started earlier — simplified"
                      >
                        …
                      </div>
                    </>
                  )}

                  {/* Connector line / duration bar (subtle) */}
                  {!it._singleMark && !it._simplifyToEnd && (
                    <div
                      className={[
                        "absolute rounded-full",
                        hovered
                          ? "bg-cyan-400/35 dark:bg-cyan-300/30"
                          : "bg-slate-900/10 dark:bg-white/10",
                      ].join(" ")}
                      style={{
                        left: barLeft,
                        top: barTop,
                        width: barWidth,
                        height: 10,
                      }}
                    />
                  )}

                  {/* Start marker */}
                  {!it._simplifyToEnd && (
                    <div
                      className={[
                        "absolute -translate-x-1/2 h-5 w-5 rounded-full",
                        "border border-white/20",
                        hovered
                          ? "bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                          : "bg-slate-900/30 dark:bg-white/25",
                      ].join(" ")}
                      style={{ left: barLeft, top: barTop - 4 }}
                      title={`${it.dates?.start || ""}`}
                    />
                  )}

                  {/* End marker (only if >1 month and not simplified) */}
                  {!it._singleMark && !it._simplifyToEnd && (
                    <div
                      className={[
                        "absolute -translate-x-1/2 h-5 w-5 rounded-full",
                        "border border-white/20",
                        hovered
                          ? "bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                          : "bg-slate-900/30 dark:bg-white/25",
                      ].join(" ")}
                      style={{ left: clampedBarRight, top: barTop - 4 }}
                      title={`${it.dates?.end || "Present"}`}
                    />
                  )}

                  {/* Single marker (for singleMark or simplified-to-end) */}
                  {it._singleMark && (
                    <div
                      className={[
                        "absolute -translate-x-1/2 h-5 w-5 rounded-full",
                        "border border-white/20",
                        hovered
                          ? "bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                          : "bg-slate-900/30 dark:bg-white/25",
                      ].join(" ")}
                      style={{ left: clampedBarRight, top: barTop - 4 }}
                      title={`${it.dates?.end || it.dates?.start || ""}`}
                    />
                  )}

                  {/* Expandable marker at the end point */}
                  <div
                    className={hovered ? "absolute z-30" : "absolute z-10"}
                    style={{
                      left: clampedBarRight,
                      top: markerTop,
                      // When expanding left, keep ~22px overlap over the anchor point to avoid flicker.
                      transform:
                        hovered && expandLeftOnHover
                          ? "translateX(calc(-100% + 22px))"
                          : "translateX(-50%)",
                    }}
                  >
                    <ExpandableMarker
                      item={it}
                      hovered={hovered}
                      onOpen={() => setActive(it)}
                      lang={lang}
                    />
                  </div>

                  {/* Show month name for start date above the start, if hovered */}
                  {hovered && (
                    <div
                      className="absolute -translate-x-1/2 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-slate-950 px-2 py-1 text-[11px] font-semibold text-slate-900 dark:text-white shadow"
                      style={{ left: it._simplifyToEnd ? timelineStartX : barLeft, top: barTop - 30 }}
                    >
                      {it._simplifyToEnd ? formatMonthName("2018-01", lang) : formatMonthName(it.dates?.start, lang)}
                    </div>
                  )}
                  {/* Show month name for end date above the end, if hovered */}
                  {hovered && (
                    <div
                      className="absolute -translate-x-1/2 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-slate-950 px-2 py-1 text-[11px] font-semibold text-slate-900 dark:text-white shadow"
                      style={{ left: clampedBarRight, top: barTop - 30 }}
                    >
                      {formatMonthName(it.dates?.end || it.dates?.start, lang)}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* bottom padding spacer */}
            <div className="absolute bottom-4 left-4 text-xs text-slate-600 dark:text-slate-300/70">
              {`Months are the unit on the X axis • ${items.length} experiences`}
            </div>
          </div>
        </div>
      </div>

      <ExperienceModal item={active} onClose={() => setActive(null)} lang={lang} />
    </section>
  );
}