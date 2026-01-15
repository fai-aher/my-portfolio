import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineBars3,
  HiXMark,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineGlobeAlt,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineSparkles,
  HiOutlineAcademicCap,
  HiOutlineTrophy,
  HiOutlineMap,
  HiOutlineEnvelope,
} from "react-icons/hi2";
import { FiChevronDown } from "react-icons/fi";

// Simple in-component i18n (we'll centralize later)
const STRINGS = {
  en: {
    sections: {
      bio: "Biography",
      projects: "Projects",
      skills: "Skills",
      academic: "Academic",
      awards: "Awards",
      travel: "World Map",
      contact: "Contact",
    },
    theme: "Theme",
    language: "Language",
    interests: "Web • Robotics • Travel",
  },
  es: {
    sections: {
      bio: "Biografía",
      projects: "Proyectos",
      skills: "Habilidades",
      academic: "Académico",
      awards: "Premios",
      travel: "Mapa Mundial",
      contact: "Contacto",
    },
    theme: "Tema",
    language: "Idioma",
    interests: "Web • Robótica • Viajes",
  },
  ja: {
    sections: {
      bio: "略歴",
      projects: "プロジェクト",
      skills: "スキル",
      academic: "学歴",
      awards: "受賞",
      travel: "世界地図",
      contact: "連絡先",
    },
    theme: "テーマ",
    language: "言語",
    interests: "Web • ロボティクス • 旅行",
  },
  ko: {
    sections: {
      bio: "소개",
      projects: "프로젝트",
      skills: "기술",
      academic: "학력",
      awards: "수상",
      travel: "세계 지도",
      contact: "연락",
    },
    theme: "테마",
    language: "언어",
    interests: "웹 • 로보틱스 • 여행",
  },
};

const NAV_KEYS = ["bio", "projects", "skills", "academic", "awards", "travel", "contact"];

function useTheme() {
  const getInitialTheme = () => {
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}

function useLanguage() {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem("lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
    // Inform the rest of the app (we'll listen later from App.jsx)
    window.dispatchEvent(new CustomEvent("app:languageChanged", { detail: { lang } }));
  }, [lang]);

  const t = useMemo(() => STRINGS[lang], [lang]);
  return { lang, setLang, t };
}

