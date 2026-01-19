import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineRocketLaunch,
  HiOutlinePhoto,
  HiOutlineGlobeAlt,
  HiOutlineCodeBracket,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePause,
  HiOutlinePlay,
  HiOutlineXMark,
  HiOutlineDocumentText,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";

import TechIcon from "./TechIcon.jsx";
import projectsData from "../data/projects.json";

/**
 * ProjectsSection - Carousel-based projects showcase
 * - Auto-scrolling carousel (5s interval)
 * - Gallery modal for screenshots
 * - Technology icons with hover animation
 * - Full i18n support (EN/ES/JA/KO)
 * - Light/dark theme
 * - Responsive design
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

function pickLang(value, lang) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || Object.values(value)[0] || "";
}

const UI = {
  en: {
    title: "Projects",
    subtitle: "A selection of product-grade web apps, research projects, and experiments I have developed along my academic path. Each one represents a piece of my journey in robotics and software engineering.",
    seeDetails: "See Details",
    seeResult: "See the Result",
    code: "Code",
    closeDetails: "Close",
    paused: "Paused",
    playing: "Auto-play",
    of: "of",
    description: "Description",
    technologies: "Technologies",
    modalIntro: "Project Details: You can read a description below the images",
    filterAll: "All Projects",
    filterRobotics: "Robotics & AI",
    filterWeb: "Web Development",
    filterOther: "Other Projects",
  },
  es: {
    title: "Proyectos",
    subtitle: "Una selección de aplicaciones web, proyectos de investigación y experimentos que he desarrollado a lo largo de mi camino académico. Cada uno representa una parte de mi trayectoria en robótica e ingeniería de software.",
    seeDetails: "Ver Detalles",
    seeResult: "Ver el Resultado",
    code: "Código",
    closeDetails: "Cerrar",
    paused: "Pausado",
    playing: "Auto-play",
    of: "de",
    description: "Descripción",
    technologies: "Tecnologías",
    modalIntro: "Detalles del Proyecto: Puedes leer una descripción debajo de las imágenes",
    filterAll: "Todos los Proyectos",
    filterRobotics: "Robótica e IA",
    filterWeb: "Desarrollo Web",
    filterOther: "Otros Proyectos",
  },
  ja: {
    title: "プロジェクト",
    subtitle: "私が学業を通じて開発してきたWebアプリ、研究プロジェクト、実験作品のセレクションです。それぞれがロボティクスとソフトウェアエンジニアリングにおける私の歩みを表しています。",
    seeDetails: "詳細を見る",
    seeResult: "結果を見る",
    code: "コード",
    closeDetails: "閉じる",
    paused: "一時停止",
    playing: "自動再生",
    of: "/",
    description: "説明",
    technologies: "技術",
    modalIntro: "プロジェクト詳細：画像の下に説明があります",
    filterAll: "すべてのプロジェクト",
    filterRobotics: "ロボティクス・AI",
    filterWeb: "Web開発",
    filterOther: "その他",
  },
  ko: {
    title: "프로젝트",
    subtitle: "학업 과정에서 개발한 웹 앱, 연구 프로젝트, 실험작들의 모음입니다. 각각의 프로젝트는 로보틱스와 소프트웨어 엔지니어링 분야에서의 저의 여정을 담고 있습니다.",
    seeDetails: "자세히 보기",
    seeResult: "결과 보기",
    code: "코드",
    closeDetails: "닫기",
    paused: "일시정지",
    playing: "자동재생",
    of: "/",
    description: "설명",
    technologies: "기술",
    modalIntro: "프로젝트 세부정보: 이미지 아래에서 설명을 읽을 수 있습니다",
    filterAll: "모든 프로젝트",
    filterRobotics: "로보틱스 & AI",
    filterWeb: "웹 개발",
    filterOther: "기타 프로젝트",
  },
};


// Technology icon with hover tooltip
function TechIconWithTooltip({ iconSlug, name }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        whileHover={{ scale: 1.15 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="h-8 w-8 cursor-pointer"
      >
        <TechIcon iconSlug={iconSlug} alt={name} size="md" />
      </motion.div>
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
              {name}
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white dark:border-t-slate-900" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Details Modal with Gallery and Project Information
function DetailsModal({ isOpen, onClose, project, lang, t }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) setCurrentIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (project?.gallery && project.gallery.length > 1) {
        if (e.key === "ArrowLeft") setCurrentIndex((i) => (i > 0 ? i - 1 : project.gallery.length - 1));
        if (e.key === "ArrowRight") setCurrentIndex((i) => (i < project.gallery.length - 1 ? i + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, project, onClose]);

  if (!project) return null;

  // Filter gallery to only include valid image paths (strings that exist)
  const images = (project.gallery || []).filter((img) => img && typeof img === "string");
  const hasImages = images.length > 0;

  const TECH_NAMES = {
    react: "React",
    tailwindcss: "Tailwind CSS",
    django: "Django",
    postgresql: "PostgreSQL",
    python: "Python",
    pytorch: "PyTorch",
    numpy: "NumPy",
    framer: "Framer Motion",
    pygame: "Pygame",
    javascript: "JavaScript",
    typescript: "TypeScript",
    nodejs: "Node.js",
    nestjs: "NestJS",
    mysql: "MySQL",
    auth0: "Auth0",
    digitalocean: "DigitalOcean",
    aws: "AWS",
    vite: "Vite",
    heroku: "Heroku",
    wordpress: "WordPress",
    php: "PHP",
    ros2: "ROS 2",
    flask: "Flask",
    openai: "OpenAI",
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
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="absolute left-1/2 top-1/2 w-[95vw] max-w-5xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden"
          >
            {/* Scrollable container */}
            <div className="relative overflow-y-auto max-h-[90vh] rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900">
              {/* Header with project title and close button */}
              <div className="sticky top-0 z-20 flex items-start justify-between gap-4 px-6 pt-6 pb-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-black/10 dark:border-white/10">
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                  {pickLang(project.title, lang)}
                </h2>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-full bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-black/20 dark:hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
                >
                  <HiOutlineXMark className="h-5 w-5" />
                </button>
              </div>
              {/* Image carousel - only show if images exist */}
              {hasImages && (
                <div className="relative">
                  <div className="aspect-video relative bg-slate-200 dark:bg-slate-800">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={`${pickLang(project.title, lang)} - Image ${currentIndex + 1}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </AnimatePresence>

                    {/* Navigation arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
                          className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70 focus:outline-none"
                        >
                          <HiOutlineChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          onClick={() => setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70 focus:outline-none"
                        >
                          <HiOutlineChevronRight className="h-6 w-6" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Counter and Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex items-center justify-center gap-4 border-b border-black/10 dark:border-white/10 px-4 py-2 bg-slate-200/50 dark:bg-slate-800/50">
                      {/* Thumbnails */}
                      <div className="flex justify-center gap-2">
                        {images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 w-2 rounded-full transition ${
                              idx === currentIndex
                                ? "bg-cyan-400"
                                : "bg-black/30 dark:bg-white/30 hover:bg-black/50 dark:hover:bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                      {/* Counter */}
                      <p className="text-sm text-slate-600 dark:text-white/60">
                        {currentIndex + 1} {t.of} {images.length}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Project Details - Adjust pt-4 here to change top padding (currently 16px top, 24px bottom) */}
              <div className="px-6 pt-4 pb-6 space-y-6">
                {/* Type Tag */}
                <div>
                  <span className="inline-block rounded-full bg-cyan-500/20 border border-cyan-400/30 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-200">
                    {pickLang(project.typeTag, lang)}
                  </span>
                </div>

                {/* Feature Tags */}
                {project.featureTags && project.featureTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.featureTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-black/20 dark:border-white/20 bg-black/10 dark:bg-white/10 px-3 py-1 text-xs text-slate-900 dark:text-white/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white/90 mb-3">
                      {t.technologies}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {project.technologies.map((tech) => (
                        <div key={tech} className="flex items-center gap-2">
                          <TechIcon iconSlug={tech} alt={TECH_NAMES[tech] || tech} size="md" />
                          <span className="text-sm text-slate-800 dark:text-white/80">{TECH_NAMES[tech] || tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white/90 mb-3">
                    {t.description}
                  </h4>
                  <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-white/85 leading-relaxed text-justify">
                    {pickLang(project.description, lang).split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Action Buttons in Modal */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                  {/* See the Result Button */}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/15 px-4 py-2.5 text-sm font-semibold text-cyan-700 dark:text-cyan-200 ring-1 ring-cyan-300/30 hover:bg-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
                    >
                      <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
                      {t.seeResult}
                    </a>
                  )}

                  {/* Code Button */}
                  {project.showCode && project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-black/20 dark:border-white/20 bg-black/10 dark:bg-white/10 px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white hover:bg-black/15 dark:hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
                    >
                      <HiOutlineCodeBracket className="h-4 w-4" />
                      {t.code}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Project Card
function ProjectCard({ project, lang, t, onOpenGallery }) {
  const TECH_NAMES = {
    react: "React",
    tailwindcss: "Tailwind CSS",
    django: "Django",
    postgresql: "PostgreSQL",
    python: "Python",
    pytorch: "PyTorch",
    numpy: "NumPy",
    framer: "Framer Motion",
    pygame: "Pygame",
    javascript: "JavaScript",
    typescript: "TypeScript",
    nodejs: "Node.js",
    nestjs: "NestJS",
    mysql: "MySQL",
    auth0: "Auth0",
    digitalocean: "DigitalOcean",
    aws: "AWS",
    vite: "Vite",
    heroku: "Heroku",
    wordpress: "WordPress",
    elementor: "Elementor",
    php: "PHP",
    ros2: "ROS 2",
    flask: "Flask",
    openai: "OpenAI",
  };

  return (
    <div className="group relative h-full overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/80">
      {/* Preview Image - Adjust heights here: h-56 (mobile), sm:h-64 (tablet), lg:h-72 (desktop) */}
      <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden bg-slate-200 dark:bg-slate-800">
        <img
          src={project.previewImage}
          alt={pickLang(project.title, lang)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Type Tag */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center rounded-full bg-cyan-500/90 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            {pickLang(project.typeTag, lang)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white leading-tight">
          {pickLang(project.title, lang)}
        </h3>

        {/* Description */}
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300/90 line-clamp-3">
          {pickLang(project.description, lang)}
        </p>

        {/* Feature Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.featureTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Technology Icons */}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <TechIconWithTooltip
              key={tech}
              iconSlug={tech}
              name={TECH_NAMES[tech] || tech}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-wrap gap-2">
          {/* See Details Button */}
          <button
            onClick={() => onOpenGallery(project)}
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-white/90 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
          >
            <HiOutlineDocumentText className="h-4 w-4" />
            {t.seeDetails}
          </button>

          {/* See the Result Button */}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/15 px-4 py-2.5 text-sm font-semibold text-cyan-700 dark:text-cyan-200 ring-1 ring-cyan-300/30 hover:bg-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
            >
              <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
              {t.seeResult}
            </a>
          )}

          {/* Code Button (conditional) */}
          {project.showCode && project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-white/90 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
            >
              <HiOutlineCodeBracket className="h-4 w-4" />
              {t.code}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to categorize projects
function categorizeProject(project) {
  const id = project.id;
  const technologies = project.technologies || [];

  // Robotics & AI Projects
  if (
    id === "nao-robot-thesis" ||
    id === "compass-research" ||
    technologies.includes("ros2") ||
    technologies.includes("pytorch")
  ) {
    return "robotics";
  }

  // Web Development Projects
  if (
    id === "seed-platform" ||
    id === "platinum-crm" ||
    id === "admin-girones" ||
    id === "admin-surtidora-miami" ||
    id === "gorom-website" ||
    id === "robot-portfolio" ||
    technologies.includes("react") ||
    technologies.includes("django") ||
    technologies.includes("nestjs") ||
    technologies.includes("wordpress")
  ) {
    return "web";
  }

  // Other Projects
  return "other";
}

export default function ProjectsSection() {
  const lang = useAppLanguage();
  const t = useMemo(() => UI[lang] || UI.en, [lang]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [galleryProject, setGalleryProject] = useState(null);
  const [isInViewport, setIsInViewport] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const intervalRef = useRef(null);
  const sectionRef = useRef(null);

  // Filter projects based on active category
  const projects = useMemo(() => {
    if (activeFilter === "all") {
      return projectsData;
    }
    return projectsData.filter(project => categorizeProject(project) === activeFilter);
  }, [activeFilter]);

  // Auto-scroll - changed to 10 seconds
  const startAutoScroll = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 10000);
  }, [projects.length]);

  const stopAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Detect when section comes into viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Auto-scroll only when in viewport and not paused
  useEffect(() => {
    if (isInViewport && !isPaused) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
    return () => stopAutoScroll();
  }, [isInViewport, isPaused, startAutoScroll, stopAutoScroll]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    if (!isPaused) startAutoScroll(); // Reset timer
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    if (!isPaused) startAutoScroll(); // Reset timer
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
    if (!isPaused) startAutoScroll(); // Reset timer
  };

  return (
    <div ref={sectionRef} className="relative">
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-8 -top-10 -z-10 h-40 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-indigo-400/0 blur-2xl"
      />

      {/* Header */}
      <div className="mb-8">
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
        </div>

        {/* Filter Buttons */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setActiveFilter("all");
              setCurrentIndex(0);
            }}
            className={`inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              activeFilter === "all"
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                : "border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10"
            }`}
          >
            {t.filterAll}
          </button>
          <button
            onClick={() => {
              setActiveFilter("robotics");
              setCurrentIndex(0);
            }}
            className={`inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              activeFilter === "robotics"
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                : "border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10"
            }`}
          >
            {t.filterRobotics}
          </button>
          <button
            onClick={() => {
              setActiveFilter("web");
              setCurrentIndex(0);
            }}
            className={`inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              activeFilter === "web"
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                : "border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10"
            }`}
          >
            {t.filterWeb}
          </button>
          <button
            onClick={() => {
              setActiveFilter("other");
              setCurrentIndex(0);
            }}
            className={`inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              activeFilter === "other"
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                : "border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10"
            }`}
          >
            {t.filterOther}
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full border border-black/10 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white shadow-lg hover:bg-white dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
          aria-label="Previous project"
        >
          <HiOutlineChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <button
          onClick={goToNext}
          className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full border border-black/10 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white shadow-lg hover:bg-white dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
          aria-label="Next project"
        >
          <HiOutlineChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Cards Container */}
        <div className="overflow-hidden rounded-3xl">
          <motion.div
            className="flex"
            animate={{ x: `-${currentIndex * 100}%` }}
            transition={{ type: "tween", ease: [0.25, 0.1, 0.25, 1], duration: 0.6 }}
          >
            {projects.map((project) => (
              <div key={project.id} className="w-full flex-shrink-0 px-1">
                <ProjectCard
                  project={project}
                  lang={lang}
                  t={t}
                  onOpenGallery={setGalleryProject}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pause button - bottom right */}
        <button
          onClick={() => setIsPaused((p) => !p)}
          className="absolute bottom-15 right-4 z-10 inline-flex items-center justify-center h-10 w-10 rounded-[15px] border border-black/10 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-lg hover:bg-white dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
          title={isPaused ? t.playing : t.paused}
          aria-label={isPaused ? t.playing : t.paused}
        >
          {isPaused ? (
            <HiOutlinePlay className="h-5 w-5" />
          ) : (
            <HiOutlinePause className="h-5 w-5" />
          )}
        </button>

        {/* Dots Indicator */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="flex gap-2">
            {projects.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-8 bg-cyan-500"
                    : "w-2.5 bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40"
                }`}
                aria-label={`Go to project ${idx + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">
            {currentIndex + 1} {t.of} {projects.length}
          </span>
        </div>
      </div>

      {/* Details Modal */}
      <DetailsModal
        isOpen={!!galleryProject}
        onClose={() => setGalleryProject(null)}
        project={galleryProject}
        lang={lang}
        t={t}
      />
    </div>
  );
}
