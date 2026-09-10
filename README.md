# AIR

Amit’s Intelligent Resources.

`AIR` is Amit Ayre’s digital desk drawer: a collection of small, useful tools, strange experiments, and useful systems. Each project is one markdown file with a screenshot; the homepage filters them by status (Live · Building · Paused · Archived · Idea).

Useful things, made anyway.

Production: [labs.amitayre.com](https://labs.amitayre.com)

## Run it locally

```bash
npm install
npm run dev      # → http://localhost:5180
```

## Add a new project

1. Create `src/projects/<slug>.md` with frontmatter (copy-paste shape from any existing file)
2. Drop a screenshot at `public/screenshots/<slug>.svg` (or `.png`)
3. That's it — Vite globs `src/projects/*.md` automatically, no registry to update

### Frontmatter shape

```yaml
---
slug: my-project
title: My Project
oneLiner: One sentence about what it does.
status: live          # live | building | paused | archived | idea
shippedAt: 2026-05-11
tags: [tag, another, third]
screenshot: /screenshots/my-project.svg
links:
  - { label: "GitHub repo", url: "https://github.com/..." }
  - { label: "Live page", url: "https://..." }
---

## Why I built it

...

## What it is

...
```

The first link in `links[]` becomes the **primary CTA** in the modal. Placeholder URLs (`#`) hide the CTA gracefully.

## Status taxonomy

| Status | What it means |
|--------|---------------|
| `live` | Shipped and architecturally complete. Quiet ≠ paused — a cron that's currently silent because of an upstream dependency is still Live. |
| `building` | Under active construction, not yet shipped |
| `paused` | Work was started but deprioritized; resumption uncertain |
| `archived` | Intentionally retired |
| `idea` | Not started yet |

Cards sort by status order (live → building → paused → archived → idea), then by most recent `shippedAt` within each group.

## Build and deploy

```bash
npm run build    # → dist/
```

Netlify builds the site from the repository with `npm run build` and publishes `dist/`. The production domain is `labs.amitayre.com`.

GitHub Pages uses the same source with `VITE_BASE_PATH=/house-of-air/` so assets resolve correctly from the repository subpath.

## Stack

- Vue 3 + Vue Router + Vite
- `marked` for the markdown bodies (parses inline; lightweight)
- System fonts only — Iowan Old Style / Palatino for serif headlines, system sans for body, SF Mono for mono. No web fonts loaded.
- Warm paper theme with deep ink, sky blue, and small sun-yellow details
- Hash routing (`createWebHashHistory`) so a static build deploys cleanly to any subpath

## Project structure

```
~/made-anyway/
├── package.json
├── vite.config.js
├── index.html
├── public/
│   ├── favicon.svg
│   └── screenshots/         # one .svg or .png per project
└── src/
    ├── main.js, App.vue, router.js
    ├── projects.js          # frontmatter parser + status sort
    ├── styles/main.css      # CSS vars, focus rings, reduced-motion
    ├── projects/            # one .md per project — the only file you edit to add new content
    ├── components/
    │   ├── ProjectCard.vue
    │   ├── ProjectModal.vue
    │   ├── StatusPill.vue
    │   └── StatusLegend.vue
    └── views/
        └── Home.vue
```
