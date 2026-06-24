# AGENTS.md

## Tech Stack

- Astro v6
- TailwindCSS v4
- React v19 installed
- Prefer `.astro` components over React

## Design Philosophy

Avoid:
- SaaS aesthetics
- flashy animations
- gradients
- dashboard vibes
- giant rounded cards
- excessive shadows

Prefer:
- tile layout styling
- serif typography
- editorial spacing

## Icons & Assets

- Place SVG files directly in `src/assets/`.
- Import SVGs with the `?raw` suffix and inject them into components using `set:html` (e.g. `import myIcon from '../assets/icon.svg?raw'` and `<div set:html={myIcon} />`).

## Content Architecture

Quick lookup paths:

```txt
src/
├── assets/
│   ├── fonts/                  # Playfair Display, Source Serif 4, JetBrains Mono
│   ├── github.svg
│   ├── linkedin.svg
│   └── cv.svg
├── components/
│   ├── Footer.astro
│   ├── Header.astro
│   └── Sidebar.astro           # article index grouped by category
├── content/
│   └── blog/
│       ├── commentary/         # commentary essays
│       ├── the-blog/           # posts about the blog itself
│       └── resources/          # recommendations/resources category
├── layouts/
│   └── MainLayout.astro        # site shell
├── lib/
│   └── blog.ts                 # blog collection helpers/category grouping
├── pages/
│   ├── blog/[...slug].astro    # dynamic blog post routes
│   ├── index.astro             # homepage
│   └── rss.xml.js              # RSS feed metadata/content
├── styles/
│   └── global.css              # global styling and typography
├── consts.ts                   # site title/description constants
└── content.config.ts           # Astro content collection schema
```

Folder name = category.

## Agent Rules For Development

When adding, modifying or deleting code:

Do not build the project 
Do not delete files without permission
In case of a conflict between AGENTS.md and the source code, ask the author before changing the source code.

## Agent Rules For Blog Content

When modifying blog posts:

Do not generate article ideas. Do not generate technical explanations. Do not generate implementations for topics discussed in articles. Do not rewrite content to optimize engagement, SEO, or virality. Do not change the author's tone or opinions. Preserve grammatical imperfections when they are stylistic.

You may:

Fix grammar mistakes. Fix spelling mistakes. Fix broken Markdown. Fix broken links. Point out factual inaccuracies. Suggest clearer phrasing when requested.

When editing technical articles:

Prefer accuracy over readability.
Do not simplify technical concepts unless explicitly requested.
Do not replace examples with AI-generated alternatives.
Do not add content that the author has not written or verified.
