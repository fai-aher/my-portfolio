import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineTrophy,
  HiOutlinePhoto,
  HiOutlineXMark,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";
import { RiMedalLine } from "react-icons/ri";

import awards from "../data/awards.json";

/**
 * AwardsSection
 * - Responsive (mobile-first)
 * - Dark/light friendly using Tailwind `dark:` variants
 * - i18n-ready (EN/ES/JA/KO) using language persisted by Header (localStorage + custom event)
 * - Data-driven from `src/data/awards.json`
 * - Includes an image modal ready for real award photos
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

const UI = {
  en: {
    title: "Awards & Recognition",
    subtitle:
      "A curated gallery of milestones, scholarships, competitions, and honors.",
    view: "View",
    close: "Close",
    gallery: "Gallery",
    filters: {
      all: "All",
      scholarship: "Scholarship",
      competition: "Competition",
      honor: "Honor",
      leadership: "Leadership",
    },
  },
  es: {
    title: "Premios y Reconocimientos",
    subtitle: "Una galería curada de hitos, becas, concursos y logros.",
    view: "Ver",
    close: "Cerrar",
    gallery: "Galería",
    filters: {
      all: "Todo",
      scholarship: "Beca",
      competition: "Concurso",
      honor: "Honor",
      leadership: "Liderazgo",
    },
  },
  ja: {
    title: "受賞・表彰",
    subtitle: "奨学金、コンテスト、表彰などのマイルストーンをまとめたギャラリー。",
    view: "見る",
    close: "閉じる",
    gallery: "ギャラリー",
    filters: {
      all: "すべて",
      scholarship: "奨学金",
      competition: "コンテスト",
      honor: "表彰",
      leadership: "リーダーシップ",
    },
  },
  ko: {
    title: "수상 및 인정",
    subtitle: "장학금, 대회, 표창 등 주요 성과를 모아둔 갤러리입니다.",
    view: "보기",
    close: "닫기",
    gallery: "갤러리",
    filters: {
      all: "전체",
      scholarship: "장학금",
      competition: "대회",
      honor: "표창",
      leadership: "리더십",
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const cardStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

function TypePill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs sm:text-sm transition focus:outline-none focus:ring-2 focus:ring-cyan-400/50 " +
        (active
          ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-700 dark:text-cyan-200"
          : "border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-900 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/10")
      }
      type="button"
    >
      <span
        className={
          "h-1.5 w-1.5 rounded-full " +
          (active ? "bg-cyan-500/80 dark:bg-cyan-300/80" : "bg-cyan-500/60 dark:bg-cyan-300/60")
        }
      />
      {label}
    </button>
  );
}

function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-1/2 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-slate-950/80 backdrop-blur shadow-2xl">
              <div className="flex items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-widest text-cyan-700 dark:text-cyan-200/70">
                  {title}
                </p>
                <button
                  onClick={onClose}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-900 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  aria-label="Close"
                >
                  <HiOutlineXMark className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 sm:p-6">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AwardsSection() {
  const lang = useAppLanguage();
  const t = useMemo(() => UI[lang] || UI.en, [lang]);

  const [filter, setFilter] = useState("all");
  const [activeAwardId, setActiveAwardId] = useState(null);

  // Build UI-friendly items from awards.json
  const items = useMemo(() => {
    return (awards || []).map((a) => {
      const year = a.date ? String(a.date).slice(0, 4) : "";

      // If you later add a category/type in awards.json, we will use it.
      const type = a.type || a.category || "honor";

      const title = pickLang(a.title, lang);
      const org = a.organization || "";

      return {
        id: a.id,
        type,
        year,
        title,
        org,
        summary: org ? `${title} — ${org}` : title,
        tags: a.location ? [a.location, ...(org ? [org] : [])] : org ? [org] : [],
        link: a.link || null,
        images: (a.images || []).map((src, i) => ({
          id: `${a.id}-img-${i}`,
          caption: title,
          src,
        })),
      };
    });
  }, [lang]);

  const activeAward = useMemo(
    () => items.find((a) => a.id === activeAwardId) || null,
    [items, activeAwardId]
  );

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((a) => a.type === filter);
  }, [filter, items]);

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
                {t.title}
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-slate-700 dark:text-slate-300/85">
              {t.subtitle}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2">
            <RiMedalLine className="h-5 w-5 text-cyan-500 dark:text-cyan-300/90" />
            <span className="text-xs text-slate-700 dark:text-slate-200/80">
              {filtered.length} items
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          <TypePill
            label={t.filters.all}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <TypePill
            label={t.filters.scholarship}
            active={filter === "scholarship"}
            onClick={() => setFilter("scholarship")}
          />
          <TypePill
            label={t.filters.competition}
            active={filter === "competition"}
            onClick={() => setFilter("competition")}
          />
          <TypePill
            label={t.filters.honor}
            active={filter === "honor"}
            onClick={() => setFilter("honor")}
          />
          <TypePill
            label={t.filters.leadership}
            active={filter === "leadership"}
            onClick={() => setFilter("leadership")}
          />
        </div>

        {/* Grid */}
        <motion.div
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={cardStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          key={filter}
        >
          {filtered.map((a) => (
            <motion.article
              key={a.id}
              variants={cardAnim}
              className="group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5"
            >
              {/* card glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition"
              >
                <div className="absolute -inset-24 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-indigo-400/0 blur-2xl" />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-widest text-cyan-700 dark:text-cyan-200/70">
                      {a.year}
                    </p>
                    <h3 className="mt-1 truncate text-lg font-semibold text-slate-900 dark:text-white">
                      {a.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300/85">
                      {a.org}
                    </p>
                  </div>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-950/20">
                    <RiMedalLine className="h-5 w-5 text-cyan-500 dark:text-cyan-300/90" />
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-800 dark:text-slate-200/85">
                  {a.summary}
                </p>

                {/* tags */}
                {a.tags?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {a.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-950/20 px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveAwardId(a.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  >
                    <HiOutlinePhoto className="h-4 w-4" />
                    {t.gallery}
                  </button>

                  {a.link ? (
                    <a
                      href={a.link}
                      target={a.link.startsWith("http") ? "_blank" : undefined}
                      rel={a.link.startsWith("http") ? "noreferrer" : undefined}
                      className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                    >
                      {t.view}
                      <HiOutlineArrowTopRightOnSquare className="h-4 w-4 opacity-80" />
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-cyan-400/0 via-cyan-400/35 to-indigo-400/0" />
            </motion.article>
          ))}
        </motion.div>

        {/* Modal */}
        <Modal
          open={!!activeAward}
          onClose={() => setActiveAwardId(null)}
          title={activeAward ? `${activeAward.year} • ${activeAward.title}` : ""}
        >
          {activeAward && (
            <div className="grid gap-4">
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {activeAward.org}
                    </p>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300/85">
                      {activeAward.summary}
                    </p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-950/20">
                    <RiMedalLine className="h-5 w-5 text-cyan-500 dark:text-cyan-300/90" />
                  </span>
                </div>
                {activeAward.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeAward.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-950/20 px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Gallery */}
              <div className="grid gap-3 sm:grid-cols-2">
                {(activeAward.images || []).length ? (
                  activeAward.images.map((img) => (
                    <div
                      key={img.id}
                      className="group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5"
                    >
                      {img.src ? (
                        <img
                          src={img.src}
                          alt={img.caption || activeAward.title}
                          className="aspect-[4/3] w-full object-cover"
                          loading="lazy"
                          draggable={false}
                        />
                      ) : (
                        <div className="aspect-[4/3] w-full bg-gradient-to-br from-cyan-400/10 via-white/5 to-indigo-400/10" />
                      )}
                      <div className="absolute inset-0 flex items-end">
                        <div className="w-full bg-black/50 backdrop-blur px-3 py-2">
                          <p className="text-xs text-slate-200/90">{img.caption}</p>
                        </div>
                      </div>
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition"
                      >
                        <div className="absolute -inset-24 bg-gradient-to-r from-cyan-400/0 via-cyan-400/15 to-indigo-400/0 blur-2xl" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="sm:col-span-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 text-sm text-slate-700 dark:text-slate-300/85">
                    No images yet.
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveAwardId(null)}
                  className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                >
                  <HiOutlineXMark className="h-4 w-4" />
                  {t.close}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </motion.div>
    </div>
  );
}