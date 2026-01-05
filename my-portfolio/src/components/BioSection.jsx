import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineCpuChip,
  HiOutlineMapPin,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineEnvelope,
  HiOutlineDocumentArrowDown,
} from "react-icons/hi2";
import { SiReact, SiDjango, SiTailwindcss, SiPython } from "react-icons/si";
import { HiOutlineGlobeAsiaAustralia } from "react-icons/hi2";

import profile from "../data/profile.json";
import about from "../data/about.json";

/**
 * BioSection (JSON-driven)
 * - Hero biography section
 * - Responsive
 * - Light/Dark friendly
 * - i18n-ready (EN/ES/JA/KO)
 * - Loads from src/data/profile.json & about.json
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

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const CTA_LABELS = {
  email: { en: "Email me", es: "Envíame un correo", ja: "メールする", ko: "이메일 보내기" },
  cv: { en: "Download CV", es: "Descargar CV", ja: "履歴書をダウンロード", ko: "이력서 다운로드" },
  projects: { en: "Explore projects", es: "Explorar proyectos", ja: "プロジェクトを見る", ko: "프로젝트 보기" }
};

const SOCIAL_ORDER = ["linkedin", "github", "instagram", "pexels", "platzi"];

// Helper for smooth scrolling to an element by id
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Stat({ k, v }) {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
      <div className="text-2xl font-semibold text-slate-900 dark:text-white">
        {k}
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300/80">
        {v}
      </div>
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-950/20 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100/90">
      {children}
    </span>
  );
}

export default function BioSection() {
  const lang = useAppLanguage();

  const tProfile = useMemo(() => profile, []);
  const tAbout = useMemo(() => about, []);

  // “headline” stays as a role line (smaller)
  const headline = pickLang(tProfile.headline, lang);
  const summary = pickLang(tAbout.summary, lang);

  const emailValue =
    tProfile?.contact?.emails?.[0]?.value || "fai@ahernandezt.com";

  const RightCard = (
    <div className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-24 bg-gradient-to-r from-cyan-400/0 via-cyan-400/14 to-indigo-400/0 blur-2xl"
      />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div></div>
          <div className="flex items-center gap-3">
            {SOCIAL_ORDER
              .map((key) => ({ key, s: tProfile.contact?.social?.[key] }))
              .filter(({ s }) => !!s)
              .map(({ key, s }) => (
                <a
                  key={key}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 w-11 overflow-hidden rounded-2xl border border-cyan-400/30 bg-white/80 dark:bg-slate-950/70 hover:scale-105 transition"
                  aria-label={key}
                >
                  <img
                    src={s.icon}
                    alt={key}
                    className="h-full w-full object-contain"
                    draggable={false}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </a>
              ))}
          </div>
        </div>

        {/* Smaller image area */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-slate-950/10 dark:bg-slate-950/20">
          <img
            src="/assets/images/profile2.jpeg"
            alt="Profile photo of Alonso Hernandez Tavera"
            className="aspect-[16/11] w-full object-cover"
            loading="eager"
            draggable={false}
          />
        </div>

        {/* Quick facts */}
        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-widest text-cyan-700 dark:text-cyan-200/70">
              {pickLang(tProfile.ui?.quickFactsTitle, lang)}
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-black/10 via-black/5 to-transparent dark:from-white/10 dark:via-white/5" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {(tProfile.quickFacts || []).slice(0, 3).map((q) => (
              <Stat
                key={q.id}
                k={pickLang(q.k, lang)}
                v={pickLang(q.v, lang)}
              />
            ))}
          </div>
        </div>

        {/* Visited countries */}
        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-widest text-cyan-700 dark:text-cyan-200/70">
              {pickLang(tProfile.ui?.visitedCountriesTitle, lang)}
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-black/10 via-black/5 to-transparent dark:from-white/10 dark:via-white/5" />
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xl">
            {(tProfile.visitedCountries || []).map((c) => (
              <span key={c.code} title={pickLang(c.name, lang)}>
                {c.emoji}
              </span>
            ))}
          </div>
        </div>

        {/* Stack */}
        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-widest text-cyan-700 dark:text-cyan-200/70">
              {pickLang(tProfile.ui?.stackTitle, lang)}
            </p>
            <button
              type="button"
              onClick={() => scrollToSection("skills")}
              className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-200/80 hover:underline underline-offset-4"
            >
              {pickLang(tProfile.ui?.showAll, lang)}
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3">
              <SiReact className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">React</p>
                <p className="text-xs text-slate-700 dark:text-slate-300/80">UI engineering</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3">
              <SiTailwindcss className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Tailwind</p>
                <p className="text-xs text-slate-700 dark:text-slate-300/80">Design systems</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3">
              <SiDjango className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Django</p>
                <p className="text-xs text-slate-700 dark:text-slate-300/80">APIs & auth</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3">
              <SiPython className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Python</p>
                <p className="text-xs text-slate-700 dark:text-slate-300/80">Robotics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 h-px bg-gradient-to-r from-cyan-400/0 via-cyan-400/35 to-indigo-400/0" />
    </div>
  );

  return (
    <div className="relative">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-8 -top-24 -z-10"
      >
        <div className="h-72 bg-gradient-to-r from-cyan-400/0 via-cyan-400/12 to-indigo-400/0 blur-2xl" />
        <div className="mt-6 h-40 bg-gradient-to-r from-indigo-400/0 via-indigo-400/10 to-cyan-400/0 blur-2xl" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        variants={fadeUp}
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left */}
          <div className="lg:col-span-7">
            {/* MAIN TITLE = YOUR NAME */}
            <h1 className="mt-9 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {pickLang(tProfile.fullName, lang)}
            </h1>

            {/* Roles/subtitle line */}
            <div className="hidden lg:grid mt-4 grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl">

              {/* Systems & Computer Engineer */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Systems & Computer Engineer
                </span>
                <img
                  src="/assets/images/highlight1.jpeg"
                  alt="Systems & Computer Engineering"
                  className="h-8 w-8 object-contain rounded-md"
                  draggable={false}
                />
              </div>

              {/* IT Coordinator */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3">
                <span className="text-sm text-slate-800 dark:text-slate-200">
                  Full-stack Engineer (Part Time, Remote)
                </span>
                <img
                  src="/assets/images/highlight2.png"
                  alt="IT Coordinator"
                  className="h-8 w-8 object-contain rounded-md"
                  draggable={false}
                />
              </div>

              {/* Seoul National University Alumni */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3">
                <span className="text-sm text-slate-800 dark:text-slate-200">
                  Seoul National University Alumni
                </span>
                <img
                  src="/assets/images/highlight3.jpeg"
                  alt="Seoul National University Alumni"
                  className="h-8 w-8 object-contain rounded-md"
                  draggable={false}
                />
              </div>
            </div>

            {/* Right card (mobile) */}
            <div className="mt-6 lg:hidden">{RightCard}</div>

            {/* Bio summary */}
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-700 dark:text-slate-300/90 leading-relaxed text-justify">
              {summary}
            </p>

            {/* Location + themes */}
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-slate-800 dark:text-slate-200/85">
                <HiOutlineMapPin className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                {pickLang(tProfile.location, lang)}
              </span>
            </div>

            {/* CTA */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${emailValue}`}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 px-4 py-2.5 text-sm font-semibold text-cyan-700 dark:text-cyan-100 ring-1 ring-cyan-300/30 hover:bg-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
              >
                <HiOutlineEnvelope className="h-5 w-5" />
                {pickLang(CTA_LABELS.email, lang)}
              </a>

              <a
                href="/cv.pdf"
                className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <HiOutlineDocumentArrowDown className="h-5 w-5" />
                {pickLang(CTA_LABELS.cv, lang)}
              </a>

              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <HiOutlineArrowTopRightOnSquare className="h-5 w-5" />
                {pickLang(CTA_LABELS.projects, lang)}
              </a>
            </div>



            {/* Focus */}
            <div className="mt-8">
              <div className="flex items-center gap-3">
                <HiOutlineCpuChip className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                <h3 className="text-sm font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-200/80">
                  {pickLang(tProfile.ui?.currentFocusTitle, lang) || "Current focus"}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-black/10 via-black/5 to-transparent dark:from-white/10 dark:via-white/5" />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {((tProfile.currentFocus && tProfile.currentFocus.length > 0)
                  ? tProfile.currentFocus
                  : (tAbout.highlights || []).slice(0, 2).map((f) => ({ id: f.key, text: f.text }))
                ).slice(0, 2).map((f) => (
                  <div
                    key={f.id}
                    className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5"
                  >
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      {pickLang(f.text, lang)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Currently Working On */}
            <div className="mt-8">
              <div className="flex items-center gap-3">
                <HiOutlineCpuChip className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                <h3 className="text-sm font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-200/80">
                  {pickLang(tProfile.ui?.currentlyWorkingOnTitle, lang) || "Currently Working On"}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-black/10 via-black/5 to-transparent dark:from-white/10 dark:via-white/5" />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(
                  (tProfile.currentlyWorkingOn && tProfile.currentlyWorkingOn.length > 0)
                    ? tProfile.currentlyWorkingOn
                    : [
                        {
                          id: "robotics",
                          title: { en: "Robotics & Humanoid Systems Research" },
                          description: { en: "Control, perception, and embodied intelligence" }
                        },
                        {
                          id: "fullstack",
                          title: { en: "Full‑stack Web Platforms" },
                          description: { en: "React, Django, dashboards & scalable systems" }
                        }
                      ]
                ).slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5"
                  >
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      {pickLang(item.title, lang)}
                    </p>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300/85">
                      {pickLang(item.description, lang)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-5">
            <div className="hidden lg:block">{RightCard}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}