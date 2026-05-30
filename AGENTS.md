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

**The New York Times × Engineering Journal × Documentation Site**

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
:root {
  --bg: #f7f4ee;
  --text: #111111;
  --muted: #666666;
  --border: #d8d3ca;
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