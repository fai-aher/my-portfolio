import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineCommandLine,
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlineLanguage,
  HiOutlineFunnel,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";

import SkillLogo from "./SkillLogo.jsx";
import skillsData from "../data/skills.json";

function pickLang(value, lang) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || Object.values(value)[0] || "";
}

function yearsUsedText(sinceYear) {
  const y = Number(sinceYear);
  if (!y || Number.isNaN(y)) return "";
  const now = new Date();
  const years = now.getFullYear() - y;
  if (years <= 0) return "< 1 year";
  if (years === 1) return "1+ year";
  return `${years}+ years`;
}

function accentClasses(accent) {
  switch (accent) {
    case "cyan":
      return {
        ring: "hover:ring-cyan-400/50",
        glow: "hover:shadow-[0_0_35px_rgba(34,211,238,0.25)]",
        line: "bg-cyan-400/70",
        chip: "bg-cyan-400/10 text-cyan-200 border-cyan-300/20",
      };
    case "sky":
      return {
        ring: "hover:ring-sky-400/50",
        glow: "hover:shadow-[0_0_35px_rgba(56,189,248,0.22)]",
        line: "bg-sky-400/70",
        chip: "bg-sky-400/10 text-sky-200 border-sky-300/20",
      };
    case "emerald":
      return {
        ring: "hover:ring-emerald-400/50",
        glow: "hover:shadow-[0_0_35px_rgba(52,211,153,0.18)]",
        line: "bg-emerald-400/70",
        chip: "bg-emerald-400/10 text-emerald-200 border-emerald-300/20",
      };
    case "amber":
      return {
        ring: "hover:ring-amber-400/50",
        glow: "hover:shadow-[0_0_35px_rgba(251,191,36,0.18)]",
        line: "bg-amber-400/70",
        chip: "bg-amber-400/10 text-amber-200 border-amber-300/20",
      };
    case "violet":
      return {
        ring: "hover:ring-violet-400/50",
        glow: "hover:shadow-[0_0_35px_rgba(167,139,250,0.18)]",
        line: "bg-violet-400/70",
        chip: "bg-violet-400/10 text-violet-200 border-violet-300/20",
      };
    case "indigo":
      return {
        ring: "hover:ring-indigo-400/50",
        glow: "hover:shadow-[0_0_35px_rgba(129,140,248,0.18)]",
        line: "bg-indigo-400/70",
        chip: "bg-indigo-400/10 text-indigo-200 border-indigo-300/20",
      };
    case "rose":
      return {
        ring: "hover:ring-rose-400/50",
        glow: "hover:shadow-[0_0_35px_rgba(251,113,133,0.18)]",
        line: "bg-rose-400/70",
        chip: "bg-rose-400/10 text-rose-200 border-rose-300/20",
      };
    case "orange":
      return {
        ring: "hover:ring-orange-400/50",
        glow: "hover:shadow-[0_0_35px_rgba(251,146,60,0.18)]",
        line: "bg-orange-400/70",
        chip: "bg-orange-400/10 text-orange-200 border-orange-300/20",
      };
    case "blue":
      return {
        ring: "hover:ring-blue-400/50",
        glow: "hover:shadow-[0_0_35px_rgba(96,165,250,0.18)]",
        line: "bg-blue-400/70",
        chip: "bg-blue-400/10 text-blue-200 border-blue-300/20",
      };
    case "yellow":
      return {
        ring: "hover:ring-yellow-400/50",
        glow: "hover:shadow-[0_0_35px_rgba(250,204,21,0.16)]",
        line: "bg-yellow-400/70",
        chip: "bg-yellow-400/10 text-yellow-200 border-yellow-300/20",
      };
    case "green":
      return {
        ring: "hover:ring-green-400/50",
        glow: "hover:shadow-[0_0_35px_rgba(74,222,128,0.16)]",
        line: "bg-green-400/70",
        chip: "bg-green-400/10 text-green-200 border-green-300/20",
      };
    case "red":
      return {
        ring: "hover:ring-red-400/50",
        glow: "hover:shadow-[0_0_35px_rgba(248,113,113,0.16)]",
        line: "bg-red-400/70",
        chip: "bg-red-400/10 text-red-200 border-red-300/20",
      };
    case "pink":
      return {
        ring: "hover:ring-pink-400/50",
        glow: "hover:shadow-[0_0_35px_rgba(244,114,182,0.16)]",
        line: "bg-pink-400/70",
        chip: "bg-pink-400/10 text-pink-200 border-pink-300/20",
      };
    case "teal":
      return {
        ring: "hover:ring-teal-400/50",
        glow: "hover:shadow-[0_0_35px_rgba(45,212,191,0.16)]",
        line: "bg-teal-400/70",
        chip: "bg-teal-400/10 text-teal-200 border-teal-300/20",
      };
    default:
      return {
        ring: "hover:ring-cyan-400/40",
        glow: "hover:shadow-[0_0_35px_rgba(34,211,238,0.18)]",
        line: "bg-cyan-400/60",
        chip: "bg-cyan-400/10 text-cyan-200 border-cyan-300/20",
      };
  }
}

