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

function HomePage() {
  // Ensure page starts at top on first mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1220] text-slate-100 selection:bg-cyan-400/20">
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

        <section id="contact" className="scroll-mt-28">
          {/* You can replace with a dedicated Contact component later */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
            <p className="mt-2 text-slate-300/90">Reach out for collaborations, freelance work, or robotics research ideas.</p>
          </div>
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