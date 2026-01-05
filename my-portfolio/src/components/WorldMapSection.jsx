import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineGlobeAlt,
  HiOutlineXMark,
  HiOutlineCamera,
  HiOutlineMapPin,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";

import MapPoint from "./MapPoint.jsx";
import tripsData from "../data/travel.json";
import experiencesData from "../data/experience.json";

/**
 * WorldMapSection
 * - Interactive world map with clickable points
 * - Responsive: phones -> desktop
 * - Fully light/dark friendly (matches the site's design system)
 * - i18n-ready (EN/ES/JA/KO) via Header language event + localStorage
 * - Data-ready: reads pins from a static JSON file (travel.json) + enriches with experience.json
 */

function useAppLanguage() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  useEffect(() => {
    const handler = (e) => setLang(e?.detail?.lang || localStorage.getItem("lang") || "en");
    window.addEventListener("app:languageChanged", handler);
    return () => window.removeEventListener("app:languageChanged", handler);
  }, []);

  return lang;
}

const UI = {
  en: {
    title: "World Map",
    subtitle:
      "Click a pin to open a travel log. Add photos and stories later from a static JSON file — no backend needed.",
    hint: "Tip: tap a pin to view details",
    close: "Close",
    photos: "Photos",
    story: "Story",
    highlights: "Highlights",
    openAlbum: "Open album",
    closeAlbum: "Close album",
    filtersTitle: "Filter",
    filters: { all: "All", asia: "Asia", europe: "Europe", americas: "Americas", other: "Other" },
  },
  es: {
    title: "Mapa Mundial",
    subtitle:
      "Toca un punto para abrir un registro de viaje. Luego agregas fotos e historias desde un JSON estático — sin backend.",
    hint: "Tip: toca un punto para ver detalles",
    close: "Cerrar",
    photos: "Fotos",
    story: "Historia",
    highlights: "Destacados",
    openAlbum: "Abrir álbum",
    closeAlbum: "Cerrar álbum",
    filtersTitle: "Filtrar",
    filters: { all: "Todo", asia: "Asia", europe: "Europa", americas: "Américas", other: "Otros" },
  },
  ja: {
    title: "世界地図",
    subtitle:
      "ピンをクリックして旅ログを開く。写真やストーリーは後で静的JSONから追加可能（バックエンド不要）。",
    hint: "ヒント：ピンをタップして詳細表示",
    close: "閉じる",
    photos: "写真",
    story: "ストーリー",
    highlights: "ハイライト",
    openAlbum: "アルバムを開く",
    closeAlbum: "アルバムを閉じる",
    filtersTitle: "フィルター",
    filters: { all: "すべて", asia: "アジア", europe: "ヨーロッパ", americas: "アメリカ", other: "その他" },
  },
  ko: {
    title: "세계 지도",
    subtitle:
      "핀을 눌러 여행 로그를 여세요. 사진/스토리는 나중에 정적 JSON에서 추가 (백엔드 불필요).",
    hint: "팁: 핀을 눌러 상세 보기",
    close: "닫기",
    photos: "사진",
    story: "스토리",
    highlights: "하이라이트",
    openAlbum: "앨범 열기",
    closeAlbum: "앨범 닫기",
    filtersTitle: "필터",
    filters: { all: "전체", asia: "아시아", europe: "유럽", americas: "아메리카", other: "기타" },
  },
};



const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function pickLang(value, lang) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || Object.values(value)[0] || "";
}