const TECH_PAGE_SIZE = 6;

const FILTERS = [
  { key: "all", label: "All" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "robotics", label: "Robotics" },
  { key: "language", label: "Programming language" },
  { key: "framework", label: "Frameworks" },
  { key: "tool", label: "Tools" },
  { key: "cloud", label: "Cloud/DevOps" },
  { key: "database", label: "Databases" },
  { key: "design", label: "Design" },
];

// Temporary categorization until we add categories into skills.json.
// We will later remove this and read `t.categories` directly from JSON.
function getTechCategories(techKey) {
  const k = String(techKey || "").toLowerCase();

  const map = {
    linux: ["tool", "cloud", "robotics"],

    react: ["frontend", "framework"],
    angular: ["frontend", "framework"],
    tailwind: ["frontend", "tool"],
    vite: ["frontend", "tool"],

    django: ["backend", "framework"],
    nestjs: ["backend", "framework"],
    fastapi: ["backend", "framework"],
    springboot: ["backend", "framework"],

    python: ["language"],
    javascript: ["language"],
    html: ["language", "frontend"],
    css: ["language", "frontend"],

    ros: ["robotics", "tool"],

    postman: ["tool", "backend"],

    sql: ["language", "database"],
    postgresql: ["database"],
    mysql: ["database"],
    oracle: ["database"],

    auth0: ["backend", "tool"],
    jwt: ["backend", "tool"],

    aws: ["cloud", "tool"],
    digitalocean: ["cloud", "tool"],
    heroku: ["cloud", "tool"],

    wordpress: ["frontend", "tool"],

    scikitlearn: ["backend", "tool"],
    figma: ["design", "tool"],
  };

  if (map[k]) return map[k];

  // Fallback heuristics
  if (["python", "javascript"].includes(k)) return ["language"];
  if (["react", "angular"].includes(k)) return ["frontend", "framework"];
  return ["tool"]; // safe default
}

function matchesFilter(tech, activeFilter) {
  if (!activeFilter || activeFilter === "all") return true;
  const cats = getTechCategories(tech?.key);
  return cats.includes(activeFilter);
}

