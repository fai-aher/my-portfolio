import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineEnvelope,
  HiOutlineArrowUp,
  HiOutlineMapPin,
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
    title: "I would love to get in touch with you",
    subtitle:
      "I am open to job offers, international experiences, and participation in social robotics, humanoid robotics, and web development projects. Send me an email or a message through one of my social networks.",
    contactMe: "Contact me",
    location: "Colombia • Working globally",
    navigation: "Navigation",
    links: [
      { label: "Bio", href: "#bio" },
      { label: "Projects", href: "#projects" },
      { label: "Skills", href: "#skills" },
      { label: "Academic", href: "#academic" },
      { label: "Awards", href: "#awards" },
      { label: "Travel", href: "#travel" },
    ],
    social: "Social",
    backToTop: "Back to top",
    copyright: "© {year} Alonso Hernandez Tavera. All rights reserved.",
  },
  es: {
    title: "Me encantaría ponerme en contacto contigo",
    subtitle:
      "Estoy abierto a propuestas de trabajo, experiencias internacionales y participación en proyectos de robótica social, robótica humanoide y desarrollo web. Escríbeme un correo o mándame un mensaje a una de mis redes sociales.",
    contactMe: "Contáctame",
    location: "Colombia • Trabajo global",
    navigation: "Navegación",
    links: [
      { label: "Bio", href: "#bio" },
      { label: "Proyectos", href: "#projects" },
      { label: "Habilidades", href: "#skills" },
      { label: "Académico", href: "#academic" },
      { label: "Premios", href: "#awards" },
      { label: "Viajes", href: "#travel" },
    ],
    social: "Redes",
    backToTop: "Volver arriba",
    copyright: "© {year} Alonso Hernandez Tavera. Todos los derechos reservados.",
  },
  ja: {
    title: "ぜひご連絡ください",
    subtitle:
      "求人、海外経験、ソーシャルロボティクス、ヒューマノイドロボティクス、Web開発プロジェクトへの参加を歓迎しています。メールまたはSNSでご連絡ください。",
    contactMe: "連絡する",
    location: "コロンビア拠点 • グローバル対応",
    navigation: "ナビゲーション",
    links: [
      { label: "自己紹介", href: "#bio" },
      { label: "プロジェクト", href: "#projects" },
      { label: "スキル", href: "#skills" },
      { label: "学歴", href: "#academic" },
      { label: "受賞", href: "#awards" },
      { label: "旅", href: "#travel" },
    ],
    social: "SNS",
    backToTop: "トップへ",
    copyright: "© {year} アロンソ・エルナンデス・タベラ. All rights reserved.",
  },
  ko: {
    title: "연락 주시면 감사하겠습니다",
    subtitle:
      "채용 제안, 해외 경험, 소셜 로보틱스, 휴머노이드 로보틱스 및 웹 개발 프로젝트 참여에 열려 있습니다. 이메일이나 SNS로 연락해 주세요.",
    contactMe: "연락하기",
    location: "콜롬비아 기반 • 글로벌 협업",
    navigation: "메뉴",
    links: [
      { label: "소개", href: "#bio" },
      { label: "프로젝트", href: "#projects" },
      { label: "기술", href: "#skills" },
      { label: "학력", href: "#academic" },
      { label: "수상", href: "#awards" },
      { label: "여행", href: "#travel" },
    ],
    social: "소셜",
    backToTop: "맨 위로",
    copyright: "© {year} 알론소 에르난데스 타베라. All rights reserved.",
  },
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openContactModal() {
  window.dispatchEvent(new CustomEvent("app:openContactModal"));
}

export default function Footer() {
  const lang = useAppLanguage();
  const t = useMemo(() => UI[lang] || UI.en, [lang]);
  const year = new Date().getFullYear();

  const GITHUB = profile?.contact?.social?.github?.url || "https://github.com/";
  const LINKEDIN = profile?.contact?.social?.linkedin?.url || "https://www.linkedin.com/";

  return (
    <footer className="relative mt-16 border-t border-black/10 dark:border-white/10 bg-slate-200 dark:bg-white/5">
      {/* Neon glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-10 -top-24 -z-10 h-48 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-indigo-400/0 blur-3xl"
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand / CTA */}
          <div className="lg:col-span-6">
            <div className="inline-block rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-slate-950/20 p-1">
              <span className="relative block h-16 w-16 overflow-hidden rounded-full ring-2 ring-cyan-400/40">
                <img
                  src="/assets/images/header-icon.png"
                  alt="Profile avatar"
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </span>
            </div>

            <h3 className="mt-6 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {t.title}
            </h3>
            <p className="mt-3 max-w-xl text-slate-700 dark:text-slate-300/90 text-justify">{t.subtitle}</p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={openContactModal}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400/20 px-4 py-2.5 text-sm font-semibold text-cyan-700 dark:text-cyan-100 ring-1 ring-cyan-300/30 hover:bg-cyan-400/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 cursor-pointer"
              >
                <HiOutlineEnvelope className="h-5 w-5" />
                {t.contactMe}
              </button>

              <span className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200/85">
                <HiOutlineMapPin className="h-5 w-5 text-cyan-600 dark:text-cyan-300/90" />
                {t.location}
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
                  <SiGithub className="h-5 w-5 text-slate-800 dark:text-cyan-300" />
                </span>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">GitHub</p>
              </a>

              <a
                href={LINKEDIN}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 text-slate-800 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950/10 dark:bg-slate-950/20 ring-1 ring-black/10 dark:ring-white/10">
                  <SiLinkedin className="h-5 w-5 text-blue-600 dark:text-cyan-300" />
                </span>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">LinkedIn</p>
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
