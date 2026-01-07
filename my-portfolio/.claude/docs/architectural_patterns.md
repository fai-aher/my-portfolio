# Architectural Patterns & Design Decisions

This document describes the recurring architectural patterns, design conventions, and key technical decisions used throughout the portfolio codebase.

---

## 1. JSON-Driven Content Architecture

**Pattern**: All content lives in static JSON files; components are pure presentation.

### Implementation
- All content in `src/data/*.json`
- Components import JSON and map to UI elements
- i18n values embedded as objects within JSON: `{ en: "...", es: "...", ja: "...", ko: "..." }`
- No backend, no API calls, fully static generation

### Example
```javascript
// src/data/experience.json
{
  "title": {
    "en": "Coordinator — SEED Alumni Project",
    "es": "Coordinador — Proyecto SEED Alumni",
    "ja": "コーディネーター — SEED Alumni",
    "ko": "코디네이터 — SEED Alumni"
  }
}

// Component usage
const title = pickLang(item.title, lang);
```

### Benefits
- Content changes don't require code changes
- Easy to add new languages
- Clear separation of concerns
- Deploy-time static generation (fast)

### File Reference
- Data Schema: src/data/experience.json:2-84
- Component Usage: src/components/ExperiencesTimeline.jsx:486-505

---

## 2. Custom i18n System

**Pattern**: localStorage-based language switching with event broadcasting.

### Implementation
```javascript
// Storage
localStorage.setItem("lang", "en");

// Helper function (duplicated across components)
function pickLang(value, lang) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || Object.values(value)[0] || "";
}

// Hook pattern
function useAppLanguage() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  useEffect(() => {
    const handler = (e) => setLang(e?.detail?.lang || localStorage.getItem("lang") || "en");
    window.addEventListener("app:languageChanged", handler);
    return () => window.removeEventListener("app:languageChanged", handler);
  }, []);
  return lang;
}

// Broadcasting changes
window.dispatchEvent(new CustomEvent("app:languageChanged", { detail: { lang } }));
```

### Supported Languages
- `en` — English (default)
- `es` — Español
- `ja` — 日本語
- `ko` — 한국어

### Why Not Use a Library?
- Small app, minimal overhead needed
- Full control over fallback logic
- No external dependencies
- Simple localStorage persistence

### File Reference
- Hook: src/components/ExperiencesTimeline.jsx:34-43
- Helper: src/components/ExperiencesTimeline.jsx:45-49
- Broadcast: src/components/Header.jsx:108
- UI Strings: src/components/Header.jsx:20-73

---

## 3. Modal Pattern for Detail Views

**Pattern**: Card/marker triggers modal; modal receives full item data; AnimatePresence handles animations.

### Structure
```javascript
// State
const [active, setActive] = useState(null);

// Trigger
<Card onClick={() => setActive(item)} />

// Modal Component
function Modal({ item, onClose }) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div className="fixed inset-0 z-[90]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          {/* Content */}
          <motion.div initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }} className="...">
            {/* Header: Title, Type Label, Close Button */}
            {/* Body: Desktop = side-by-side, Mobile = stacked */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Layout
- **Desktop**: Image right, content left (src/components/ExperiencesTimeline.jsx:263)
- **Mobile**: Image top, content below (src/components/ExperiencesTimeline.jsx:265-274)

### Consistent Elements
1. Header: Type label + Title + Close button
2. Meta section: Location, Dates, Duration (with emoji icons)
3. Summary/Description paragraph
4. Bullets list (highlights)
5. Technologies tags

### File Reference
- Modal Implementation: src/components/ExperiencesTimeline.jsx:222-370
- Card Grid Modal: src/components/Experience.jsx:181-318

---

## 4. Shared Helper Functions

**Pattern**: Common date/string utilities duplicated across components (could be extracted to `src/utils/`).

### Core Helpers

#### `pickLang(value, lang)`
Extracts localized string from i18n object or returns string as-is.
- Reference: src/components/ExperiencesTimeline.jsx:45-49

#### `parseDateLike(v)`
Accepts `YYYY`, `YYYY-MM`, `YYYY-MM-DD` and returns UTC Date object.
- Reference: src/components/ExperiencesTimeline.jsx:127-136

#### `formatPeriod(dates)`
Formats `{ start, end }` as `"YYYY-MM — YYYY-MM"` or `"YYYY-MM — Present"`.
- Reference: src/components/ExperiencesTimeline.jsx:117-120

#### `formatDuration(dates, lang)`
Calculates human-readable duration (e.g., `"2y 3mo"`, `"5 days"`).
- Treats ≤2 days as no duration (returns empty string).
- Reference: src/components/ExperiencesTimeline.jsx:138-166

#### `countryToFlagEmoji(country)`
Maps country name to flag emoji (e.g., `"Japan"` → `"🇯🇵"`).
- Reference: src/components/ExperiencesTimeline.jsx:180-218

### Opportunity for Refactoring
These helpers are currently duplicated in:
- `ExperiencesTimeline.jsx`
- `Experience.jsx`
- Other section components

**Recommendation**: Extract to `src/utils/i18n.js`, `src/utils/dates.js`, `src/utils/flags.js`.

---

## 5. Asset Handling Convention

**Pattern**: All assets in `/public/assets/`; use absolute paths only; never import.

### Rules
1. **Location**: All images, logos, icons in `/public/assets/`
2. **Paths**: Absolute paths starting with `/assets/...`
3. **Never Import**: Do NOT use `import logo from '../assets/logo.png'`
4. **JSON References**: Asset paths stored in JSON data files

### Example
```json
// ✅ Correct
{
  "logo": "/assets/logos/gorom.png",
  "featuredImage": "/assets/images/experiences/seed-coordinator.jpeg"
}

