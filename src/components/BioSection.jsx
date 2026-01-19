import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineCpuChip,
  HiOutlineMapPin,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineEnvelope,
  HiOutlineDocumentArrowDown,
  HiOutlineXMark,
  HiOutlineClipboardDocument,
  HiOutlineCheck,
  HiOutlineDocumentText,
} from "react-icons/hi2";

import profile from "../data/profile.json";
import about from "../data/about.json";
import skillsData from "../data/skills.json";
import TechIcon from "./TechIcon.jsx";

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
  contact: { en: "Contact me", es: "Contáctame", ja: "連絡する", ko: "연락하기" },
  cv: { en: "View CV in PDF", es: "Ver CV en PDF", ja: "PDFで履歴書を見る", ko: "PDF로 이력서 보기" },
  projects: { en: "Explore projects", es: "Explorar proyectos", ja: "プロジェクトを見る", ko: "프로젝트 보기" }
};

const HIGHLIGHT_LABELS = {
  systemsEngineer: {
    en: "Systems & Computer Engineer",
    es: "Ingeniero de Sistemas y Computación",
    ja: "システム・コンピュータ工学士",
    ko: "시스템 및 컴퓨터 공학사"
  },
  fullStackEngineer: {
    en: "Full-stack Engineer (Part Time, Remote)",
    es: "Ingeniero Full-stack (Medio Tiempo, Remoto)",
    ja: "フルスタックエンジニア（パートタイム・リモート）",
    ko: "풀스택 엔지니어 (파트타임, 원격)"
  },
  snuAlumni: {
    en: "Seoul National University Alumni",
    es: "Alumni de la Universidad Nacional de Seúl",
    ja: "ソウル大学校卒業生",
    ko: "서울대학교 동문"
  }
};

const CONTACT_MODAL_LABELS = {
  title: { en: "Let's work together!", es: "Trabajemos juntos!", ja: "一緒に働きましょう！", ko: "함께 일해요!" },
  description: {
    en: {
      before: "Contact me if you are interested in my profile and have a ",
      jobOffer: "job offer",
      middle: " or if you have a ",
      project: "project",
      after: " you would like us to work on together."
    },
    es: {
      before: "Contáctame si estás interesado en mi perfil y tienes una ",
      jobOffer: "oferta de trabajo",
      middle: " o si tienes un ",
      project: "proyecto",
      after: " en el que te gustaría que trabajáramos juntos."
    },
    ja: {
      before: "私のプロフィールに興味があり、",
      jobOffer: "求人",
      middle: "がある場合、または一緒に取り組みたい",
      project: "プロジェクト",
      after: "がある場合は、ぜひご連絡ください。"
    },
    ko: {
      before: "제 프로필에 관심이 있고 ",
      jobOffer: "채용 제안",
      middle: "이 있거나, 함께 작업하고 싶은 ",
      project: "프로젝트",
      after: "가 있다면 연락해 주세요."
    }
  },
  primaryEmail: { en: "Primary email", es: "Correo principal", ja: "メインメール", ko: "기본 이메일" },
  alternativeEmail: { en: "Alternative email", es: "Correo alternativo", ja: "サブメール", ko: "대체 이메일" },
  linkedinButton: { en: "Send me a message through LinkedIn", es: "Envíame un mensaje por LinkedIn", ja: "LinkedInでメッセージを送る", ko: "LinkedIn으로 메시지 보내기" },
  close: { en: "Close", es: "Cerrar", ja: "閉じる", ko: "닫기" },
  copied: { en: "Copied!", es: "¡Copiado!", ja: "コピーしました！", ko: "복사됨!" }
};

// Priority skills that must be included in the top 6
const PRIORITY_SKILLS = ["python", "ros", "scikitlearn"];

