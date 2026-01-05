import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineCpuChip,
  HiOutlineEnvelope,
  HiOutlineArrowUp,
  HiOutlineMapPin,
  HiOutlineLanguage,
} from "react-icons/hi2";
import { SiGithub, SiLinkedin } from "react-icons/si";
import profile from "../data/profile.json";

/**
 * Footer
 * - Responsive
 * - Dark/light friendly (Tailwind `dark:`)
 * - i18n-ready (EN/ES/JA/KO) via localStorage + app:languageChanged event
 * - Lightweight, static-data friendly
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
    title: "Let’s build something remarkable.",
    subtitle:
      "Robotics mindset. Product-grade web. Clean design. If you have a challenge, I’d love to hear it.",
    contact: "Contact",
    emailMe: "Email me",
    location: "Colombia • Working globally",
    navigation: "Navigation",
    links: [
      { label: "Bio", href: "#bio" },
      { label: "Projects", href: "#projects" },
      { label: "Skills", href: "#skills" },
      { label: "Academic", href: "#academic" },
      { label: "Awards", href: "#awards" },
      { label: "Travel", href: "#travel" },
      { label: "Contact", href: "#contact" },
    ],
    social: "Social",
    backToTop: "Back to top",
    lang: "Language-ready",
    copyright:
      "© {year} Fai Hernandez. Built with Vite + React + Tailwind. All rights reserved.",
  },
  es: {
    title: "Construyamos algo increíble.",
    subtitle:
      "Mentalidad robótica. Web a nivel producto. Diseño limpio. Si tienes un reto, me encantaría escucharlo.",
    contact: "Contacto",
    emailMe: "Escríbeme",
    location: "Colombia • Trabajo global",
    navigation: "Navegación",
    links: [
      { label: "Bio", href: "#bio" },
      { label: "Proyectos", href: "#projects" },
      { label: "Habilidades", href: "#skills" },
      { label: "Académico", href: "#academic" },
      { label: "Premios", href: "#awards" },
      { label: "Viajes", href: "#travel" },
      { label: "Contacto", href: "#contact" },
    ],
    social: "Redes",
    backToTop: "Volver arriba",
    lang: "Listo para idiomas",
    copyright:
      "© {year} Fai Hernandez. Hecho con Vite + React + Tailwind. Todos los derechos reservados.",
  },
  ja: {
    title: "一緒に、最高のものを作ろう。",
    subtitle:
      "ロボティクスの思考 × プロダクト品質のWeb × クリーンなデザイン。相談してみてください。",
    contact: "連絡",
    emailMe: "メール",
    location: "コロンビア拠点 • グローバル対応",
    navigation: "ナビゲーション",
    links: [
      { label: "自己紹介", href: "#bio" },
      { label: "プロジェクト", href: "#projects" },
      { label: "スキル", href: "#skills" },
      { label: "学歴", href: "#academic" },
      { label: "受賞", href: "#awards" },
      { label: "旅", href: "#travel" },
      { label: "連絡", href: "#contact" },
    ],
    social: "SNS",
    backToTop: "トップへ",
    lang: "多言語対応",
    copyright:
      "© {year} Fai Hernandez. Vite + React + Tailwind で制作。All rights reserved.",
  },
  ko: {
    title: "함께 멋진 걸 만들어봐요.",
    subtitle:
      "로보틱스 마인드 × 프로덕트급 웹 × 깔끔한 디자인. 아이디어가 있다면 연락 주세요.",
    contact: "연락",
    emailMe: "이메일",
    location: "콜롬비아 기반 • 글로벌 협업",
    navigation: "메뉴",
    links: [
      { label: "소개", href: "#bio" },
      { label: "프로젝트", href: "#projects" },
      { label: "기술", href: "#skills" },
      { label: "학력", href: "#academic" },
      { label: "수상", href: "#awards" },
      { label: "여행", href: "#travel" },
      { label: "연락", href: "#contact" },
    ],
    social: "소셜",
    backToTop: "맨 위로",
    lang: "다국어 준비",
    copyright:
      "© {year} Fai Hernandez. Vite + React + Tailwind로 제작. All rights reserved.",
  },
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer() {
  const lang = useAppLanguage();
  const t = useMemo(() => UI[lang] || UI.en, [lang]);
  const year = new Date().getFullYear();

  const EMAIL = profile?.contact?.emails?.[0]?.value
    ? `mailto:${profile.contact.emails[0].value}`
    : "mailto:hello@example.com";
  const GITHUB = profile?.contact?.social?.github || "https://github.com/";
  const LINKEDIN = profile?.contact?.social?.linkedin || "https://www.linkedin.com/";

  return (
    <footer className="relative mt-16 border-t border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5">
      {/* Neon glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-10 -top-24 -z-10 h-48 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-indigo-400/0 blur-3xl"
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand / CTA */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-slate-950/20 px-4 py-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 text-white ring-1 ring-white/15">
                <HiOutlineCpuChip className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Fai Hernandez</p>
                <p className="text-xs text-slate-700 dark:text-slate-300/80">Robotics × Web Engineering</p>
              </div>
            </div>

            <h3 className="mt-6 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {t.title}
            </h3>
            <p className="mt-3 max-w-xl text-slate-700 dark:text-slate-300/90">{t.subtitle}</p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={EMAIL}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400/20 px-4 py-2.5 text-sm font-semibold text-cyan-100 ring-1 ring-cyan-300/30 hover:bg-cyan-400/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
              >
                <HiOutlineEnvelope className="h-5 w-5" />
                {t.emailMe}
              </a>

              <span className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200/85">
                <HiOutlineMapPin className="h-5 w-5 text-cyan-600 dark:text-cyan-300/90" />
                {t.location}
              </span>

              <span className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200/85">
                <HiOutlineLanguage className="h-5 w-5 text-cyan-600 dark:text-cyan-300/90" />
                {t.lang}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-200/80">
              {t.navigation}
            </p>
            <div className="mt-4 grid gap-2">
              {t.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="inline-flex items-center justify-between rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-2 text-sm text-slate-800 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                >
                  <span>{l.label}</span>
                  <span className="text-slate-600/70 dark:text-slate-400/70">↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="lg:col-span-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-200/80">
              {t.social}
            </p>

            <div className="mt-4 grid gap-3">
              <a
                href={GITHUB}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 text-slate-800 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950/10 dark:bg-slate-950/20 ring-1 ring-black/10 dark:ring-white/10">
                  <SiGithub className="h-5 w-5 text-cyan-300" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">GitHub</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300/80">Open-source & code</p>
                </div>
              </a>

              <a
                href={LINKEDIN}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 text-slate-800 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950/10 dark:bg-slate-950/20 ring-1 ring-black/10 dark:ring-white/10">
                  <SiLinkedin className="h-5 w-5 text-cyan-300" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">LinkedIn</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300/80">Networking & career</p>
                </div>
              </a>

              <motion.button
                type="button"
                onClick={scrollToTop}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="inline-flex items-center justify-between gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 text-slate-800 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950/10 dark:bg-slate-950/20 ring-1 ring-black/10 dark:ring-white/10">
                    <HiOutlineArrowUp className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.backToTop}</p>
                </div>
                <span className="text-slate-600/70 dark:text-slate-400/70">↑</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12">
          <div className="h-px bg-gradient-to-r from-cyan-400/0 via-cyan-400/35 to-indigo-400/0" />
          <p className="mt-5 text-xs text-slate-700 dark:text-slate-300/75">
            {t.copyright.replace("{year}", String(year))}
          </p>
        </div>
      </div>
    </footer>
  );
}