const pulseVariants = {
  initial: { opacity: 0, y: -8 },
  enter: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  // Close menus on route/hash change
  useEffect(() => {
    const onHash = () => setOpen(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const switchTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const openContactModal = () => {
    window.dispatchEvent(new CustomEvent("app:openContactModal"));
  };

  const SectionLink = ({ id, label, Icon, onClick }) => (
    <motion.a
      key={id}
      href={onClick ? undefined : `#${id}`}
      onClick={onClick ? (e) => { e.preventDefault(); onClick(); } : undefined}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="group relative px-3 py-2 rounded-md text-sm font-medium text-slate-800 dark:text-slate-100/90 transition cursor-pointer"
    >
      <span className="relative z-10 flex items-center gap-1.5">
        <Icon className="h-4 w-4 opacity-70 transition-colors group-hover:text-cyan-400 group-hover:opacity-100" />
        <span className="transition-colors group-hover:text-cyan-400">
          {label}
        </span>
      </span>
      <span className="absolute inset-x-2 -bottom-0.5 h-px bg-gradient-to-r from-cyan-400/0 via-cyan-400/80 to-cyan-400/0 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </motion.a>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        variants={pulseVariants}
        initial="initial"
        animate="enter"
        className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8"
      >
        <div className="mt-3 sm:mt-4 rounded-2xl border border-black/10 dark:border-white/10 bg-slate-200/90 dark:bg-slate-950/70 backdrop-blur supports-[backdrop-filter]:bg-slate-200/80 dark:supports-[backdrop-filter]:bg-slate-900/60 shadow-lg">
          <nav className="flex items-center justify-between px-3 sm:px-5 py-2">
            {/* Left: Logo / Signature */}
            <a href="#top" className="group flex items-center gap-2 py-1">
              <span className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-cyan-400/40">
                <img
                  src="/assets/images/header-icon.png"
                  alt="Profile avatar"
                  className="h-full w-full object-cover"
                  draggable={false}
                />
                <span className="absolute inset-0 rounded-full ring-2 ring-cyan-400/30 opacity-0 group-hover:opacity-100 transition" />
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-base font-semibold tracking-wide text-slate-900 dark:text-white font-['Orbitron']">
                  @a.hernandezt
                </span>
                <span className="text-[11px] text-cyan-700 dark:text-cyan-300/80">{t.interests}</span>
              </div>
            </a>

            {/* Center: Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { key: "bio", icon: HiOutlineUser },
                { key: "projects", icon: HiOutlineBriefcase },
                { key: "skills", icon: HiOutlineSparkles },
                { key: "academic", icon: HiOutlineAcademicCap },
                { key: "awards", icon: HiOutlineTrophy },
                { key: "travel", icon: HiOutlineMap },
                { key: "contact", icon: HiOutlineEnvelope, onClick: openContactModal },
              ].map(({ key, icon, onClick }) => (
                <SectionLink
                  key={key}
                  id={key}
                  label={t.sections[key]}
                  Icon={icon}
                  onClick={onClick}
                />
              ))}
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2">
              {/* Language */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen((v) => !v)}
                  title={t.language}
                  className="flex items-center gap-1 rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-2.5 py-1.5 text-sm text-slate-800 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  aria-haspopup="listbox"
                  aria-expanded={langOpen}
                >
                  <HiOutlineGlobeAlt className="h-5 w-5" />
                  <span className="font-medium uppercase">{lang}</span>
                  <FiChevronDown className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-xl"
                      role="listbox"
                    >
                      {[
                        { key: "en", label: "English" },
                        { key: "es", label: "Español" },
                        { key: "ja", label: "日本語" },
                        { key: "ko", label: "한국어" },
                      ].map((opt) => (
                        <li key={opt.key}>
                          <button
                            onClick={() => {
                              setLang(opt.key);
                              setLangOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 ${
                              lang === opt.key ? "text-cyan-600 dark:text-cyan-300" : "text-slate-800 dark:text-slate-200"
                            }`}
                            role="option"
                            aria-selected={lang === opt.key}
                          >
                            {opt.label}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme switch */}
              <button
                onClick={switchTheme}
                className="relative grid h-9 w-9 place-items-center rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-800 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                aria-label="Toggle dark mode"
                title="Toggle theme"
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {theme === "dark" ? (
                    <motion.span
                      key="moon"
                      initial={{ rotate: -45, opacity: 0, scale: 0.8 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 45, opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.18 }}
                    >
                      <HiOutlineMoon className="h-5 w-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="sun"
                      initial={{ rotate: 45, opacity: 0, scale: 0.8 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -45, opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.18 }}
                    >
                      <HiOutlineSun className="h-5 w-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* subtle glow ring */}
                <span className="pointer-events-none absolute inset-0 -z-10 rounded-lg ring-1 ring-cyan-400/20" />
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setOpen((v) => !v)}
                className="md:hidden grid h-9 w-9 place-items-center rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                aria-label="Open menu"
                aria-expanded={open}
              >
                {open ? <HiXMark className="h-6 w-6" /> : <HiOutlineBars3 className="h-6 w-6" />}
              </button>
            </div>
          </nav>

          {/* Mobile sheet */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden border-t border-black/10 dark:border-white/10"
              >
                <div className="px-3 sm:px-5 py-3 grid gap-1">
                  {NAV_KEYS.map((key) => (
                    <a
                      key={key}
                      href={key === "contact" ? undefined : `#${key}`}
                      onClick={() => {
                        setOpen(false);
                        if (key === "contact") openContactModal();
                      }}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <HiOutlineGlobeAlt className="h-5 w-5 opacity-70" />
                        {t.sections[key]}
                      </span>
                      <span className="text-xs uppercase opacity-60">{key}</span>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </header>
  );
}