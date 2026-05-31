# Cabinet — OTC Medicine Tracker (PWA)

A calm, apothecary-styled **Progressive Web App** for tracking the over-the-counter
medicines you keep at home — stock, doses, expirations, daily-max safety, refills,
and usage trends. Installable on **iOS (Safari)** and **Android/desktop (Chrome)**,
works **offline**, no app store required.

Built from the [Claude Design](https://claude.ai/design) handoff in
[`design-reference/`](./design-reference) — see [`CLAUDE.md`](./CLAUDE.md) for the
build rules and design tokens.

## Stack

- **React 18 + TypeScript (strict) + Vite**
- **`vite-plugin-pwa`** (Workbox) — manifest, service worker, offline app shell, `autoUpdate`
- **Zustand** state, persisted to **IndexedDB** via `idb-keyval`
- **Vanilla CSS** with the design-token custom properties (`src/styles/tokens.css`)
- **Vitest + Testing Library** (unit/component), **Playwright** (e2e), **Lighthouse CI** (PWA budgets)

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173/cabinet/
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint (zero warnings allowed) |
| `npm run typecheck` | `tsc` project references, no emit |
| `npm test` | Vitest unit + component tests |
| `npm run e2e` | Playwright end-to-end (builds + previews first) |
| `npm run lhci` | Lighthouse CI against an assembled `_site/` |

## Screens

`Home` (cabinet shelves) · `Detail` · `Dose` (log + daily-max safety) · `Add` ·
`Scan` (barcode + photo) · `Trends` (safety, most-used, symptom heatmap, refill
predictions) · `Alerts` · `Share` (email an install link). A time-aware launch
**Splash** shows once per session.

## Install behavior

- **Installed** (`display-mode: standalone`) → fills the screen, safe-area aware.
- **In a browser** → device-frame preview + an "Install Cabinet" banner.
  - Android / desktop Chrome: native one-tap via `beforeinstallprompt`.
  - iOS Safari: guided "Add to Home Screen" sheet (Apple has no programmatic install).

## Project layout

```
src/
  components/   Bottle, Icon, Splash, IOSDevice, InstallUI, TabBar
  screens/      Home, Detail, Dose, Add, Scan, Trends, Alerts, Share
  store/        Zustand store + IndexedDB persistence
  lib/          safety math, datetime, PWA detection (unit-tested)
  data/         seed medicines, alerts, symptom log + types
e2e/            Playwright specs
design-reference/   original Claude Design prototype (not shipped)
```

## CI/CD

- **`.github/workflows/ci.yml`** — lint, typecheck, unit tests, build, Playwright
  e2e, and Lighthouse PWA budgets on every PR and push to `main`.
- **`.github/workflows/deploy.yml`** — builds and deploys to **GitHub Pages** on
  push to `main`.

### One-time GitHub setup

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. (Recommended) protect `main` and require the **CI** checks to pass before merge.

The app is served from a project path, so Vite `base` is `'/cabinet/'`
(`vite.config.ts`). If you rename the repo or move to a `*.github.io` user site,
update `base` accordingly.

> Demo data: ships with the sample medicines from the prototype so the cabinet is
> populated on first launch. Clear IndexedDB (or add real entries) to start fresh.
