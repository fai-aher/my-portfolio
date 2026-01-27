# Project Overview
- Purpose: personal portfolio site with sections for bio, timeline, skills, projects, academics, awards, and world map. See layout composition in `src/App.jsx:66`.
- Entry point mounts the React app and global CSS (Tailwind + flags) in `src/main.jsx:1`.
- Routing supports the one-page home plus deep-link section routes in `src/App.jsx:133`.

# Tech Stack
- React 19 + Vite 7 app (`package.json:15`, `package.json:34`).
- Tailwind CSS v4 via PostCSS with class-based dark mode (`src/index.css:1`, `src/index.css:4`).
- Animation and UI helpers: Framer Motion, React Icons, Flag Icons (`package.json:13`, `package.json:14`, `package.json:17`).
- Client-side routing with React Router (`package.json:18`, `src/App.jsx:2`).

# Key Directories
- `src/components/`: section-level UI components used by the home page (`src/App.jsx:11`).
- `src/data/`: JSON content that drives sections (awards, travel map, projects, etc.) (`src/data/awards.json:1`).
- `public/assets/`: static images referenced from data files (example: awards images in `src/data/awards.json:89`).
- `src/index.css`: global styles and Tailwind setup (`src/index.css:1`).

# Essential Build/Test Commands
- `npm run dev` (local dev server) (`package.json:7`).
- `npm run build` (production build) (`package.json:8`).
- `npm run preview` (serve build output) (`package.json:10`).
- `npm run lint` (ESLint) (`package.json:9`).

# Additional Documentation (see when relevant)
- `.codex/docs/sections.md` — map of page sections and owning components (entry in `src/App.jsx:78`).
- `.codex/docs/data.md` — data file schema notes and localization patterns (see `src/data/awards.json:1`).
- `.codex/docs/i18n.md` — language storage and event flow (see `src/App.jsx:50`).