export default function SkillsSection() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  const [activeFilter, setActiveFilter] = useState("all");
  const [techPage, setTechPage] = useState(1);

  useEffect(() => {
    const handler = () => setLang(localStorage.getItem("lang") || "en");
    window.addEventListener("app:languageChanged", handler);
    return () => window.removeEventListener("app:languageChanged", handler);
  }, []);

  const technologies = skillsData?.technologies || [];
  const hardSkills = skillsData?.hardSkills || [];
  const softSkills = skillsData?.softSkills || [];
  const languageSkills = skillsData?.languageSkills || [];

  const sortedTechnologies = useMemo(() => {
    const arr = [...technologies];
    arr.sort((a, b) => {
      if (a.key === "linux") return -1;
      if (b.key === "linux") return 1;
      return (Number(b.sinceYear) || 0) - (Number(a.sinceYear) || 0);
    });
    return arr;
  }, [technologies]);

  const filteredTechnologies = useMemo(() => {
    return sortedTechnologies.filter((t) => matchesFilter(t, activeFilter));
  }, [sortedTechnologies, activeFilter]);

  const techTotalPages = useMemo(() => {
    const total = Math.ceil(filteredTechnologies.length / TECH_PAGE_SIZE);
    return Math.max(1, total);
  }, [filteredTechnologies.length]);

  const pagedTechnologies = useMemo(() => {
    const startIdx = (techPage - 1) * TECH_PAGE_SIZE;
    return filteredTechnologies.slice(startIdx, startIdx + TECH_PAGE_SIZE);
  }, [filteredTechnologies, techPage]);

  // Reset to page 1 whenever filter changes.
  useEffect(() => {
    setTechPage(1);
  }, [activeFilter]);

  // Clamp page if the filtered list shrinks.
  useEffect(() => {
    setTechPage((p) => Math.min(Math.max(1, p), techTotalPages));
  }, [techTotalPages]);

  return (
    <section id="skills" className="scroll-mt-28">
      <div className="mx-auto max-w-8xl px-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <HiOutlineCommandLine className="h-4 w-4 text-cyan-300/90" />
                <span className="text-xs tracking-wide text-white/70">
                  Skills
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Technologies & Tools
              </h2>

              <p className="mt-2 max-w-2xl text-sm text-white/70">
                Hover a card to reveal details. Instead of progress bars, each
                skill shows the time I’ve used it.
              </p>
            </div>
          </div>

          {/* Technologies */}
          <div className="mt-7">
            {/* Filters + pagination header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-white/70">
                <HiOutlineFunnel className="h-4 w-4 text-cyan-300/90" />
                <span>Filter:</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => {
                  const active = activeFilter === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setActiveFilter(f.key)}
                      className={
                        "rounded-full border px-3 py-1 text-xs transition " +
                        (active
                          ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-100"
                          : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/7")
                      }
                      aria-pressed={active}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <div className="text-xs text-white/60">
                  {filteredTechnologies.length} shown
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTechPage((p) => Math.max(1, p - 1))}
                    disabled={techPage <= 1}
                    className={
                      "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition " +
                      (techPage <= 1
                        ? "cursor-not-allowed border-white/10 bg-white/5 text-white/30"
                        : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/7")
                    }
                    aria-label="Previous page"
                  >
                    <HiChevronLeft className="h-4 w-4" />
                    Prev
                  </button>

                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                    Page {techPage} / {techTotalPages}
                  </div>

                  <button
                    type="button"
                    onClick={() => setTechPage((p) => Math.min(techTotalPages, p + 1))}
                    disabled={techPage >= techTotalPages}
                    className={
                      "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition " +
                      (techPage >= techTotalPages
                        ? "cursor-not-allowed border-white/10 bg-white/5 text-white/30"
                        : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/7")
                    }
                    aria-label="Next page"
                  >
                    Next
                    <HiChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pagedTechnologies.map((t) => {
                const a = accentClasses(t.accent);
                const duration = yearsUsedText(t.sinceYear);
                const details = pickLang(t.details, lang);

                return (
                  <motion.div
                    key={t.key}
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className={
                      "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/6 to-white/3 p-5 ring-1 ring-transparent " +
                      a.ring +
                      " " +
                      a.glow
                    }
                  >
                    <div className={"absolute inset-x-0 top-0 h-[2px] " + a.line} />

                    <div className="flex items-start gap-4">
                      <SkillLogo src={t.logo} alt={t.label} />

                      <div className="min-w-0 flex-1">
                        <div className="grid grid-cols-[1fr_auto] items-start gap-3">
                          <h3 className="text-base font-semibold leading-snug text-white break-words">
                            {t.label}
                          </h3>

                          <span
                            className={
                              "shrink-0 rounded-full border px-2 py-0.5 text-[11px] whitespace-nowrap " +
                              a.chip
                            }
                          >
                            Since {t.sinceYear}
                          </span>
                        </div>

                        <div className="mt-1 text-xs text-white/60">
                          {duration && <span>{duration}</span>}
                        </div>

                        {details && (
                          <p className="mt-3 text-sm leading-relaxed text-white/70">
                            {details}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* hover wash */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                      <div className="absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                    </div>
                  </motion.div>
                );
              })}

              {pagedTechnologies.length === 0 && (
                <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
                  No technologies match this filter yet.
                </div>
              )}
            </div>

            {/* Bottom pagination (only if needed) */}
            {techTotalPages > 1 && (
              <div className="mt-5 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setTechPage((p) => Math.max(1, p - 1))}
                  disabled={techPage <= 1}
                  className={
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition " +
                    (techPage <= 1
                      ? "cursor-not-allowed border-white/10 bg-white/5 text-white/30"
                      : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/7")
                  }
                >
                  <HiChevronLeft className="h-4 w-4" />
                  Prev
                </button>

                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  Page {techPage} / {techTotalPages}
                </div>

                <button
                  type="button"
                  onClick={() => setTechPage((p) => Math.min(techTotalPages, p + 1))}
                  disabled={techPage >= techTotalPages}
                  className={
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition " +
                    (techPage >= techTotalPages
                      ? "cursor-not-allowed border-white/10 bg-white/5 text-white/30"
                      : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/7")
                  }
                >
                  Next
                  <HiChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Hard / Soft (symmetric) */}
          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2">
                <HiOutlineSparkles className="h-5 w-5 text-cyan-300/90" />
                <h3 className="text-base font-semibold text-white">
                  Hard Skills
                </h3>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {hardSkills.map((s) => (
                  <div
                    key={s}
                    className="rounded-xl border border-white/10 bg-white/3 px-3 py-2 text-sm text-white/75"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2">
                <HiOutlineUserGroup className="h-5 w-5 text-cyan-300/90" />
                <h3 className="text-base font-semibold text-white">
                  Soft Skills
                </h3>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {softSkills.map((s) => (
                  <div
                    key={s}
                    className="rounded-xl border border-white/10 bg-white/3 px-3 py-2 text-sm text-white/75"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Language Skills (4 columns) */}
          <div className="mt-10">
            <div className="flex items-center gap-2">
              <HiOutlineLanguage className="h-5 w-5 text-cyan-300/90" />
              <h3 className="text-base font-semibold text-white">
                Language Skills
              </h3>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {languageSkills.map((l) => (
                <motion.div
                  key={l.key}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 hover:ring-1 hover:ring-cyan-400/40 hover:shadow-[0_0_35px_rgba(34,211,238,0.18)]"
                >
                  {/* flag background (low opacity) */}
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -right-6 -top-6 text-7xl opacity-[0.12] blur-[0.2px]">
                      {l.flagEmoji}
                    </div>
                    <div className="absolute -left-6 -bottom-8 text-7xl opacity-[0.10] blur-[0.2px]">
                      {l.flagEmoji}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-base font-semibold text-white">
                          {l.name}
                        </h4>
                        <p className="mt-1 text-xs text-white/60">
                          {l.startedYear ? `Started ${l.startedYear}` : "Started —"}
                        </p>
                      </div>

                      <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2 py-0.5 text-[22px] text-cyan-200">
                        {l.flagEmoji}
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl border border-white/10 bg-white/3 px-3 py-3">
                      <div className="text-[22px] font-semibold leading-none tracking-tight text-white">
                        {l.level}
                      </div>

                      {Array.isArray(l.tests) && l.tests.length > 0 && (
                        <div className="mt-3 space-y-1 text-xs text-white/70">
                          {l.tests.map((t) => (
                            <div
                              key={t.name}
                              className="flex items-center justify-between gap-2"
                            >
                              <span className="truncate">{t.name}</span>
                              <span className="shrink-0 text-white/60">
                                {t.result || "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}