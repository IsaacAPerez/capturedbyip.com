# CapturedByIP — operating manual

Public marketing site for capturedbyip.com (LA photo/video studio brand). Exactly two pages — `index.html` and `pricing.html` — plus `css/`, `js/`, `favicon.svg`, `robots.txt`, `sitemap.xml`. Plain static HTML + CSS + vanilla JS (an ES5 IIFE in `js/cbip.js`, plus an inline pricing script in `pricing.html`). No build, no backend, no forms, no analytics, no secrets; every CTA links out to `https://isaacperez.co/#contact`.
Prime directive: `git push` to main IS a production deploy — there is no CI, staging, or review gate between your edit and the live site.

## Commands
- Local preview: `cd /Users/isaacperez/Coding/CapturedByIP && python3 -m http.server 8000` (or open `index.html` directly). No install, no build.
- Deploy: `git push` — Vercel auto-deploys main of `IsaacAPerez/capturedbyip.com` (project `capturedbyip`, id `prj_aby3ch3MwtKGHXKkqXahMS3e1CIF`, team `team_kglkY3kYg639waIJAEOnAyuQ`). Manual fallback `vercel --prod` exists (CLI 54.5.1, repo linked via `.vercel/project.json`) but ask before using it — the sanctioned path is push.
- Post-deploy check: `curl -s -o /dev/null -w '%{http_code}' https://capturedbyip.com/` → 200, then `curl -s https://capturedbyip.com/pricing.html | grep '<your change>'`.
- Commit: `git commit -m 'type(scope): subject'` — commit-msg hook (core.hooksPath → `/Users/isaacperez/Coding/platform/scripts/hooks`) rejects anything not matching `feat|fix|chore|refactor|docs|test|perf|build|ci|revert`, optional `(scope)`. `--no-verify` only if Isaac says so.
- "Tests": open both pages in a browser, zero console errors. There is no npm/build/test command — do not invent one.

## Conventions
- CSS classes are namespaced `cbip-*` (nav, cards, buttons — everything). New classes follow suit.
- Two-layer CSS: `css/design-system.css` = "Isaac Perez" brand tokens (CSS custom properties), `css/cbip.css` = page theme loaded after it with local tokens (`--ink`, `--ink-2`, `--line`, red accents). Use an existing token before writing a hex literal.
- Site JS is `js/cbip.js` — a single ES5 IIFE (`'use strict'`, `var`, function expressions) — plus one inline script block at the bottom of `pricing.html` holding `PRICING_CONFIG` (note: it uses `const`). No modules, no external scripts.
- All motion is gated: `prefers-reduced-motion` for animation, `pointer: fine` for pointer-follow effects (see the `reduce`/`fine` vars at the top of `js/cbip.js`). New effects get the same guards.
- Contact CTAs: `href="https://isaacperez.co/#contact"` with `rel="noopener"`. Never add a form.
- SEO is hand-maintained per page: `<title>`, canonical, `og:*`/`twitter:*` meta, JSON-LD ProfessionalService (index.html lines ~35–60), `robots.txt`, `sitemap.xml`.
- `.gitignore` has exactly one entry: `.vercel`. Keep it that way.
- Post-deploy curl verification after every push (added) — no CI means nobody else checks.
- Identity check before editing (added): `git remote -v` must show `IsaacAPerez/capturedbyip.com`. See the repo-name collision below.

## Mistakes you will make here
- **Editing prices in only one of the two places.** Every price in `pricing.html` exists twice: inline markup (`[data-price]`/`[data-addon]` spans, lines ~78–162) AND the `PRICING_CONFIG` object in the script block at the bottom (lines ~304–311), which overwrites the markup on DOMContentLoaded. Edit only markup → silently reverted in the browser; edit only the config → stale for no-JS users and crawlers.
  Rule: change BOTH to the same value, then verify with JS on (rendered page) and JS off (raw HTML/curl). Keys: packages `{sports, realestate, lifestyle, drone}`; addons `{sports-video, sports-extended, sports-social, re-drone, re-video, re-rush, brand-extended, brand-edits, brand-grading}`.
- **Doing iOS-app work in this repo.** The GitHub repo `IsaacAPerez/CapturedByIP` (no suffix) is the iOS app — a SwiftUI Immich client at `/Users/isaacperez/Coding/CapturedByIP-iOS`, with its own CI and the `mac-mini-capturedbyip` runner. THIS dir is `IsaacAPerez/capturedbyip.com`, slug `captured-by-ip-com` in products.json.
  Rule: anything Swift/Xcode/Immich/TestFlight/runner-related goes to `CapturedByIP-iOS`. This repo is HTML/CSS/JS only. `git remote -v` when in doubt.
- **Inventing a build/test/npm surface.** Agents default to `npm install` here; there is no package.json anywhere.
  Rule: never run npm/yarn/pnpm/npx, never add package.json or a bundler. Preview = `python3 -m http.server 8000`.
