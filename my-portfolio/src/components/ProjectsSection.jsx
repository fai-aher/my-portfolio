import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineRocketLaunch,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineStar,
} from "react-icons/hi2";

import ProjectCard from "./ProjectCard.jsx";

/**
 * ProjectsSection
 * - Responsive (mobile-first)
 * - Correct light/dark theming
 * - i18n-ready (EN/ES/JA/KO)
 * - Data-ready (swap PLACEHOLDER_PROJECTS with projects.json later)
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
    title: "Projects",
    subtitle:
      "A selection of product-grade web apps and experiments — built with a robotics mindset: clarity, reliability, and elegant interfaces.",
    featured: "Featured",
    filtersTitle: "Filter",
    filters: {
      all: "All",
      web: "Web Apps",
      robotics: "Robotics",
      research: "Research",
      design: "UI/Design",
    },
    empty: "No projects match this filter (yet).",
  },
  es: {
    title: "Proyectos",
    subtitle:
      "Una selección de apps web de nivel producto y experimentos — con mentalidad robótica: claridad, confiabilidad e interfaces elegantes.",
    featured: "Destacado",
    filtersTitle: "Filtrar",
    filters: {
      all: "Todo",
      web: "Apps Web",
      robotics: "Robótica",
      research: "Investigación",
      design: "UI/Diseño",
    },
    empty: "Aún no hay proyectos con este filtro.",
  },
  ja: {
    title: "プロジェクト",
    subtitle:
      "プロダクト品質のWebアプリと実験作品。ロボット的発想で：明確さ、信頼性、美しいUI。",
    featured: "注目",
    filtersTitle: "フィルター",
    filters: {
      all: "すべて",
      web: "Webアプリ",
      robotics: "ロボティクス",
      research: "研究",
      design: "UI/デザイン",
    },
    empty: "このフィルターに一致するプロジェクトはまだありません。",
  },
  ko: {
    title: "프로젝트",
    subtitle:
      "프로덕트 수준의 웹앱과 실험 프로젝트들 — 로보틱스 마인드로: 명확함, 신뢰성, 세련된 UI.",
    featured: "대표",
    filtersTitle: "필터",
    filters: {
      all: "전체",
      web: "웹앱",
      robotics: "로보틱스",
      research: "연구",
      design: "UI/디자인",
    },
    empty: "이 필터에 해당하는 프로젝트가 아직 없습니다.",
  },
};

// Placeholder projects — replace with import from ../data/projects.json later
const PLACEHOLDER_PROJECTS = [
  {
    id: "seed-platform",
    category: "web",
    featured: true,
    subtitle: "Full‑stack platform",
    title: "SEED Alumni Collaboration Hub",
    description:
      "Role-based web platform to manage events, missions, reports, and media — designed for smooth collaboration and review workflows.",
    tags: ["Auth", "Dashboards", "Reports", "Collaboration"],
    stack: ["react", "tailwind", "django"],
    images: [
      { id: "seed-1", caption: "Dashboard overview" },
      { id: "seed-2", caption: "Report reader modal" },
    ],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: "robot-portfolio",
    category: "design",
    featured: false,
    subtitle: "Portfolio / design system",
    title: "Neon Robotics Portfolio",
    description:
      "A futuristic, responsive portfolio with i18n, dark/light mode, micro-interactions, and an interactive travel map.",
    tags: ["i18n", "Animations", "Responsive", "Brand"],
    stack: ["react", "tailwind"],
    images: [{ id: "p-1", caption: "Hero section" }],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: "robotics-lab-notes",
    category: "research",
    featured: false,
    subtitle: "Research notes",
    title: "Robotics Research Roadmap",
    description:
      "A structured learning and research space for autonomy, perception, motion planning, and HRI — with visual summaries and reading lists.",
    tags: ["HRI", "Autonomy", "Perception"],
    stack: ["react", "tailwind"],
    images: [{ id: "r-1", caption: "Roadmap board" }],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: "teaching-game",
    category: "robotics",
    featured: false,
    subtitle: "Teaching tool",
    title: "PixelQuest — Learn Python with Games",
    description:
      "A mini game framework to teach Python fundamentals through game mechanics, sprites, and interactive challenges.",
    tags: ["Python", "Education", "Game dev"],
    stack: ["python"],
    images: [{ id: "g-1", caption: "Sprite world" }],
    liveUrl: "#",
    repoUrl: "#",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

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

export default function ProjectsSection() {
  const lang = useAppLanguage();
  const t = useMemo(() => UI[lang] || UI.en, [lang]);

  const [filter, setFilter] = useState("all");

  const projects = PLACEHOLDER_PROJECTS;

  const featured = useMemo(() => projects.find((p) => p.featured) || null, [projects]);

  const filtered = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((p) => p.category === filter);
  }, [projects, filter]);

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
                <HiOutlineRocketLaunch className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
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
            <HiOutlineAdjustmentsHorizontal className="h-5 w-5 text-cyan-600 dark:text-cyan-300/90" />
            <span className="text-xs text-slate-700 dark:text-slate-200/80">
              {filtered.length} items
            </span>
          </div>
        </div>

        {/* Featured */}
        {featured && (
          <div className="mt-8">
            <div className="flex items-center gap-3">
              <HiOutlineStar className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
              <h3 className="text-sm font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-200/80">
                {t.featured}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-black/10 via-black/5 to-transparent dark:from-white/10 dark:via-white/5" />
            </div>

            <div className="mt-4">
              <ProjectCard {...featured} />
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300/70 mr-1">
            {t.filtersTitle}:
          </span>
          <FilterPill label={t.filters.all} active={filter === "all"} onClick={() => setFilter("all")} />
          <FilterPill label={t.filters.web} active={filter === "web"} onClick={() => setFilter("web")} />
          <FilterPill label={t.filters.robotics} active={filter === "robotics"} onClick={() => setFilter("robotics")} />
          <FilterPill label={t.filters.research} active={filter === "research"} onClick={() => setFilter("research")} />
          <FilterPill label={t.filters.design} active={filter === "design"} onClick={() => setFilter("design")} />
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 text-slate-700 dark:text-slate-300/85">
              {t.empty}
            </div>
          ) : (
            filtered
              .filter((p) => !p.featured)
              .map((p) => <ProjectCard key={p.id} {...p} />)
          )}
        </div>

        {/* Mobile counter */}
        <div className="mt-6 sm:hidden">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2">
            <HiOutlineAdjustmentsHorizontal className="h-5 w-5 text-cyan-600 dark:text-cyan-300/90" />
            <span className="text-xs text-slate-700 dark:text-slate-200/80">
              {filtered.length} items
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}