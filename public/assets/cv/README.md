# Professional CV - LaTeX

This directory contains the LaTeX source code for your professional CV.

## How to Compile

### Option 1: Using Overleaf (Recommended for beginners)

1. Go to [Overleaf](https://www.overleaf.com/)
2. Create a new project or open an existing one
3. Copy the contents of `cv.tex` and paste it into your Overleaf project
4. Add your profile photo to the project (optional, see instructions below)
5. Click "Recompile" to generate the PDF
6. Download the PDF when ready

### Option 2: Using Local LaTeX Installation

If you have LaTeX installed locally (e.g., TeXLive, MiKTeX):

```bash
cd public/assets/cv
pdflatex cv.tex
```

Or use XeLaTeX for better font support:

```bash
xelatex cv.tex
```

## Customization

### Adding Your Photo

1. Add your profile photo to the same directory as `cv.tex` (or to the Overleaf project)
2. In `cv.tex`, find the line:
   ```latex
   \photo[64pt][0.4pt]{photo_placeholder}
   ```
3. Replace `photo_placeholder` with your photo filename (e.g., `profile.jpg`)
4. If you don't want to include a photo, comment out or delete this line

### Updating Personal Information

At the top of `cv.tex`, update these lines with your information:

```latex
\name{Fai}{Hernández Tamayo}
\title{Systems \& Computer Engineering Graduate}
\address{Bogotá}{Colombia}{}
\phone[mobile]{+57~XXX~XXX~XXXX}
\email{YOUR.EMAIL@example.com}
\social[linkedin]{your-linkedin-handle}
\social[github]{your-github-handle}
\homepage{ahernandezt.com}
```

### Changing Colors

The CV uses the "blue" color scheme by default. To change it, modify this line:

```latex
\moderncvcolor{blue}
```

Available colors: `blue`, `orange`, `green`, `red`, `purple`, `grey`, `black`

### Changing Style

The CV uses the "classic" style. To change it, modify this line:

```latex
\moderncvstyle{classic}
```

Available styles: `casual`, `classic`, `banking`, `oldstyle`, `fancy`

## CV Structure

The CV includes the following sections:

1. **Profile** - Brief professional summary
2. **Education** - Academic degrees and exchange programs
3. **Work Experience** - Professional positions and responsibilities
4. **Research Experience** - Research projects and presentations
5. **Competitions & Leadership** - Awards, competitions, and teaching experience
6. **Selected Projects** - Key technical projects
7. **Technical Skills** - Programming languages, frameworks, tools
8. **Awards & Honors** - Scholarships and recognitions
9. **Languages** - Language proficiency levels
10. **International Experience** - Study abroad and exchange programs
11. **Additional Information** - Website and interests

## Requirements

The CV uses the `moderncv` document class. If you're compiling locally, make sure you have it installed:

- **TeXLive**: Usually included by default
- **MiKTeX**: Install via package manager
- **Overleaf**: No installation needed, already available

## Tips

- Keep the CV to 2-3 pages maximum for best results
- Tailor the content to the position you're applying for
- Use bullet points for clarity and easy scanning
- Quantify achievements when possible (e.g., "Built platform used by 100+ people")
- Update regularly as you gain new experiences

## Generated From

This CV was automatically generated from the JSON data files in your portfolio:

- `src/data/experience.json`
- `src/data/projects.json`
- `src/data/skills.json`
- `src/data/academic.json`
- `src/data/awards.json`

To update the CV, either:
1. Manually edit `cv.tex` directly, or
2. Update the JSON files and regenerate (contact Claude Code for assistance)

---

Good luck with your applications! 🚀
