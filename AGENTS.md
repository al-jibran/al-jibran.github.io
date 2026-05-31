# AGENTS.md

## Project Overview

This is a personal technical blog for **software engineering**, focused on:

- Software Engineering
- Software Design
- System Design
- Problem Solving
- Engineering Notes
- Real problems solved

The goal is **deep technical writing**, not a portfolio website.

This site should feel like:

> A software engineering newspaper / engineering journal

Not:

> A SaaS landing page, portfolio, Medium clone, or startup blog.

## Tech Stack

- Astro v6
- TailwindCSS v4
- React v19 installed, but avoid React unless absolutely necessary
- Prefer `.astro` components over React

## Design Philosophy

Visual goal:

**Engineering Journal × Documentation Site**

Avoid:
- SaaS aesthetics
- flashy animations
- gradients
- dashboard vibes
- giant rounded cards
- excessive shadows

Prefer:
- serif typography
- thin borders
- asymmetry
- editorial spacing
- understated interactions
- black & white aesthetic

## Typography

- Headings: Playfair Display
- Body: Source Serif 4
- Code: JetBrains Mono

## Color Palette

```css
/* Sepia */
:root, [data-theme="sepia"] {
  --bg: #f4ecd8;
  --text: #2c2826;
  --muted: #796e65;
  --border: #dfd3bd;
}

/* Light */
[data-theme="light"] {
  --bg: #ffffff;
  --text: #111111;
  --muted: #666666;
  --border: #e5e5e5;
}

/* Default: Dark */
[data-theme="dark"] {
  --bg: #111111;
  --text: #f7f4ee;
  --muted: #a3a3a3;
  --border: #333333;
}
```

## Icons & Assets

- Place SVG files directly in `src/assets/`.
- Import SVGs with the `?raw` suffix and inject them into components using `set:html` (e.g. `import myIcon from '../assets/icon.svg?raw'` and `<div set:html={myIcon} />`).
- This allows SVGs to inherit Tailwind text colors (like `text-[var(--muted)]` and `hover:text-black`) perfectly.

## Layout Philosophy

Desktop layout:

Sidebar | Content | TOC

### Sidebar
Navigation only.

Do NOT put:
- intro text
- quotes
- branding copy
- fluff

Sidebar = article index grouped by category.

### Content
Primary reading experience.

### TOC
Right-side table of contents.
Only H2 headings.

## Header

File: `Header.astro`

## Sidebar

File: `Sidebar.astro`

## Content Architecture

```txt
src/
└── content/
    └── blog/
        ├── software-design/
        ├── system-design/
        ├── software-engineering/
        └── problem-solving/
```

Folder name = category.

## Agent Rules For Development

When adding, modifying or deleting code:

Do not build the project
Do not delete files without permission


## Agent Rules For Blog Content

When modifying blog posts:

Do not generate article ideas.
Do not generate technical explanations.
Do not generate implementations for topics discussed in articles.
Do not rewrite content to optimize engagement, SEO, or virality.
Do not change the author's tone or opinions.
Preserve grammatical imperfections when they are stylistic.

You may:

Fix grammar mistakes.
Fix spelling mistakes.
Fix broken Markdown.
Fix broken links.
Point out factual inaccuracies.
Suggest clearer phrasing when requested.

When editing technical articles:

Prefer accuracy over readability.
Do not simplify technical concepts unless explicitly requested.
Do not replace examples with AI-generated alternatives.
Do not add content that the author has not written or verified.

The purpose of this blog is to document the author's understanding of software systems, algorithms, abstractions, and implementations.