function fmtDates(dates) {
  if (!dates) return "";
  const s = dates.start || "";
  const e = dates.end || "";
  if (!s && !e) return "";
  if (!e) return `${s} – Present`;
  if (s === e) return s;
  return `${s} – ${e}`;
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs sm:text-sm transition focus:outline-none focus:ring-2 focus:ring-cyan-400/50 " +
        (active
          ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-700 dark:text-cyan-200"
          : "border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-800 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/10")
      }
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

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[75]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-1/2 w-[94vw] max-w-4xl -translate-x-1/2 -translate-y-1/2"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-slate-950/90 shadow-2xl flex max-h-[85vh] flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 px-4 py-3">
                <p className="min-w-0 truncate text-xs uppercase tracking-widest text-cyan-700 dark:text-cyan-200/70">
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
              <div className="p-4 sm:p-6 overflow-y-auto">
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MapBackground() {
  // Lightweight "world map" placeholder made with CSS.
  // Optionally shows a world map SVG/image behind the grid/blobs.
  return (
    <div className="absolute inset-0">
      {/* Optional world map image (put an SVG/PNG at this path). */}
      <img
        src="/assets/worldmap/world.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain opacity-[0.35] dark:opacity-[0.25] invert dark:invert-0 pointer-events-none transition-opacity"
        onError={(e) => {
          // If the asset doesn't exist yet, just hide the image layer.
          e.currentTarget.style.display = "none";
        }}
      />
      {/* Base (light) */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-black/5 via-black/3 to-black/5 dark:hidden" />
      {/* Base (dark) */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 hidden dark:block" />

      {/* Subtle grid (light) */}
      <div
        className="absolute inset-0 rounded-3xl opacity-60 dark:hidden"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      {/* Subtle grid (dark) */}
      <div
        className="absolute inset-0 rounded-3xl opacity-60 hidden dark:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Continent-like blobs */}
      <div className="absolute left-[10%] top-[30%] h-[45%] w-[35%] rounded-[40%] bg-cyan-500/10 dark:bg-cyan-400/8 blur-xl" />
      <div className="absolute left-[42%] top-[25%] h-[35%] w-[22%] rounded-[45%] bg-indigo-500/10 dark:bg-indigo-400/8 blur-xl" />
      <div className="absolute left-[62%] top-[35%] h-[40%] w-[30%] rounded-[42%] bg-cyan-500/9 dark:bg-cyan-400/7 blur-xl" />

      {/* Neon edge */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-cyan-400/0 via-cyan-400/35 to-indigo-400/0" />
    </div>
  );
}

function PhotoTile({ caption, src }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5">
      {src ? (
        <img
          src={src}
          alt={caption || ""}
          className="aspect-[16/10] w-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div className="aspect-[16/10] w-full bg-gradient-to-br from-cyan-400/10 via-white/5 to-indigo-400/10" />
      )}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full bg-black/60 backdrop-blur px-3 py-2">
          <p className="text-xs text-slate-200/90">{caption}</p>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition"
      >
        <div className="absolute -inset-24 bg-gradient-to-r from-cyan-400/0 via-cyan-400/15 to-indigo-400/0 blur-2xl" />
      </div>
    </div>
  );
}

function WorldMapSectionImpl() {
  const lang = useAppLanguage();
  const t = useMemo(() => UI[lang] || UI.en, [lang]);

  const [filter, setFilter] = useState("all");
  const [activeId, setActiveId] = useState(null);

  // Album/Photos UI state
  const [photoStart, setPhotoStart] = useState(0);
  const [albumOpen, setAlbumOpen] = useState(false);
  const [albumIndex, setAlbumIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 640px)").matches : true
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = (e) => setIsDesktop(e.matches);
    // Safari fallback
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  const trips = Array.isArray(tripsData) ? tripsData : [];

  const experiencesById = useMemo(() => {
    const m = new Map();
    (Array.isArray(experiencesData) ? experiencesData : []).forEach((ex) => m.set(ex.id, ex));
    return m;
  }, []);

  const visibleTrips = useMemo(() => {
    if (filter === "all") return trips;
    return trips.filter((p) => p.region === filter);
  }, [trips, filter]);

  const active = useMemo(() => trips.find((p) => p.id === activeId) || null, [trips, activeId]);

  // Reset album/preview state when modal opens to new place
  useEffect(() => {
    setPhotoStart(0);
    setAlbumOpen(false);
    setAlbumIndex(0);
  }, [activeId]);

  return (
    <div className="relative">
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-8 -top-10 -z-10 h-40 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-indigo-400/0 blur-2xl"
      />

      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={fadeUp}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/70 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10">
                <HiOutlineGlobeAlt className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {t.title}
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-slate-700 dark:text-slate-300/85">{t.subtitle}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300/70">{t.hint}</p>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2">
            <HiOutlineMapPin className="h-5 w-5 text-cyan-600 dark:text-cyan-300/90" />
            <span className="text-xs text-slate-700 dark:text-slate-200/80">{visibleTrips.length} pins</span>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300/70 mr-1">
            {t.filtersTitle}:
          </span>
          <FilterPill label={t.filters.all} active={filter === "all"} onClick={() => setFilter("all")} />
          <FilterPill
            label={t.filters.americas}
            active={filter === "americas"}
            onClick={() => setFilter("americas")}
          />
          <FilterPill label={t.filters.asia} active={filter === "asia"} onClick={() => setFilter("asia")} />
          <FilterPill label={t.filters.europe} active={filter === "europe"} onClick={() => setFilter("europe")} />
          <FilterPill label={t.filters.other} active={filter === "other"} onClick={() => setFilter("other")} />
        </div>

        {/* Map container */}
        <div className="mt-6 relative rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5">
          <div className="relative h-[70vh] overflow-auto overscroll-contain sm:aspect-[16/9] sm:h-auto sm:overflow-hidden sm:overscroll-auto">
            <div className="relative min-w-[900px] sm:min-w-0 h-full">
              <MapBackground />

              {/* Pins */}
              {visibleTrips.map((p) => (
                <MapPoint
                  key={p.id}
                  x={p.x}
                  y={p.y}
                  title={p.country}
                  subtitle={p.city}
                  active={activeId === p.id}
                  onClick={() => setActiveId(p.id)}
                  className="will-change-transform"
                />
              ))}
            </div>
          </div>

          {/* Bottom hint bar (mobile) */}
          <div className="sm:hidden flex items-center justify-between gap-3 border-t border-black/10 dark:border-white/10 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200/85">
              <HiOutlineMapPin className="h-5 w-5 text-cyan-600 dark:text-cyan-300/90" />
              <span>{visibleTrips.length} pins</span>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-300/70">{t.hint}</span>
          </div>
        </div>

        {/* Modal for active trip */}
        <Modal
          open={!!active}
          onClose={() => setActiveId(null)}
          title={active ? `${active.country} • ${active.city} • ${active.date}` : ""}
        >
          {active && (
            <div className="grid gap-4">
              {/* Photos */}
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <HiOutlineCamera className="h-5 w-5 text-cyan-600 dark:text-cyan-300/90" />
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.photos}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAlbumOpen((v) => !v)}
                      className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                    >
                      {albumOpen ? t.closeAlbum : t.openAlbum}
                      {albumOpen ? (
                        <HiOutlineXMark className="h-4 w-4 opacity-80" />
                      ) : (
                        <HiOutlineArrowTopRightOnSquare className="h-4 w-4 opacity-80" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Album viewer (big) */}
                {albumOpen && (active.photos || []).length > 0 && (
                  <div className="mt-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-950/10 p-3">
                    <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl" />
                        <div className="absolute -left-24 -bottom-24 h-60 w-60 rounded-full bg-indigo-400/10 blur-3xl" />
                      </div>

                      {/* Media */}
                      {active.photos?.[albumIndex]?.src ? (
                        <img
                          src={active.photos[albumIndex].src}
                          alt={active.photos?.[albumIndex]?.caption || ""}
                          className="relative h-[42vh] sm:h-[52vh] w-full object-contain bg-black/10 dark:bg-black/20"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="relative h-[42vh] sm:h-[52vh] w-full bg-gradient-to-br from-cyan-400/10 via-white/5 to-indigo-400/10" />
                      )}

                      {/* Controls */}
                      <button
                        type="button"
                        onClick={() => setAlbumIndex((i) => Math.max(0, i - 1))}
                        disabled={albumIndex <= 0}
                        className={
                          "absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-cyan-400/50 " +
                          (albumIndex <= 0
                            ? "cursor-not-allowed border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 text-slate-400 dark:text-slate-500"
                            : "border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-950/70 text-slate-900 dark:text-white hover:bg-white")
                        }
                        aria-label="Previous photo"
                      >
                        ‹
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setAlbumIndex((i) =>
                            Math.min((active.photos?.length || 1) - 1, i + 1)
                          )
                        }
                        disabled={albumIndex >= (active.photos?.length || 1) - 1}
                        className={
                          "absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-cyan-400/50 " +
                          (albumIndex >= (active.photos?.length || 1) - 1
                            ? "cursor-not-allowed border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 text-slate-400 dark:text-slate-500"
                            : "border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-950/70 text-slate-900 dark:text-white hover:bg-white")
                        }
                        aria-label="Next photo"
                      >
                        ›
                      </button>

                      {/* Caption + counter */}
                      <div className="absolute inset-x-0 bottom-0 bg-black/55 backdrop-blur-sm px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm text-white/90">
                            {active.photos?.[albumIndex]?.caption || ""}
                          </p>
                          <span className="text-xs text-white/70">
                            {albumIndex + 1}/{active.photos?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mini strip */}
                    <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                      {(active.photos || []).map((ph, idx) => (
                        <button
                          key={ph.id}
                          type="button"
                          onClick={() => setAlbumIndex(idx)}
                          className={
                            "shrink-0 rounded-xl border p-1 transition " +
                            (idx === albumIndex
                              ? "border-cyan-300/40 bg-cyan-400/10"
                              : "border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10")
                          }
                          aria-label={`Open photo ${idx + 1}`}
                        >
                          <div className="h-12 w-20 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
                            {ph.src ? (
                              <img
                                src={ph.src}
                                alt={ph.caption || ""}
                                className="h-full w-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-cyan-400/10 via-white/5 to-indigo-400/10" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview carousel (not album) */}
                <div className="mt-4">
                  {(() => {
                    const photos = active.photos || [];
                    const visibleCount = isDesktop ? 2 : 1;
                    const maxStart = Math.max(0, photos.length - visibleCount);
                    const start = Math.min(photoStart, maxStart);
                    const canPrev = start > 0;
                    const canNext = start < maxStart;
                    const windowPhotos = photos.slice(start, start + visibleCount);

                    return (
                      <div className="relative">
                        {/* Arrows */}
                        {photos.length > visibleCount && (
                          <>
                            <button
                              type="button"
                              onClick={() => setPhotoStart((s) => Math.max(0, s - 1))}
                              disabled={!canPrev}
                              className={
                                "absolute left-0 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 place-items-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-cyan-400/50 " +
                                (!canPrev
                                  ? "cursor-not-allowed border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 text-slate-400 dark:text-slate-500"
                                  : "border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-950/70 text-slate-900 dark:text-white hover:bg-white")
                              }
                              aria-label="Scroll left"
                            >
                              ‹
                            </button>

                            <button
                              type="button"
                              onClick={() => setPhotoStart((s) => Math.min(maxStart, s + 1))}
                              disabled={!canNext}
                              className={
                                "absolute right-0 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 place-items-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-cyan-400/50 " +
                                (!canNext
                                  ? "cursor-not-allowed border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 text-slate-400 dark:text-slate-500"
                                  : "border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-950/70 text-slate-900 dark:text-white hover:bg-white")
                              }
                              aria-label="Scroll right"
                            >
                              ›
                            </button>
                          </>
                        )}

                        <div className={"grid gap-3 " + (isDesktop ? "sm:grid-cols-2" : "grid-cols-1") + " " + (!isDesktop ? "sm:grid-cols-2" : "")}
                          >
                          {windowPhotos.map((ph) => (
                            <PhotoTile key={ph.id} caption={ph.caption} src={ph.src} />
                          ))}
                        </div>

                        {photos.length === 0 && (
                          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-950/10 p-4 text-sm text-slate-700 dark:text-slate-200/80">
                            No photos yet.
                          </div>
                        )}

                        {photos.length > 0 && (
                          <div className="mt-2 flex items-center justify-end text-xs text-slate-600 dark:text-slate-300/70">
                            Showing {start + 1}
                            {visibleCount > 1 ? `–${Math.min(start + visibleCount, photos.length)}` : ""} of {photos.length}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Linked experiences (from experience.json) */}
              {Array.isArray(active.experienceIds) && active.experienceIds.length > 0 && (
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
                  <div className="flex items-center gap-2">
                    <HiOutlineGlobeAlt className="h-5 w-5 text-cyan-600 dark:text-cyan-300/90" />
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {lang === "es" ? "Experiencias" : lang === "ja" ? "経験" : lang === "ko" ? "경험" : "Experiences"}
                    </p>
                  </div>

                  <div className="mt-3 grid gap-3">
                    {active.experienceIds
                      .map((id) => experiencesById.get(id))
                      .filter(Boolean)
                      .map((ex) => (
                        <div
                          key={ex.id}
                          className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-950/10 p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {pickLang(ex.title, lang)}
                            </p>
                            <span className="shrink-0 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-200/80">
                              {fmtDates(ex.dates)}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-700 dark:text-slate-300/80">
                            {ex.organization}{ex.city ? ` • ${ex.city}` : ""}
                          </p>
                          {ex.summary && (
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300/85 leading-relaxed">
                              {pickLang(ex.summary, lang)}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Story */}
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
                <div className="flex items-center gap-2">
                  <HiOutlineGlobeAlt className="h-5 w-5 text-cyan-600 dark:text-cyan-300/90" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.story}</p>
                </div>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-300/85 leading-relaxed">{active.story}</p>
              </div>

              {/* Highlights */}
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
                <div className="flex items-center gap-2">
                  <HiOutlineMapPin className="h-5 w-5 text-cyan-600 dark:text-cyan-300/90" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.highlights}</p>
                </div>
                <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                  {active.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-950/10 px-3 py-2 text-sm text-slate-900 dark:text-slate-200/90"
                    >
                      <span className="inline-block mr-2 h-1.5 w-1.5 rounded-full bg-cyan-500/70 dark:bg-cyan-300/70 align-middle" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
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

// Export both named + default.
export function WorldMapSection() {
  return <WorldMapSectionImpl />;
}

export default WorldMapSection;