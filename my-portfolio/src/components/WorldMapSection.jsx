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
      "This map highlights where I’ve built my career through academic and professional experiences, and also the {count} countries I’ve visited in total. Switch to Personal to view all countries I’ve visited for any reason (including tourism).",
    hint: "Tip: tap a pin to view details",
    close: "Close",
    photos: "Photos",
    story: "Story",
    highlights: "Highlights",
    openAlbum: "Open album",
    closeAlbum: "Close album",
    filtersTitle: "Filter",
    filters: { all: "All", asia: "Asia", europe: "Europe", americas: "Americas", other: "Other" },

    modeLabel: "View",
    modeProfessional: "Career",
    modePersonal: "Personal",
    experiencesCountLabel: "experiences",
    showDetails: "Show details",
    noPhotosYet: "No photos yet.",
    showing: "Showing",
    linkedExperiencesTitle: "Experiences",
    locationsLabel: "locations",
  },
  es: {
    title: "Mapa Mundial",
    subtitle:
      "Este mapa muestra dónde he construido mi trayectoria con experiencias académicas y profesionales, y también los {count} países que he visitado en total. Cambia a Personal para ver todos los países que he visitado por cualquier motivo (incluyendo turismo).",
    hint: "Tip: toca un punto para ver detalles",
    close: "Cerrar",
    photos: "Fotos",
    story: "Historia",
    highlights: "Destacados",
    openAlbum: "Abrir álbum",
    closeAlbum: "Cerrar álbum",
    filtersTitle: "Filtrar",
    filters: { all: "Todo", asia: "Asia", europe: "Europa", americas: "Américas", other: "Otros" },

    modeLabel: "Vista",
    modeProfessional: "Carrera",
    modePersonal: "Personal",
    experiencesCountLabel: "experiencias",
    showDetails: "Ver detalles",
    noPhotosYet: "Aún no hay fotos.",
    showing: "Mostrando",
    linkedExperiencesTitle: "Experiencias",
    locationsLabel: "lugares",
  },
  ja: {
    title: "世界地図",
    subtitle:
      "この地図では、学術・キャリアの経験を積んだ国と、これまでに訪れた{count}か国をまとめています。Personal（旅行）に切り替えると、観光を含むあらゆる理由で訪れた国がすべて表示されます。",
    hint: "ヒント：ピンをタップして詳細表示",
    close: "閉じる",
    photos: "写真",
    story: "ストーリー",
    highlights: "ハイライト",
    openAlbum: "アルバムを開く",
    closeAlbum: "アルバムを閉じる",
    filtersTitle: "フィルター",
    filters: { all: "すべて", asia: "アジア", europe: "ヨーロッパ", americas: "アメリカ", other: "その他" },

    modeLabel: "表示",
    modeProfessional: "キャリア",
    modePersonal: "旅行",
    experiencesCountLabel: "経験",
    showDetails: "詳細を見る",
    noPhotosYet: "写真はまだありません。",
    showing: "表示",
    linkedExperiencesTitle: "経験",
    locationsLabel: "場所",
  },
  ko: {
    title: "세계 지도",
    subtitle:
      "이 지도는 제가 학업·커리어 경험을 쌓은 국가와, 지금까지 방문한 총 {count}개 국가를 함께 보여줍니다. Personal(여행)로 전환하면 관광을 포함해 어떤 이유로든 방문한 모든 국가가 표시됩니다.",
    hint: "팁: 핀을 눌러 상세 보기",
    close: "닫기",
    photos: "사진",
    story: "스토리",
    highlights: "하이라이트",
    openAlbum: "앨범 열기",
    closeAlbum: "앨범 닫기",
    filtersTitle: "필터",
    filters: { all: "전체", asia: "아시아", europe: "유럽", americas: "아메리카", other: "기타" },

    modeLabel: "보기",
    modeProfessional: "커리어",
    modePersonal: "여행",
    experiencesCountLabel: "경험",
    showDetails: "자세히 보기",
    noPhotosYet: "아직 사진이 없어요.",
    showing: "표시",
    linkedExperiencesTitle: "경험",
    locationsLabel: "장소",
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

// ✅ Safe renderer for travel.json fields that may be localized objects
function pickTravelText(value, lang) {
  if (value == null) return "";
  if (Array.isArray(value)) return value;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") return pickLang(value, lang);
  return "";
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

function countryToFlagEmoji(country) {
  const map = {
    Colombia: "🇨🇴",
    "South Korea": "🇰🇷",
    Korea: "🇰🇷",
    Japan: "🇯🇵",
    Netherlands: "🇳🇱",
    England: "🇬🇧",
    "United Kingdom": "🇬🇧",
    UK: "🇬🇧",
  };
  return map[country] || "🌍";
}

function getCountryLabel(p, lang) {
  // Accept future schemas:
  // - countryLabel: {en,es,ja,ko}
  // - country: string OR {en,es,ja,ko}
  return pickLang(p?.countryLabel || p?.country, lang);
}

function getModeExperienceCount(p, mode) {
  if (!p) return 0;
  if (mode === "personal") return Array.isArray(p.personalExperienceIds) ? p.personalExperienceIds.length : 0;
  return Array.isArray(p.experienceIds) ? p.experienceIds.length : 0;
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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
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
              <div className="p-4 sm:p-6 overflow-y-auto">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MapBackground() {
  return (
    <div className="absolute inset-0">
      {/* Map image - dark blue tint in light mode, original in dark mode */}
      <img
        src="/assets/worldmap/world.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain opacity-[0.25] dark:opacity-[0.4] pointer-events-none [filter:brightness(0)_sepia(1)_hue-rotate(180deg)_saturate(3)] dark:[filter:none]"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:via-white/3 dark:to-white/5" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 rounded-3xl opacity-40 dark:opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div
        className="absolute inset-0 rounded-3xl opacity-60 hidden dark:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Glow effects */}
      <div className="absolute left-[10%] top-[30%] h-[45%] w-[35%] rounded-[40%] bg-cyan-500/10 dark:bg-cyan-400/8 blur-xl" />
      <div className="absolute left-[42%] top-[25%] h-[35%] w-[22%] rounded-[45%] bg-indigo-500/10 dark:bg-indigo-400/8 blur-xl" />
      <div className="absolute left-[62%] top-[35%] h-[40%] w-[30%] rounded-[42%] bg-cyan-500/8 dark:bg-cyan-400/7 blur-xl" />

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
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
        <div className="absolute -inset-24 bg-gradient-to-r from-cyan-400/0 via-cyan-400/15 to-indigo-400/0 blur-2xl" />
      </div>
    </div>
  );
}

function WorldMapSectionImpl() {
  const lang = useAppLanguage();
  const t = useMemo(() => UI[lang] || UI.en, [lang]);

  const [filter, setFilter] = useState("all");
  const [mode, setMode] = useState("professional"); // professional | personal

  const [selectedId, setSelectedId] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [photoStart, setPhotoStart] = useState(0);
  const [albumOpen, setAlbumOpen] = useState(false);
  const [albumIndex, setAlbumIndex] = useState(0);

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 640px)").matches : true
  );

  const [canHover, setCanHover] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(hover: hover)").matches : true
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = (e) => setIsDesktop(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    const onChange = (e) => setCanHover(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  const trips = Array.isArray(tripsData) ? tripsData : [];

  const totalVisited = useMemo(() => {
    return trips.filter((p) => {
      const modes = Array.isArray(p.modes) ? p.modes : [];
      return modes.includes("personal");
    }).length;
  }, [trips]);

  const subtitleText = useMemo(() => {
    const raw = t.subtitle || "";
    return raw.replace("{count}", String(totalVisited));
  }, [t.subtitle, totalVisited]);

  const experiencesById = useMemo(() => {
    const m = new Map();
    (Array.isArray(experiencesData) ? experiencesData : []).forEach((ex) => m.set(ex.id, ex));
    return m;
  }, []);

  const visibleTrips = useMemo(() => {
    const modeTrips = trips.filter((p) => {
      const modes = Array.isArray(p.modes) ? p.modes : [];
      return modes.includes(mode);
    });
    if (filter === "all") return modeTrips;
    return modeTrips.filter((p) => p.region === filter);
  }, [trips, filter, mode]);

  const active = useMemo(() => trips.find((p) => p.id === selectedId) || null, [trips, selectedId]);

  useEffect(() => {
    setPhotoStart(0);
    setAlbumOpen(false);
    setAlbumIndex(0);
  }, [selectedId]);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-8 -top-10 -z-10 h-40 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-indigo-400/0 blur-2xl"
      />

      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={fadeUp}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/70 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10">
                <HiOutlineGlobeAlt className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
              </span>

              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {t.title}
              </h2>
            </div>

            <p className="mt-3 max-w-3xl text-slate-700 dark:text-slate-300/85">{subtitleText}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300/70">{t.hint}</p>
          </div>

          <div className="hidden sm:flex flex-col items-end gap-2">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-2 py-1.5">
              <span className="hidden lg:inline text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-300/70 px-2">
                {t.modeLabel}
              </span>

              <button
                type="button"
                onClick={() => setMode("professional")}
                className={
                  "rounded-xl px-3 py-1.5 text-xs sm:text-sm transition focus:outline-none focus:ring-2 focus:ring-cyan-400/50 " +
                  (mode === "professional"
                    ? "bg-cyan-400/10 text-cyan-700 dark:text-cyan-200 border border-cyan-300/30"
                    : "text-slate-800 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/10")
                }
              >
                {t.modeProfessional}
              </button>

              <button
                type="button"
                onClick={() => setMode("personal")}
                className={
                  "rounded-xl px-3 py-1.5 text-xs sm:text-sm transition focus:outline-none focus:ring-2 focus:ring-cyan-400/50 " +
                  (mode === "personal"
                    ? "bg-orange-400/15 text-orange-700 dark:text-orange-200 border border-orange-300/25"
                    : "text-slate-800 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/10")
                }
              >
                {t.modePersonal}
              </button>
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2">
              <span className="text-xl leading-none">🌍</span>
              <span className="text-xs text-slate-700 dark:text-slate-200/80">
                {visibleTrips.length} {t.locationsLabel}
              </span>
            </div>
          </div>
        </div>

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

        <div className="mt-6 relative rounded-3xl border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-slate-900">
          <div className="relative h-[70vh] overflow-auto overscroll-contain sm:aspect-[16/9] sm:h-auto sm:overflow-hidden sm:overscroll-auto">
            <div className="relative min-w-[900px] sm:min-w-0 h-full">
              <MapBackground />

              {visibleTrips.map((p) => {
                const countryLabel = getCountryLabel(p, lang);
                const flag =
                  p.flag ||
                  countryToFlagEmoji(typeof p.country === "string" ? p.country : pickLang(p.country, "en"));
                const count = getModeExperienceCount(p, mode);
                const isSelected = selectedId === p.id;

                return (
                  <MapPoint
                    key={p.id}
                    x={p.x}
                    y={p.y}
                    label={pickTravelText(countryLabel, lang)}
                    subtitle={pickTravelText(p.city, lang)}
                    flag={flag}
                    count={count}
                    mode={mode}
                    canHover={canHover}
                    selected={isSelected}
                    onSelect={() => {
                      setDetailsOpen(false);
                      setSelectedId((cur) => (cur === p.id ? null : p.id));
                    }}
                    onOpenDetails={() => {
                      setSelectedId(p.id);
                      setDetailsOpen(true);
                    }}
                    detailsLabel={t.showDetails}
                    experiencesLabel={t.experiencesCountLabel}
                    className="will-change-transform"
                  />
                );
              })}
            </div>
          </div>

          <div className="sm:hidden flex items-center justify-between gap-3 border-t border-black/10 dark:border-white/10 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200/85">
              <span className="text-xl leading-none">🌍</span>
              <span>
                {visibleTrips.length} {t.locationsLabel}
              </span>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-300/70">{t.hint}</span>
          </div>
        </div>

        <Modal
          open={!!active && detailsOpen}
          onClose={() => {
            setDetailsOpen(false);
          }}
          title={
            active
              ? `${getCountryLabel(active, lang)} • ${pickTravelText(active.city, lang)} • ${pickTravelText(
                  active.date,
                  lang
                )}`
              : ""
          }
        >
          {active && (
            <div className="grid gap-4">
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

                {albumOpen && (active.photos || []).length > 0 && (
                  <div className="mt-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-950/10 p-3">
                    <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl" />
                        <div className="absolute -left-24 -bottom-24 h-60 w-60 rounded-full bg-indigo-400/10 blur-3xl" />
                      </div>

                      {active.photos?.[albumIndex]?.src ? (
                        <img
                          src={active.photos[albumIndex].src}
                          alt={pickTravelText(active.photos?.[albumIndex]?.caption, lang) || ""}
                          className="relative h-[42vh] sm:h-[52vh] w-full object-contain bg-black/10 dark:bg-black/20"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="relative h-[42vh] sm:h-[52vh] w-full bg-gradient-to-br from-cyan-400/10 via-white/5 to-indigo-400/10" />
                      )}

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
                        onClick={() => setAlbumIndex((i) => Math.min((active.photos?.length || 1) - 1, i + 1))}
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

                      <div className="absolute inset-x-0 bottom-0 bg-black/55 backdrop-blur-sm px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm text-white/90">
                            {pickTravelText(active.photos?.[albumIndex]?.caption, lang)}
                          </p>
                          <span className="text-xs text-white/70">
                            {albumIndex + 1}/{active.photos?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>

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
                                alt={pickTravelText(ph.caption, lang) || ""}
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

                        <div
                          className={
                            "grid gap-3 " +
                            (isDesktop ? "sm:grid-cols-2" : "grid-cols-1") +
                            " " +
                            (!isDesktop ? "sm:grid-cols-2" : "")
                          }
                        >
                          {windowPhotos.map((ph) => (
                            <PhotoTile key={ph.id} caption={pickTravelText(ph.caption, lang)} src={ph.src} />
                          ))}
                        </div>

                        {photos.length === 0 && (
                          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-950/10 p-4 text-sm text-slate-700 dark:text-slate-200/80">
                            {t.noPhotosYet}
                          </div>
                        )}

                        {photos.length > 0 && (
                          <div className="mt-2 flex items-center justify-end text-xs text-slate-600 dark:text-slate-300/70">
                            {t.showing} {start + 1}
                            {visibleCount > 1 ? `–${Math.min(start + visibleCount, photos.length)}` : ""} of{" "}
                            {photos.length}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {Array.isArray(active.experienceIds) && active.experienceIds.length > 0 && (
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
                  <div className="flex items-center gap-2">
                    <HiOutlineGlobeAlt className="h-5 w-5 text-cyan-600 dark:text-cyan-300/90" />
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.linkedExperiencesTitle}</p>
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
                            {pickTravelText(ex.organization, lang)}
                            {ex.city ? ` • ${pickTravelText(ex.city, lang)}` : ""}
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

              {/* Story and Highlights - Only show in Professional mode */}
              {mode === "professional" && (
                <>
                  <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
                    <div className="flex items-center gap-2">
                      <HiOutlineGlobeAlt className="h-5 w-5 text-cyan-600 dark:text-cyan-300/90" />
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.story}</p>
                    </div>
                    <p className="mt-3 text-sm text-slate-700 dark:text-slate-300/85 leading-relaxed">
                      {pickTravelText(active.story, lang)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
                    <div className="flex items-center gap-2">
                      <HiOutlineMapPin className="h-5 w-5 text-cyan-600 dark:text-cyan-300/90" />
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.highlights}</p>
                    </div>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                      {(active.highlights || []).map((h, idx) => (
                        <li
                          key={`${active.id}-h-${idx}`}
                          className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-950/10 px-3 py-2 text-sm text-slate-900 dark:text-slate-200/90"
                        >
                          <span className="inline-block mr-2 h-1.5 w-1.5 rounded-full bg-cyan-500/70 dark:bg-cyan-300/70 align-middle" />
                          {pickTravelText(h, lang)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setDetailsOpen(false)}
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

export function WorldMapSection() {
  return <WorldMapSectionImpl />;
}

export default WorldMapSection;