# Portfolio Website — Claude Code Guide

**Purpose**: High-end professional portfolio for robotics research, software engineering, and international experience. Target audience: MSc/PhD applications, research labs, fellowships, and international tech roles.

**Domain**: ahernandezt.com
**Deployment**: GitHub Pages / Cloudflare Pages

---

## Tech Stack

- **Frontend**: React 19.2 + Vite 7.2
- **Styling**: Tailwind CSS 4.1 (class-based dark mode)
- **Animations**: Framer Motion 12.2
- **Icons**: react-icons 5.5 (Heroicons v2)
- **Routing**: react-router-dom 7.9
- **Data**: Static JSON files (no backend)
- **Fonts**: Inter (body), Orbitron (accent)

---

## Project Structure

```
my-portfolio/
├── public/assets/          # All images, logos, icons
│   ├── images/             # Experience photos, profile
│   ├── logos/              # Organization logos
│   └── worldmap/           # Travel map assets
├── src/
│   ├── components/         # React components
│   │   ├── Header.jsx                    (src/components/Header.jsx:1)
│   │   ├── BioSection.jsx
│   │   ├── ExperiencesTimeline.jsx       (src/components/ExperiencesTimeline.jsx:461)
│   │   ├── Experience.jsx                (src/components/Experience.jsx:322)
│   │   ├── SkillsSection.jsx
│   │   ├── ProjectsSection.jsx
│   │   ├── AcademicSection.jsx
│   │   ├── AwardsSection.jsx
│   │   ├── WorldMapSection.jsx
│   │   └── Footer.jsx
│   ├── data/               # JSON data files
│   │   ├── experience.json               (src/data/experience.json:1)
│   │   ├── projects.json
│   │   ├── skills.json
│   │   ├── academic.json
│   │   ├── awards.json
│   │   └── certifications.json
│   ├── App.jsx                           (src/App.jsx:1)
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── index.html
```

---

## Key Directories & Their Purpose

### `/public/assets/`
- **Purpose**: All static assets (images, logos, icons)
- **CRITICAL**: Use absolute paths only: `/assets/images/profile.jpeg`
- **Never** import from `src/assets`

### `/src/data/`
- **Purpose**: Static JSON files driving all content
- **Schema**: Each JSON contains i18n objects with `en`, `es`, `ja`, `ko` keys
- **Key Files**:
  - `experience.json` — Work, research, competitions, education (src/data/experience.json:1)
  - `projects.json` — Portfolio projects
  - `skills.json` — Technical skills with logos
  - `academic.json` — Degrees, courses
  - `awards.json` — Honors and awards

### `/src/components/`
- **Purpose**: React UI components
- **Pattern**: Each component includes local i18n, helpers, and exports default
- **Critical Components**:
  - `ExperiencesTimeline.jsx` — Advanced horizontal timeline with lane packing (src/components/ExperiencesTimeline.jsx:461)
  - `Experience.jsx` — Card grid with pagination and modals (src/components/Experience.jsx:322)
  - `Header.jsx` — Navigation, theme toggle, language switcher (src/components/Header.jsx:1)

---

## Section Order in App.jsx

Rendered in this exact order (src/App.jsx:47-94):
1. Biography (`#bio`)
2. Experience Timeline (`#experience-timeline`) — Full-width, below Bio
3. Skills (`#skills`)
4. Projects (`#projects`)
5. Academic Background (`#academic`)
6. ~~Experiences (card grid)~~ — Currently commented out
7. Awards (`#awards`)
8. World Map (`#travel`)
9. Contact (`#contact`)

Each section uses `scroll-mt-28` for proper anchor scrolling.

---

## Essential Build/Dev Commands

```bash
# Development
npm run dev              # Start dev server (Vite)

# Production
npm run build            # Build for deployment
npm run preview          # Preview production build

# Linting
npm run lint             # ESLint check
```

---

## Data Schema Reference

