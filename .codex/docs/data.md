# Data Files and Localization
- All content is JSON-driven under `src/data/` (examples: `src/data/awards.json:1`, `src/data/travel.json:1`, `src/data/projects.json:1`).
- Localized strings are stored as objects with `en/es/ja/ko` keys (example: `src/data/awards.json:3`).
- Components resolve localized values with helper functions like `pickLang` and `pickTravelText` (`src/components/AwardsSection.jsx:35`, `src/components/WorldMapSection.jsx:141`).

## Key data sources
- Awards: `src/data/awards.json:1`
- Travel map pins and stories: `src/data/travel.json:1`
- Experience timeline: `src/data/experience.json:1`
- Projects: `src/data/projects.json:1`
- Skills: `src/data/skills.json:1`
- Academic: `src/data/academic.json:1`