// Get top 6 skills by years of experience, ensuring priority skills are included
function getTopSkills(technologies, currentYear = new Date().getFullYear()) {
  const sortedByYears = [...technologies]
    .map(t => ({ ...t, years: currentYear - t.sinceYear }))
    .sort((a, b) => b.years - a.years);

  const prioritySkills = sortedByYears.filter(t => PRIORITY_SKILLS.includes(t.key));
  const otherSkills = sortedByYears.filter(t => !PRIORITY_SKILLS.includes(t.key));

  // Fill remaining slots with top non-priority skills
  const remainingSlots = 6 - prioritySkills.length;
  const topOthers = otherSkills.slice(0, remainingSlots);

  // Combine and sort by years again
  return [...prioritySkills, ...topOthers].sort((a, b) => b.years - a.years);
}

const SOCIAL_ORDER = ["linkedin", "github", "instagram", "pexels", "platzi"];

// Helper for smooth scrolling to an element by id
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Stat({ k, v }) {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-3 sm:p-4">
      <div className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-white break-words">
        {k}
      </div>
      <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-wide sm:tracking-widest text-slate-700 dark:text-slate-300/80 break-words">
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

function HighlightCardWithTooltip({ title, subtitle, imageSrc, imageAlt, children }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10"
          >
            <div className="whitespace-nowrap rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:text-white shadow-lg">
              {title}
              {subtitle && <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">{subtitle}</div>}
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white dark:border-t-slate-900" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactModal({ isOpen, onClose, lang, emails, linkedinUrl }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = async (email, index) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 20 }}
            className="absolute left-1/2 top-1/2 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {pickLang(CONTACT_MODAL_LABELS.title, lang)}
              </h2>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/15 px-3 py-2 text-sm font-semibold text-cyan-800 dark:text-cyan-200 ring-1 ring-cyan-300/30 hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <HiOutlineXMark className="h-5 w-5" />
                <span className="hidden sm:inline">{pickLang(CONTACT_MODAL_LABELS.close, lang)}</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Description */}
              <p className="text-sm text-slate-700 dark:text-slate-300/90 text-justify leading-relaxed">
                {CONTACT_MODAL_LABELS.description[lang]?.before || CONTACT_MODAL_LABELS.description.en.before}
                <span className="font-semibold text-cyan-600 dark:text-cyan-300">
                  {CONTACT_MODAL_LABELS.description[lang]?.jobOffer || CONTACT_MODAL_LABELS.description.en.jobOffer}
                </span>
                {CONTACT_MODAL_LABELS.description[lang]?.middle || CONTACT_MODAL_LABELS.description.en.middle}
                <span className="font-semibold text-cyan-600 dark:text-cyan-300">
                  {CONTACT_MODAL_LABELS.description[lang]?.project || CONTACT_MODAL_LABELS.description.en.project}
                </span>
                {CONTACT_MODAL_LABELS.description[lang]?.after || CONTACT_MODAL_LABELS.description.en.after}
              </p>

              {/* Primary Email */}
              <div>
                <p className="text-xs uppercase tracking-widest text-cyan-700 dark:text-cyan-200/70 mb-2">
                  {pickLang(CONTACT_MODAL_LABELS.primaryEmail, lang)}
                </p>
                <div className="flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3">
                  <HiOutlineEnvelope className="h-5 w-5 text-cyan-600 dark:text-cyan-300 shrink-0" />
                  <span className="flex-1 text-sm text-slate-900 dark:text-slate-100 truncate">
                    {emails[0]?.value}
                  </span>
                  <button
                    onClick={() => handleCopy(emails[0]?.value, 0)}
                    className="shrink-0 p-2 rounded-lg hover:bg-cyan-500/10 transition-colors"
                    aria-label="Copy email"
                  >
                    {copiedIndex === 0 ? (
                      <HiOutlineCheck className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <HiOutlineClipboardDocument className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                    )}
                  </button>
                </div>
                {copiedIndex === 0 && (
                  <p className="text-xs text-emerald-500 mt-1">{pickLang(CONTACT_MODAL_LABELS.copied, lang)}</p>
                )}
              </div>

              {/* Alternative Email */}
              {emails[1] && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-cyan-700 dark:text-cyan-200/70 mb-2">
                    {pickLang(CONTACT_MODAL_LABELS.alternativeEmail, lang)}
                  </p>
                  <div className="flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3">
                    <HiOutlineEnvelope className="h-5 w-5 text-cyan-600 dark:text-cyan-300 shrink-0" />
                    <span className="flex-1 text-sm text-slate-900 dark:text-slate-100 truncate">
                      {emails[1]?.value}
                    </span>
                    <button
                      onClick={() => handleCopy(emails[1]?.value, 1)}
                      className="shrink-0 p-2 rounded-lg hover:bg-cyan-500/10 transition-colors"
                      aria-label="Copy email"
                    >
                      {copiedIndex === 1 ? (
                        <HiOutlineCheck className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <HiOutlineClipboardDocument className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                      )}
                    </button>
                  </div>
                  {copiedIndex === 1 && (
                    <p className="text-xs text-emerald-500 mt-1">{pickLang(CONTACT_MODAL_LABELS.copied, lang)}</p>
                  )}
                </div>
              )}

              {/* LinkedIn Button */}
              <div className="pt-2">
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 w-full rounded-xl bg-cyan-500/20 px-4 py-3 text-sm font-semibold text-cyan-700 dark:text-cyan-100 ring-1 ring-cyan-300/30 hover:bg-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition-colors"
                >
                  <img
                    src="/assets/icons/linkedin.png"
                    alt="LinkedIn"
                    className="h-5 w-5 object-contain"
                  />
                  {pickLang(CONTACT_MODAL_LABELS.linkedinButton, lang)}
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function BioSection() {
  const lang = useAppLanguage();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Listen for global event to open contact modal (from Header or Footer)
  useEffect(() => {
    const handleOpenContact = () => setIsContactModalOpen(true);
    window.addEventListener("app:openContactModal", handleOpenContact);
    return () => window.removeEventListener("app:openContactModal", handleOpenContact);
  }, []);

  const tProfile = useMemo(() => profile, []);
  const tAbout = useMemo(() => about, []);

  // Compute top 6 skills
  const topSkills = useMemo(() => getTopSkills(skillsData.technologies), []);

  // "headline" stays as a role line (smaller)
  const headline = pickLang(tProfile.headline, lang);
  const summary = pickLang(tAbout.summary, lang);

  const emails = tProfile?.contact?.emails || [];
  const linkedinUrl = tProfile?.contact?.social?.linkedin?.url || "https://www.linkedin.com/in/a-hernandezt/";

  const RightCard = (
    <div className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-slate-200 dark:bg-white/5 p-5">
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
          <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
            {(tProfile.quickFacts || []).slice(0, 3).map((q) => (
              <Stat
                key={q.id}
                k={pickLang(q.k, lang)}
                v={pickLang(q.v, lang)}
              />
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
            {topSkills.map((skill) => (
              <div
                key={skill.key}
                className="flex items-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3"
              >
                <div className="shrink-0">
                  <TechIcon
                    iconSlug={skill.iconSlug}
                    logo={skill.logo}
                    alt={skill.label}
                    size="sm"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {skill.label}
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300/80 truncate">
                    {pickLang(skill.shortDesc, lang) || pickLang(skill.details, lang)}
                  </p>
                </div>
              </div>
            ))}
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
        viewport={{ once: true, amount: 0.1 }}
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
              <HighlightCardWithTooltip
                title={lang === "en" ? "Los Andes University" : lang === "es" ? "Universidad de los Andes" : lang === "ja" ? "ロス・アンデス大学" : "로스 안데스 대학교"}
                subtitle={lang === "en" ? "Bogotá, Colombia" : lang === "es" ? "Bogotá, Colombia" : lang === "ja" ? "コロンビア・ボゴタ" : "콜롬비아 보고타"}
              >
                <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 cursor-pointer hover:bg-white/90 dark:hover:bg-white/10 transition">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {pickLang(HIGHLIGHT_LABELS.systemsEngineer, lang)}
                  </span>
                  <img
                    src="/assets/images/highlight1.jpeg"
                    alt="Systems & Computer Engineering"
                    className="h-8 w-8 object-contain rounded-md"
                    draggable={false}
                  />
                </div>
              </HighlightCardWithTooltip>

              {/* IT Coordinator */}
              <HighlightCardWithTooltip
                title={lang === "en" ? "GOROM Association" : lang === "es" ? "Asociación GOROM" : lang === "ja" ? "一般社団法人ごろ夢" : "GOROM 협회"}
                subtitle={lang === "en" ? "Tokyo, Japan" : lang === "es" ? "Tokio, Japón" : lang === "ja" ? "日本・東京" : "일본 도쿄"}
              >
                <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 cursor-pointer hover:bg-white/90 dark:hover:bg-white/10 transition">
                  <span className="text-sm text-slate-800 dark:text-slate-200">
                    {pickLang(HIGHLIGHT_LABELS.fullStackEngineer, lang)}
                  </span>
                  <img
                    src="/assets/images/highlight2.png"
                    alt="IT Coordinator"
                    className="h-8 w-8 object-contain rounded-md"
                    draggable={false}
                  />
                </div>
              </HighlightCardWithTooltip>

              {/* Seoul National University Alumni */}
              <HighlightCardWithTooltip
                title={lang === "en" ? "Seoul National University" : lang === "es" ? "Universidad Nacional de Seúl" : lang === "ja" ? "ソウル大学校" : "서울대학교"}
                subtitle={lang === "en" ? "Seoul, South Korea" : lang === "es" ? "Seúl, Corea del Sur" : lang === "ja" ? "韓国・ソウル" : "대한민국 서울"}
              >
                <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 cursor-pointer hover:bg-white/90 dark:hover:bg-white/10 transition">
                  <span className="text-sm text-slate-800 dark:text-slate-200">
                    {pickLang(HIGHLIGHT_LABELS.snuAlumni, lang)}
                  </span>
                  <img
                    src="/assets/images/highlight3.jpeg"
                    alt="Seoul National University Alumni"
                    className="h-8 w-8 object-contain rounded-md"
                    draggable={false}
                  />
                </div>
              </HighlightCardWithTooltip>
            </div>

            {/* Right card (mobile) */}
            <div className="mt-6 lg:hidden">{RightCard}</div>

            {/* Bio summary */}
            <p className="mt-4 max-w-3xl text-base sm:text-lg text-slate-700 dark:text-slate-300/90 leading-relaxed text-justify">
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
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 px-4 py-2.5 text-sm font-semibold text-cyan-700 dark:text-cyan-100 ring-1 ring-cyan-300/30 hover:bg-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
              >
                <HiOutlineEnvelope className="h-5 w-5" />
                {pickLang(CTA_LABELS.contact, lang)}
              </button>

              <a
                href={
                  lang === "es"
                    ? "https://drive.google.com/file/d/1MdpObV_RHl4TDxRibpJiqpwpayci3fOJ/view?usp=sharing"
                    : "https://drive.google.com/file/d/1sQBnbAxm2T7gjuZLOH4VBdGKd7MQpr0I/view?usp=sharing"
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <HiOutlineDocumentText className="h-5 w-5" />
                {pickLang(CTA_LABELS.cv, lang)}
              </a>

              <button
                onClick={() => scrollToSection("projects")}
                className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <HiOutlineArrowTopRightOnSquare className="h-5 w-5" />
                {pickLang(CTA_LABELS.projects, lang)}
              </button>
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

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        lang={lang}
        emails={emails}
        linkedinUrl={linkedinUrl}
      />
    </div>
  );
}