- **Editing the stale agent worktree as source.** `.claude/worktrees/bold-fermat-ed8ddf/` is a full duplicate site tree (branch `claude/bold-fermat-ed8ddf`, 1 behind main). Repo-wide grep hits it.
  Rule: never read/edit under `.claude/worktrees/`; exclude `.claude/` from searches. Don't delete it without asking either.
- **Re-adding GitHub Pages plumbing.** Hosting already flip-flopped once (CNAME added, removed 2026-04-11 on Vercel migration).
  Rule: never create CNAME, a deploy workflow, or Pages config. Hosting is Vercel auto-deploy, full stop.
- **Committing `.vercel/`.** It holds the project/org ids and Vercel says don't share it; it's the sole .gitignore entry.
  Rule: never `git add -f .vercel`, never touch the `.vercel` line in `.gitignore`.
- **Non-Conventional commit subject.** The repo's own history ("Redesign: matte black...") predates the fleet hook and will be rejected today.
  Rule: `type(scope): subject`, e.g. `fix(pricing): update sports package to $325`. Don't imitate old commits; don't `--no-verify` around the hook.
- **"Syncing" design-system.css with IsaacPerez.co.** Both repos have a same-header `css/design-system.css`, but they have diverged (commit caa600a added 17 lines here only). It's a fork, not an import.
  Rule: edit this repo's copy locally; never bulk-copy the file between repos unless Isaac asks.
- **Adding a page without the SEO surface.** `sitemap.xml` lists exactly the two live URLs; canonical/og:url are hand-written per page.
  Rule: a new page ships with `<title>`, canonical, `og:url`/`og:image`, twitter meta, `cbip-*` classes, CTAs to isaacperez.co/#contact, and a `<url>` entry in `sitemap.xml` (changefreq monthly).

## Quality bar
Page edit / new page:
- Both pages render at `http://localhost:8000` with zero browser-console errors.
- Diff contains no new hex literals where a token exists in `design-system.css`/`cbip.css`; all new classes are `cbip-*`.
- Any new animation is gated on `prefers-reduced-motion` (and `pointer: fine` if pointer-driven), matching existing guards in `js/cbip.js`.
- No NEW external `<script src>`/`<link href>`/font/CDN/analytics added (grep the diff for `http` in src/href — currently only local files, the isaacperez.co links, and the five youtube-nocookie.com iframe embeds in index.html, privacy-hardened in caa600a — keep youtube-nocookie, never plain youtube.com).
- New page → matching `sitemap.xml` entry + full meta set present.

Pricing update:
- The number appears identically in the inline markup AND `PRICING_CONFIG` (grep both occurrences).
- No `PRICING_CONFIG` key without a matching `data-price`/`data-addon` element, and vice versa.
- Rendered page (JS on) and raw HTML (curl / JS off) both show the new value.

SEO/metadata change:
- JSON-LD still parses: extract the `<script type="application/ld+json">` block and run it through `python3 -c "import json,sys; json.loads(sys.stdin.read())"`.
- canonical/og:url values are real `https://capturedbyip.com` URLs listed in `sitemap.xml`; `robots.txt` still points at `https://capturedbyip.com/sitemap.xml`.

Deploy:
- Commit passed the hook (no `--no-verify`); nothing under `.vercel/` or `.claude/` staged.
- After Vercel finishes: prod curl returns 200 and contains the change.

## When uncertain
- Prices, package names, add-ons: real quotes for a real business. NEVER invent or round a number — get exact figures from Isaac first. When asking, state the current value (both sources) and the proposed one.
- User-visible copy, taglines, JSON-LD business data: push = live. Get sign-off on wording before pushing unless Isaac dictated the exact text.
- Hosting/domain/DNS: creating CNAME or vercel.json, changing the Vercel project, or running `vercel --prod` — stop and ask.
- Backend, forms, analytics, API keys, any secret: out of scope by design. Stop; the work probably belongs in `CapturedByIP-iOS` or another repo. (Fleet secrets live in the 1Password Automation vault via `op read`, but this repo deliberately holds none.)
- Deleting/renaming published URLs (`index.html`, `pricing.html`) or removing sitemap/robots entries: breaks inbound links — ask first.
- The og:image/JSON-LD image hotlinks `https://isaacperez.co/isaac.JPG` (cross-repo dependency). Localizing or changing it affects IsaacPerez.co too — confirm with Isaac.
- Deleting `.claude/worktrees/bold-fermat-ed8ddf` or branch `claude/bold-fermat-ed8ddf`: ask; read-only ignore is the default.
- Decide alone: token-respecting CSS tweaks, a11y/reduced-motion fixes, typo fixes in non-price copy (still subject to the push sign-off above if user-visible), mechanical sitemap.xml sync.
