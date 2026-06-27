# CapturedByIP — web

Static marketing site for **CapturedByIP**, a Los Angeles photo & video studio
("cinematic photo & video for sports, spaces, and stories"). Two pages: a home
page and a pricing page. No build step, no backend, no framework.

## Sibling repo (same product, different surface)
- **This repo** (`/Users/isaacperez/Coding/CapturedByIP`) = the public **marketing website** (capturedbyip.com).
- **`/Users/isaacperez/Coding/CapturedByIP-iOS`** = the **iOS app** (SwiftUI, an Immich photo-library client). Same product brand, entirely separate stack. App work goes there, not here.

## Stack
- Plain **static HTML + CSS + vanilla JS**. No package.json, no bundler, no Node deps, no test suite.
- Deployed on **Vercel** (project `capturedbyip`, id `prj_aby3ch3MwtKGHXKkqXahMS3e1CIF`, team `team_kglkY3kYg639waIJAEOnAyuQ`). Pushing to git triggers the Vercel deploy — there is no CI workflow in this repo.

## Layout
- `index.html` — home page.
- `pricing.html` — pricing tiers (Sports / Real Estate / Lifestyle), prices live inline in markup + `data-price`/`data-addon` attrs.
- `css/cbip.css` — page-specific styles (`cbip-*` class namespace).
- `css/design-system.css` — shared "Isaac Perez" design tokens (CSS custom properties: colors, spacing, type). Prefer these vars over hardcoded values.
- `js/cbip.js` — IIFE: mobile nav, scroll progress, reveal animations, cursor glow, card spotlight. All motion respects `prefers-reduced-motion`.
- `favicon.svg`, `robots.txt`, `sitemap.xml` — static assets/SEO. Keep `sitemap.xml` in sync when adding pages.

## Run / preview / deploy
- **Local preview**: open `index.html` directly, or serve the dir, e.g. `python3 -m http.server 8000`. No install/build.
- **Deploy**: push to git (Vercel auto-deploys). `vercel` CLI also works against the linked project.
- There is **no `npm`/build/test command** — do not invent one.

## Conventions & red lines
- CSS classes are namespaced `cbip-*`; design tokens come from `css/design-system.css`.
- Pricing/copy and SEO/JSON-LD live inline in the HTML — edit there.
- Contact CTAs link out to `https://isaacperez.co/#contact` (no form/backend here).
- `.gitignore` only ignores `.vercel/` (contains project/org ids — keep it out of git).
- No secrets, API keys, or backend in this repo. If a task needs an API/DB/Immich, it belongs to the **-iOS** sibling.
- `.claude/worktrees/` is an agent scratch worktree — ignore it, don't edit it as source.
