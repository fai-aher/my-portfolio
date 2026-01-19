import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineAcademicCap,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";

import academic from "../data/academic.json";

/* ----------------------------- helpers ----------------------------- */
function useAppLanguage() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  useEffect(() => {
    const handler = (e) => setLang(e?.detail?.lang || localStorage.getItem("lang") || "en");
    window.addEventListener("app:languageChanged", handler);
    return () => window.removeEventListener("app:languageChanged", handler);
  }, []);
  return lang;
}

function pickLang(value, lang) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || Object.values(value)[0] || "";
}

function formatPeriod(dates = {}, lang = "en") {
  const monthsByLang = {
    en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    es: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
    ja: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
    ko: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"]
  };
  const presentByLang = {
    en: "Present",
    es: "Presente",
    ja: "現在",
    ko: "현재"
  };

  const months = monthsByLang[lang] || monthsByLang.en;
  const present = presentByLang[lang] || presentByLang.en;

  const fmt = (ym) => {
    if (!ym) return "";
    const [y, m] = String(ym).split("-");
    if (!m) return y;
    return `${months[Number(m)-1]} ${y}`;
  };
  return `${fmt(dates.start)} — ${dates.end ? fmt(dates.end) : present}`.trim();
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

/* --------------------------- component ----------------------------- */
export default function AcademicSection() {
  const lang = useAppLanguage();

  const academicItems = useMemo(() =>
    (academic || []).map((e) => ({
      id: e.id,
      period: formatPeriod(e.dates, lang),
      institution: pickLang(e.institution, lang),
      location: pickLang(e.location, lang),
      program: pickLang(e.program, lang),
      badges: e.gpa?.value ? [`GPA ${e.gpa.value}/${e.gpa.scale}`] : [],
      links: (e.links || []).map((l) => ({ label: l.label, href: l.url || l.href })),
      logoSrc: e.logo || "/images/org-placeholder.png",
      coverSrc: e.featuredImage || e.coverImage || "/images/academic-cover-placeholder.jpg",
      highlights: e.skillsAcquired || [],
      organizationWebsite: e.organizationWebsite || "",
    })), [lang]
  );

  return (
    <section id="academic" className="relative">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/70 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10">
            <HiOutlineAcademicCap className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white">
            {pickLang({
              en: "Academic Background",
              es: "Formación Académica",
              ja: "学歴",
              ko: "학력"
            }, lang)}
          </h2>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700 dark:text-slate-300/85">
          {pickLang({
            en: "My formal education has been the foundation of everything I build. Here you can explore the institutions and programs that have shaped my perspective in robotics and engineering.",
            es: "Mi formación académica ha sido la base de todo lo que construyo. Aquí puedes explorar las instituciones y programas que han moldeado mi perspectiva en robótica e ingeniería.",
            ja: "私の正規教育は、私が作るすべての基盤です。ロボティクスと工学における私の視点を形成した機関とプログラムをご覧いただけます。",
            ko: "저의 정규 교육은 제가 만드는 모든 것의 기반입니다. 로보틱스와 공학에 대한 저의 관점을 형성한 기관과 프로그램을 살펴보실 수 있습니다."
          }, lang)}
        </p>

        {/* Academic timeline */}
        <div className="mt-8 space-y-6">
          {academicItems.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5"
            >
              {/* Left content */}
              <div className="w-full md:w-[70%] p-5 sm:p-6">
                <p className="text-xs uppercase tracking-widest text-cyan-700 dark:text-cyan-200/70">
                  {item.period}
                </p>
                <div className="mt-2 flex items-start gap-3">
                  <img
                    src={item.logoSrc}
                    alt={`${item.institution} logo`}
                    className="h-10 w-10 shrink-0 rounded-xl object-contain border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-1"
                    loading="lazy"
                    draggable={false}
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {item.institution}
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300/85">{item.location}</p>
                  </div>
                </div>

                <p className="mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-200/90">
                  {item.program}
                </p>

                {/* badges */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-950/20 px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100/90"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {/* highlights */}
                {item.highlights.length > 0 && (
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {item.highlights.slice(0, 4).map((h) => (
                      <li
                        key={h}
                        className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-950/10 px-3 py-2 text-sm text-slate-900 dark:text-slate-200/85"
                      >
                        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-cyan-500/70 dark:bg-cyan-300/70" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                {/* links */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.organizationWebsite ? (
                    <a
                      href={item.organizationWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/15 px-3 py-2 text-sm font-semibold text-cyan-700 dark:text-cyan-200 ring-1 ring-cyan-300/30 hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                    >
                      Website
                      <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
                    </a>
                  ) : null}

                  {item.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10"
                    >
                      {l.label}
                      <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Right image (30%) */}
              <div className="hidden md:block w-[30%]">
                <img
                  src={item.coverSrc}
                  alt={item.institution}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}