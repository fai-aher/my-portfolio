import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header.jsx";
import BioSection from "./components/BioSection.jsx";
import ProjectsSection from "./components/ProjectsSection.jsx";
import SkillsSection from "./components/SkillsSection.jsx";
import AcademicSection from "./components/AcademicSection.jsx";
import AwardsSection from "./components/AwardsSection.jsx";
import WorldMapSection from "./components/WorldMapSection.jsx"
import Experience from "./components/Experience.jsx";
import Footer from "./components/Footer.jsx";
import ExperiencesTimeline from "./components/ExperiencesTimeline.jsx";

// i18n titles for the browser tab
const PAGE_TITLES = {
  en: "Alonso's Portfolio",
  es: "Portafolio de Alonso",
  ja: "アロンソのポートフォリオ",
  ko: "알론소의 포트폴리오",
};

// Utility: smooth-scroll to an element id (if present)
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function useInitTheme() {
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored || (prefersDark ? "dark" : "light");
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, []);
}

// Hook to update document title based on language
function useDynamicTitle() {
  useEffect(() => {
    const updateTitle = () => {
      const lang = localStorage.getItem("lang") || "en";
      document.title = PAGE_TITLES[lang] || PAGE_TITLES.en;
    };

    // Set initial title
    updateTitle();

    // Listen for language changes
    window.addEventListener("app:languageChanged", updateTitle);
    return () => window.removeEventListener("app:languageChanged", updateTitle);
  }, []);
}

function HomePage() {
  // Ensure page starts at top on first mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f4f8] dark:bg-[#0b1220] text-slate-800 dark:text-slate-100 selection:bg-cyan-400/20 transition-colors duration-300">
      <Header />
      {/* spacer for fixed header */}
      <div className="h-20 sm:h-24" />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-28">
        <section id="bio" className="scroll-mt-28">
          <BioSection />
        </section>

        <section id="experience-timeline" className="scroll-mt-28">
          <div className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <ExperiencesTimeline />
          </div>
        </section>

        <section id="skills" className="scroll-mt-28">
          <SkillsSection />
        </section>

        <section id="projects" className="scroll-mt-28">
          <ProjectsSection />
        </section>

        <section id="academic" className="scroll-mt-28">
          <AcademicSection />
        </section>

        {/* <section id="experience" className="scroll-mt-28">
          <Experience />
        </section> */}

        <section id="awards" className="scroll-mt-28">
          <AwardsSection />
        </section>

        <section id="travel" className="scroll-mt-28">
          <WorldMapSection />
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Route wrapper that renders HomePage then scrolls to the section id from the URL
function SectionRoute() {
  const { sectionId } = useParams();
  const location = useLocation();

  useEffect(() => {
    // delay to ensure HomePage DOM is laid out
    const t = setTimeout(() => scrollToId(sectionId), 50);
    return () => clearTimeout(t);
  }, [sectionId, location.pathname]);

  return <HomePage />;
}

function AppRouter() {
  useInitTheme();
  useDynamicTitle();

  return (
    <BrowserRouter>
      <Routes>
        {/* Root renders the whole one-page layout */}
        <Route path="/" element={<HomePage />} />

        {/* Pretty routes that deep-link to sections, e.g. /projects /skills etc. */}
        <Route path=":sectionId" element={<SectionRoute />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;