### experience.json Schema
Each experience object (src/data/experience.json:2-84):
```json
{
  "id": "string",
  "type": "work | research | exchange | competition | teaching | ...",
  "typeLabel": { "en": "...", "es": "...", "ja": "...", "ko": "..." },
  "organization": { "en": "...", ... } | "string",
  "location": "City, Country",
  "country": "Country",
  "logo": "/assets/logos/org.png",
  "title": { "en": "...", ... },
  "dates": { "start": "YYYY-MM", "end": "YYYY-MM | null" },
  "summary": { "en": "...", ... },
  "bullets": [{ "en": "...", ... }],
  "technologies": ["React", "Python", ...],
  "featuredImage": "/assets/images/experience/image.jpg",
  "ui": {
    "showMore": { "en": "Show more details", ... },
    "close": { "en": "Close", ... }
  }
}
```

---

## Critical Implementation Details

### i18n System
- **Storage**: `localStorage.getItem("lang")` (default: `"en"`)
- **Supported Languages**: `en`, `es`, `ja`, `ko`
- **Helper**: `pickLang(value, lang)` extracts localized string (src/components/ExperiencesTimeline.jsx:45-49)
- **Broadcasting**: `window.dispatchEvent(new CustomEvent("app:languageChanged"))` (src/components/Header.jsx:108)
- **Hook**: `useAppLanguage()` listens for language changes (src/components/ExperiencesTimeline.jsx:34-43)

### Theme System
- **Storage**: `localStorage.getItem("theme")` + system preference fallback
- **Implementation**: Tailwind's class-based dark mode (`dark:` variants)
- **Toggle**: Header component (src/components/Header.jsx:133)
- **Classes**: `.dark` applied to `<html>` element

### ExperiencesTimeline Advanced Features
See (src/components/ExperiencesTimeline.jsx:461-924):
- **X-axis**: Months since Jan 2018 (configurable at src/components/ExperiencesTimeline.jsx:468)
- **Auto-scroll**: Scrolls to most recent on load (src/components/ExperiencesTimeline.jsx:476-483)
- **Lane Packing**: Algorithm to avoid vertical overlaps (src/components/ExperiencesTimeline.jsx:592-629)
- **Gap Compression**: Long empty periods compressed to `…` markers (src/components/ExperiencesTimeline.jsx:536-558)
- **High School Simplification**: 2013-2019 rendered as continuous line from Jan 2018 (src/components/ExperiencesTimeline.jsx:603-615)
- **Hover Cards**: Expand left if near right edge, move up if near bottom (src/components/ExperiencesTimeline.jsx:759-771)

### Overflow Protection
**CRITICAL** to prevent horizontal scroll bugs (src/App.jsx:48 and index.css):
- `overflow-x: hidden` on `html`, `body`, `#root`
- Timeline section also uses `overflow-x-hidden`
- Avoid `w-screen`, `100vw`, or uncontrolled negative margins

---

## Additional Documentation

For specialized topics, see:

- [Architectural Patterns](.claude/docs/architectural_patterns.md) — Design patterns, conventions, and architectural decisions used throughout the codebase

---

## Common Gotchas

1. **Assets**: Always use `/assets/...` (absolute), never `import` from `src/assets`
2. **i18n**: JSON values can be `string` OR `{ en, es, ja, ko }` — use `pickLang()` helper
3. **Dates**: Accept `YYYY`, `YYYY-MM`, `YYYY-MM-DD` — use `parseDateLike()` (src/components/ExperiencesTimeline.jsx:127-136)
4. **Duration**: One-day experiences return empty string from `formatDuration()` (src/components/ExperiencesTimeline.jsx:159)
5. **Modals**: Use `AnimatePresence` for proper exit animations (src/components/ExperiencesTimeline.jsx:224)
6. **Dark Mode**: NEVER hardcode colors — always use Tailwind's `dark:` variants
7. **No Backend**: All data is static JSON, no API calls allowed

---

## Development Workflow

1. **Data Changes**: Edit JSON files in `src/data/`
2. **UI Changes**: Edit React components in `src/components/`
3. **Styling**: Use Tailwind utility classes (no CSS files except index.css)
4. **Assets**: Add to `/public/assets/`, reference with absolute paths
5. **Testing**: `npm run dev` → check all sections, test mobile + desktop

---

_Last updated: 2026-01-07_