// ❌ Wrong
import logo from '../assets/logos/gorom.png'
```

### Directory Structure
```
public/assets/
  ├── images/            # Profile, experience photos
  ├── logos/             # Organization logos
  ├── icons/             # UI icons (if not using react-icons)
  └── worldmap/          # Travel map assets
```

### Why This Pattern?
- Vite automatically serves `/public/` as root
- No build-time processing needed
- Easier to reference from JSON
- Avoids import path complexity

---

## 6. Dark Mode & Theme System

**Pattern**: Class-based dark mode with Tailwind; localStorage persistence; system preference fallback.

### Implementation
```javascript
// Hook (src/components/Header.jsx:77-96)
function useTheme() {
  const getInitialTheme = () => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
```

### Tailwind Configuration
- Uses class-based dark mode (NOT media query)
- All dark styles via `dark:` variant
- Example: `bg-white dark:bg-slate-950`

### Default Theme
- **Dark mode by default** for robotics/tech aesthetic
- Neon cyan/blue accents

---

## 7. Visual Design Language

**Pattern**: Consistent visual primitives across all components.

### Color Palette
- **Background**: `bg-[#0b1220]` (dark blue-black)
- **Cards**: `bg-white/5` (dark mode), `bg-white/70` (light mode)
- **Borders**: `border-white/10` (dark), `border-black/10` (light)
- **Accent**: `text-cyan-400`, `bg-cyan-500/15`, `ring-cyan-300/30`
- **Text**: `text-slate-100` (dark), `text-slate-900` (light)

### Effects
1. **Hover Glow**: Gradient overlays with blur
   ```jsx
   <div className="absolute -inset-24 bg-gradient-to-r from-cyan-400/0 via-cyan-400/18 to-indigo-400/0 blur-2xl" />
   ```

2. **Glass Morphism**: Backdrop blur + semi-transparent backgrounds
   ```jsx
   className="bg-white/70 dark:bg-slate-950/70 backdrop-blur"
   ```

3. **Neon Highlights**: Shadow + ring combinations
   ```jsx
   className="shadow-[0_0_22px_rgba(34,211,238,0.25)] ring-2 ring-cyan-300/40"
   ```

### Rounded Corners
- Cards: `rounded-2xl`
- Buttons: `rounded-xl` or `rounded-full`
- Small elements: `rounded-lg`

### Typography
- **Body**: Inter (Google Fonts)
- **Accent/Logo**: Orbitron (Google Fonts)
- **Hierarchy**: `text-3xl sm:text-4xl` (responsive sizing)

---

## 8. Component Structure Pattern

**Pattern**: Consistent file organization for maintainability.

### Standard Structure
```javascript
// 1. Local i18n strings
const UI = {
  en: { /* ... */ },
  es: { /* ... */ },
  ja: { /* ... */ },
  ko: { /* ... */ },
};

// 2. Helper functions
function parseDate(v) { /* ... */ }
function formatDuration(dates) { /* ... */ }

// 3. Custom hooks
function useAppLanguage() { /* ... */ }

// 4. Subcomponents (if any)
function Card({ item }) { /* ... */ }

// 5. Main component
export default function SectionName() {
  const lang = useAppLanguage();
  // ...
  return (/* JSX */);
}
```

### File Reference
- Example: src/components/ExperiencesTimeline.jsx:1-925
- Example: src/components/Header.jsx:1-333

---

## 9. Timeline Architecture (ExperiencesTimeline)

**Pattern**: Unique horizontal timeline with advanced features.

### Core Concepts
1. **X-axis = Months**: Unit-based timeline starting Jan 2018
   - Each unit = 1 month
   - `ymToIndex({ y, m })` converts year-month to linear index
   - Desktop: 28px/unit, Mobile: 44px/unit

2. **Lane Packing**: Vertical row assignment to avoid overlaps
   - Greedy algorithm assigns each experience to lowest available lane
   - Reference: src/components/ExperiencesTimeline.jsx:592-629

3. **Gap Compression**: Long empty periods shown as `…` markers
   - Gaps ≥12 months compressed to ~2 units visual width
   - Reference: src/components/ExperiencesTimeline.jsx:536-558

4. **High School Simplification**: 2013-2019 period shown as continuous line from Jan 2018
   - Ellipsis marker indicates earlier start
   - Full dates preserved in modal
   - Reference: src/components/ExperiencesTimeline.jsx:603-615

5. **Auto-scroll to Recent**: Scrolls to right edge on load
   - Reference: src/components/ExperiencesTimeline.jsx:476-483

6. **Adaptive Hover Cards**: Expand left if near right edge, move up if near bottom
   - Prevents cards from overflowing container
   - Reference: src/components/ExperiencesTimeline.jsx:759-771

### Visual Elements
- **Start/End Markers**: Circular dots with glow on hover
- **Duration Bar**: Subtle rounded bar connecting start/end
- **Logo Marker**: Expandable card with logo, title, organization, "Show more" button
- **Flag Badge**: Country flag emoji overlaid on logo corner
- **Month Labels**: Shown above markers on hover

### File Reference
- Full Implementation: src/components/ExperiencesTimeline.jsx:461-925

---

## 10. Responsive Layout Strategy

**Pattern**: Mobile-first with breakpoint-specific layouts.

### Breakpoints (Tailwind)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px

### Common Patterns

#### Stacked → Side-by-Side
```jsx
<div className="grid gap-4 md:grid-cols-[1fr_0.9fr]">
  <div>{/* Content */}</div>
  <div>{/* Image */}</div>
</div>
```

#### Mobile-Only / Desktop-Only
```jsx
<div className="md:hidden">{/* Mobile */}</div>
<div className="hidden md:block">{/* Desktop */}</div>
```

#### Responsive Grid
```jsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {/* Cards */}
</div>
```

#### Responsive Text
```jsx
<h2 className="text-3xl sm:text-4xl">Title</h2>
```

### File Reference
- Modal Responsive Layout: src/components/ExperiencesTimeline.jsx:263-311
- Grid Example: src/components/Experience.jsx:361

---

## 11. Overflow Prevention Strategy

**Pattern**: Global and section-level overflow controls to prevent horizontal scroll bugs.

### Implementation
```css
/* index.css */
html, body, #root {
  overflow-x: hidden;
}
```

```jsx
// Timeline section (src/App.jsx:58-62)
<section id="experience-timeline" className="scroll-mt-28">
  <div className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
    <ExperiencesTimeline />
  </div>
</section>
```

### Rules
1. **Avoid**: `w-screen`, `100vw`, uncontrolled negative margins
2. **Use**: Contained widths with padding compensation
3. **Timeline**: Internal scroll container with fixed height

---

## 12. State Management Pattern

**Pattern**: Local component state; no global state library.

### Why No Redux/Zustand?
- Simple app with minimal shared state
- Language/theme stored in localStorage
- Each section is independent
- Event-based communication for language changes

### State Patterns
```javascript
// Local UI state
const [active, setActive] = useState(null);
const [filter, setFilter] = useState("all");

// Derived state
const filtered = useMemo(() => {
  if (filter === "all") return items;
  return items.filter(item => item.category === filter);
}, [items, filter]);

// Shared state via localStorage + events
localStorage.setItem("lang", "en");
window.dispatchEvent(new CustomEvent("app:languageChanged"));
```

---

## Summary of Key Decisions

| Decision | Rationale |
|----------|-----------|
| Static JSON data | No backend needed; fast, simple, version-controlled content |
| Custom i18n | Lightweight; no library overhead; full control |
| Class-based dark mode | Better performance than media query; user preference |
| Absolute asset paths | Simplifies JSON references; avoids import complexity |
| Component-local helpers | Quick prototyping; could be extracted later |
| No global state library | App is simple; localStorage + events sufficient |
| Modal pattern | Detailed views without navigation; better UX |
| Lane packing algorithm | Efficient use of vertical space in timeline |
| Mobile-first responsive | Core audience uses desktop, but mobile is essential for travel/events |

---

_Last updated: 2026-01-07_
