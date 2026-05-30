# CLAUDE.md — Cabinet (OTC Medicine Tracker PWA)

This file gives Claude Code the persistent rules for building **Cabinet**, an installable Progressive Web App for tracking over-the-counter medicines. Read it at the start of every session.

## What we're building
A single **installable PWA** that runs on **iOS (Safari) and Android (Chrome)** with easy install, offline support, and automated test + deploy via GitHub Actions. The full design spec lives in `design-reference/README.md` — it is the source of truth for look, behavior, tokens, screens, and the data model.

## Source of truth & golden rules
- **`design-reference/README.md` is authoritative.** Follow its design tokens, screen descriptions, interactions, and the *Recommended Stack & First Steps* section exactly.
- The files in `design-reference/` (`.html`, `.jsx`, `styles.css`) are **design references, not production code.** Recreate them in the real stack — do **not** copy `sw.js`, the in-browser Babel setup, `ios-frame.jsx`, or `tweaks-panel.jsx` into the app.
- **Never invent colors, fonts, spacing, or radii.** Use the tokens from the README / `styles.css`. If something isn't specified, ask before adding.
- **Don't add features, screens, or content** beyond the spec without asking. No filler.

## Stack (do not deviate without asking)
- **React 18 + TypeScript + Vite**
- **`vite-plugin-pwa`** (Workbox) for manifest + service worker — replaces the prototype's `sw.js`. `registerType: 'autoUpdate'`, runtime-cache Google Fonts.
- **Zustand** for state; **IndexedDB via `idb-keyval`** for offline-durable data (medicines, dose log). Ephemeral UI flags may use local/sessionStorage.
- **Vanilla CSS with the `--*` token variables** (imported once at root). Tailwind is acceptable only if the tokens are mapped into the theme — keep the custom properties as the design system either way.
- **Vitest + React Testing Library** (unit/component), **Playwright** (e2e + PWA smoke), **Lighthouse CI** (PWA budgets).

## PWA requirements (must hold on every build)
- Valid web manifest: name "Cabinet", `theme_color #1b3f37`, `background_color #eef4f3`, icons incl. the **maskable 512**.
- iOS install support: `apple-mobile-web-app-capable`, `apple-touch-icon`, `viewport-fit=cover`, and `env(safe-area-inset-*)` padding throughout.
- Adaptive shell: full-screen when `display-mode: standalone`; framed/preview + install banner otherwise.
- Install flow: Android/desktop one-tap via the live `beforeinstallprompt` event; iOS gets the guided "Add to Home Screen" sheet. Banner dismissal persists in `sessionStorage`.
- App shell must load **offline** after first visit.

## Project conventions
- Build in vertical slices, **one screen at a time**: scaffold + tokens + `Home` first, then `Detail → Dose → Add → Scan → Trends → Alerts → Share`. Show a working screen before moving on.
- Add tests alongside each screen/feature (especially dose-safety math, stock %, days-to-expire, alert derivation, email validation).
- Components: `Bottle` and `Icon` are SVG-in-code — recreate as components, don't rasterize.
- Accessibility: respect `prefers-reduced-motion`; hit targets ≥ 44px; semantic headings; labelled inputs.
- TypeScript strict mode on. No `any` without a comment justifying it.

## Data model (see README → State Management / `data.jsx`)
Medicine: `{ id, name, sub, active, dose, doseUnit, form, perDose, dailyMax, dailyMaxMg, stock, fullStock, expires(ISO), shelf, slot, preset, interactions[], history[28] }`.
Also: dose-log entries, alerts (severity danger/warn/info — derive, don't store, where possible), symptom log + metadata.

## Git & CI/CD
- Work on feature branches; open PRs. **Never push directly to `main`.**
- Two workflows (templates in README): `ci.yml` (lint + Vitest + Playwright + Lighthouse on every PR) and `deploy.yml` (GitHub Pages deploy on merge to `main`).
- Branch protection: `main` requires `ci.yml` green before merge.
- Set Vite `base` per repo type — see DECISIONS below.
- Conventional-commit style messages (`feat:`, `fix:`, `test:`, `chore:`).

## DECISIONS (confirm with the human before/at first build)
- [ ] **Repo type:** user/org site → `base: '/'`; project site → `base: '/cabinet/'`.
- [ ] **Seed vs empty:** ship with sample medicines from `data.jsx` (demo) OR start empty with an "add your first medicine" onboarding.
- [ ] **Deploy target:** GitHub Pages (default) or Netlify/Vercel/Cloudflare Pages.

## Definition of done (per slice)
Builds clean, types pass, lint passes, tests added & green, matches the spec visually (tokens honored), and — for shell/install work — Lighthouse PWA checks pass and the app installs over HTTPS on a real phone.
