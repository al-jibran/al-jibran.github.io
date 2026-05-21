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

Sticky masthead.

Desktop:
`JIBRAN DEV | Software Engineering Journal`

Mobile:
`☰ JIBRAN DEV`

Header classes:

```astro
sticky top-0 z-30
bg-[var(--bg)]/90
backdrop-blur-sm
```

## Sidebar

File: `Sidebar.astro`

Behavior:
- sticky
- desktop only
- scrollable

Suggested:

```txt
top-[81px]
h-[calc(100vh-73px)]
overflow-y-auto
```

## Mobile Menu

Implemented inside `Header.astro`.

Uses vanilla JS.

Avoid React.

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

## Content Collections

File:
`src/content.config.ts`

Uses:

```ts
loader: glob({
  base: "./src/content/blog",
  pattern: "**/*.{md,mdx}"
})
```

Use `z.coerce.date()`.

NOT `z.date()`.

## MDX Frontmatter

```md
---
title: Title
description: Description
pubDate: 2026-05-11
featured: true
draft: false
readingTime: "8 min read"
---
```

No category in frontmatter.

## Routing

Use:
`src/pages/blog/[...slug].astro`

NOT:
`[slug].astro`

## Astro v6 Notes

With `loader: glob(...)`:

Do NOT use:

```ts
post.render()
```

Use:

```ts
import { render } from "astro:content"
await render(post)
```

Do NOT use:
`post.slug`

Use:
`post.id`

## Article Typography

Class:
`editorial-prose`

Goal:
Premium technical reading.

Behavior:
- readable paragraphs
- elegant headings
- subtle code styling
- editorial spacing
- wide code blocks

## TOC

Use:

```ts
const { headings } = await render(post)
```

Only show:

```ts
depth === 2
```

Desktop:
sticky TOC.

Mobile:
collapsible details section.

## Responsiveness

Home page:
Responsive.

Blog page fixes:
- smaller mobile padding
- stacked layout
- collapsible mobile TOC
- typography scaling

## Overflow Fixes

Common causes:
- code blocks
- images
- blockquotes
- tables
- long URLs

Important:
Use `min-w-0` in flex layouts.

Example:

```astro
<div class="flex min-w-0">
<article class="min-w-0">
```

Desired behavior:
- Page never scrolls horizontally
- Code block scrolls horizontally

Overflow fixes go outside media queries.

## Remaining TODOs

High Priority:
- Active article highlight in sidebar
- Active TOC section highlight
- Dark mode
- Better featured article layout
- Article metadata polish

Medium Priority:
- Search
- Related articles
- Previous / next article
- RSS feed
- SEO metadata
- sitemap

Future:
- Interactive system design diagrams
- DSA visualizers
- Architecture playgrounds

Only use React for these.

## Critical Rule

Before any UI change ask:

> Does this feel like an engineering newspaper?

If not:
Reject the idea.

