# Neon Blue Color Reference for Icons

These are the hexadecimal color codes for the neon blue/cyan colors used throughout your portfolio. Use these when creating custom SVG icons to maintain visual consistency.

## Primary Neon Blue Colors (Tailwind Cyan Palette)

### Main Icon Color (Recommended)
- **Cyan 300** - `#67e8f9` - This is the DEFAULT color for all tech icons
  - RGB: `rgb(103, 232, 249)`
  - Used in: TechIcon component, most skill icons

### Accent & Hover Colors
- **Cyan 400** - `#22d3ee` - Brighter accent for hover states
  - RGB: `rgb(34, 211, 238)`
  - Used in: Button hovers, interactive elements

- **Cyan 500** - `#06b6d4` - Medium cyan for backgrounds
  - RGB: `rgb(6, 182, 212)`
  - Used in: Tag backgrounds, primary buttons

- **Cyan 600** - `#0891b2` - Darker cyan for borders
  - RGB: `rgb(8, 145, 178)`
  - Used in: Borders, darker accents

### Light Variations
- **Cyan 200** - `#a5f3fc` - Lighter shade
  - RGB: `rgb(165, 243, 252)`
  - Used in: Light mode text accents

- **Cyan 100** - `#cffafe` - Very light shade
  - RGB: `rgb(207, 250, 254)`
  - Used in: Subtle backgrounds

### Dark Variations
- **Cyan 700** - `#0e7490` - Deep cyan
  - RGB: `rgb(14, 116, 144)`
  - Used in: Dark mode accents

## Complementary Colors

### Indigo (Secondary Accent)
- **Indigo 400** - `#818cf8` - Purple-blue accent
  - RGB: `rgb(129, 140, 248)`
  - Used in: Gradients, secondary elements

- **Indigo 500** - `#6366f1` - Medium indigo
  - RGB: `rgb(99, 102, 241)`

## Usage Guidelines

### For Tech Icons (SVG Files)
1. **Primary icon fill**: Use **Cyan 300** (`#67e8f9`)
2. **Icon highlights**: Use **Cyan 200** (`#a5f3fc`)
3. **Icon shadows/depth**: Use **Cyan 600** (`#0891b2`)

### For Logo Design
- Main color: `#67e8f9` (Cyan 300)
- Keep SVG paths simple
- Ensure icons work in both light and dark modes
- The TechIcon component applies a CSS filter to make icons cyan

### Filter Applied by TechIcon Component
The component automatically applies this filter to custom SVG icons:
```css
filter: brightness(0) saturate(100%) invert(87%) sepia(14%) saturate(1087%) hue-rotate(146deg) brightness(99%) contrast(96%)
```
This filter converts any color to the cyan-300 color.

## Creating Your openai.svg

For the OpenAI icon, you can:
1. Use a solid fill color of `#67e8f9` (cyan-300)
2. OR use any color - the component will auto-convert it to cyan
3. Keep the viewBox at "0 0 24 24" for consistency
4. Save it as `public/assets/icons/openai.svg`

## Files That Use Custom Icons

Currently using custom SVG icons:
- ✅ `aws.svg` - Amazon Web Services
- ✅ `heroku.svg` - Heroku
- ⏳ `openai.svg` - OpenAI (to be added by you)
- ✅ `oracle.svg` - Oracle
- ✅ `sql.svg` - SQL

All custom icons will automatically be styled with the cyan-300 neon blue color.
