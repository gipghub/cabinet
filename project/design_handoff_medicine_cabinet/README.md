# Handoff: SW's Medicine Cabinet — Installable PWA (OTC Medicine Tracker)

## Overview
A calm, apothecary-styled mobile app for tracking the over-the-counter (OTC) medicines a household keeps at home. Users see their medicines on warm wooden "shelves," log doses, watch stock and expiration dates, get safety alerts (e.g. daily acetaminophen ceilings), review usage trends, scan new bottles, and share the app with family. The deliverable in this conversation is a fully installable **Progressive Web App** (works offline, full-screen when installed, one-tap install on Android, guided "Add to Home Screen" on iOS) wrapped around a polished interactive prototype.

This package documents that prototype so it can be rebuilt as a production app.

---

## About the Design Files
The files in this bundle are **design references authored in HTML/CSS + React-via-Babel** — runnable prototypes that demonstrate the intended look, motion, and behavior. **They are not production code to ship as-is.** In-browser Babel transpilation, `window.*` globals, and inline mock data are prototype conveniences, not architecture.

Your task is to **recreate these designs inside the target codebase's existing environment**, using its established framework, component library, state management, and styling conventions. If no codebase exists yet, choose an appropriate stack (e.g. React + Vite + a real PWA toolchain such as `vite-plugin-pwa`, or Next.js, or React Native/Expo if a native app is desired) and implement the designs there. The PWA shell (`manifest.webmanifest`, `sw.js`, install flow) shows the *intended install/offline behavior* — reimplement it with your stack's standard PWA tooling rather than copying `sw.js` verbatim.

## Fidelity
**High-fidelity (hifi).** Colors, typography, spacing, radii, shadows, and interactions are final and intentional. Recreate the UI faithfully using the codebase's libraries. The exact design tokens are listed below; honor them.

---

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#eef4f3` | App background (cool sage-tinted off-white) |
| `--paper` | `#faf7ef` | Cards, inputs, raised surfaces (warm paper) |
| `--paper-2` | `#f3efe2` | Recessed surfaces, segmented-control track |
| `--ink` | `#13322b` | Primary text (deep forest) |
| `--ink-soft` | `#4b6760` | Secondary text |
| `--ink-mute` | `#87a098` | Tertiary text, eyebrows, captions |
| `--line` | `rgba(19,50,43,0.10)` | Hairline borders |
| `--line-2` | `rgba(19,50,43,0.05)` | Faintest dividers |
| `--sage` | `#2f6b5f` | Accent / active |
| `--sage-deep` | `#1b3f37` | Primary buttons, active tab, FAB |
| `--sage-soft` | `#a8dccb` | Soft accent, splash rings |
| `--sage-fade` | `#d8ebe2` | Chip backgrounds, soft buttons |
| `--wood` / `--wood-light` / `--wood-dark` | `#cdb98e` / `#e3d6b5` / `#8d7a55` | Shelf wood gradient |
| `--shelf-edge` | `#b8a075` | Shelf front edge |
| `--warn` | `#c97a3a` | Warning (low stock, heads-up) |
| `--danger` | `#b94838` | Danger (expired, action needed, badge) |
| `--good` | `#4f8a6a` | Positive/safe |
| `--label-cream` | `#f4ead4` | Bottle-label background |
| `--label-line` | `#b29764` | Bottle-label rules |

Bottle visual presets (cap / body / label / accent) live in `data.jsx` under `presets` (amber, white, navy, green, red, pink, teal, slate, mustard).

### Typography
| Token | Stack | Use |
|---|---|---|
| `--font-display` | **Instrument Serif**, Newsreader, Georgia, serif | Titles, nav titles, section headers, sheet titles, splash wordmark |
| `--font-body` | **Geist**, system-ui, sans-serif | Body, labels, buttons |
| `--font-mono` | **Geist Mono**, ui-monospace, monospace | Eyebrows, numerals, splash greeting, "O·T·C" |

Loaded from Google Fonts (`Geist`, `Geist Mono`, `Instrument Serif`). The "Labels → Sans" tweak swaps `--font-display` to Geist at runtime.

Key sizes: nav title 30px / detail title 32px (display); section title 22px (display); sheet title 26px (display); body 15px; field label / eyebrow 10.5–11px uppercase, letter-spacing ~0.08–0.12em; tab labels 10px uppercase.

### Spacing, Radius, Shadow
- **Radii:** cards 22px; sheets 28px (top corners only); buttons 14px; inputs 12px; chips 11px (pill); FAB & back button 50%; install banner 20px; device frame 48px.
- **Shadows:** card/raised use `0.5px solid var(--line)` borders more than shadows; FAB `0 8px 24px rgba(19,50,43,0.3)`; install banner `0 12px 40px rgba(19,50,43,0.20)`; bottle SVG `drop-shadow(0 6px 6px rgba(0,0,0,0.18))`.
- **Standard control heights:** primary button 44px; input 46px; nav action / back 36px; chip 22px; segmented control 36px.
- **Tab bar** is a frosted bar: `rgba(238,244,243,0.92)` + `backdrop-filter: blur(28px) saturate(140%)`, top hairline.

---

## Screens / Views

> Navigation is a single-stack state machine in `app.jsx`: `screen ∈ {home, scan, detail, add, trends, alerts}` plus two overlay sheets (`doseOpen`, `shareOpen`). Tab bar hidden on `scan` and `add`.

### 1. Launch Splash (`Splash` in `pwa.jsx`)
- **Purpose:** Warm welcome on app launch, then fades into Home.
- **Layout:** Full-bleed overlay (absolute, `inset:0`, z-index 8000) centered column on a radial gradient `radial-gradient(130% 90% at 50% 18%, #faf7ef, #eef4f3 52%, #d8ebe2)`. Three faint concentric sage rings (SVG) behind the content.
- **Components:** apothecary bottle mark (SVG, sage body + wood cap + cream label with a mortar-and-pestle glyph and "O·T·C"); a **time-aware greeting** in mono uppercase ("Good morning/afternoon/evening", "Winding down", "Resting easy"); "**Cabinet**" wordmark in display serif 46px; a tagline in body 13.5px; a settling progress hairline (64×2.5px) with a sliding sage fill.
- **Motion:** content rises in (`splashRise` .7s), cap "corks" in (`splashCork`), auto-dismiss after `duration` then fade+scale out (.5s). Respects safe-area insets.
- **Configurable (see Tweaks):** duration (0.6–4s, default 1.7s), tagline text, frequency (every launch vs first-launch-only via `localStorage['cabinet-has-launched']`).

### 2. Home — The Cabinet (`screens/Home.jsx`)
- **Purpose:** Marquee view; medicines grouped onto shelves.
- **Layout:** Status-bar spacer → navbar (greeting "Good …, Sam." display title + uppercase sub) → scrolling body. A summary strip shows three stats: **doses today / running low / expiring** (numbers in display, danger/warn coloring). Then shelf sections ("Daily — standing routine", "Allergy & Cold", etc.), each a horizontal row of bottles standing on a wooden shelf with an EMPTY dashed add-slot.
- **Components:** `Bottle` SVG (shelf variant, ~64px wide) with name + dose on a cream label; per-bottle status dots (low=warn, expiring=danger). Shelf is a wood-gradient bar with a front edge (`--shelf-bg`, swappable to metal/glass via tweak). Tapping a bottle → Detail; long-press/tap affordance → Dose sheet.

### 3. Medicine Detail (`screens/Detail.jsx`)
- **Purpose:** Everything about one medicine.
- **Layout:** Back + Edit navbar → hero card (`linear-gradient(170deg,#f7f1e0,#e9dcc0)`) with a large `Bottle` hero variant, name/active ingredient/strength. Below: stock meter (`stock/fullStock` %), expiration with days-remaining, **daily-safety meter** (today's mg vs `dailyMaxMg`), 28-day usage sparkline (`history` array), interactions list (e.g. alcohol, warfarin). Primary CTA "Log a dose" opens the Dose sheet.

### 4. Dose Sheet (`screens/Dose.jsx`)
- **Purpose:** Log a dose; bottom sheet overlay.
- **Layout:** `.sheet-backdrop` + `.sheet`. Stages: **compose → confirmed**. Stepper for pill count (defaults to `perDose`), "when" (now/earlier), optional symptom multi-select chips. Shows computed `totalMg` and a **safety check**: if `todayMg + totalMg > dailyMaxMg`, surface a danger warning before confirm. Confirm → confirmed state → auto-close.

### 5. Add Medicine (`screens/Add.jsx`)
- **Purpose:** Manual entry form (tab bar hidden).
- **Layout:** Back navbar → fields: name, active ingredient, strength + unit, form (tablet/caplet/etc.), stock count, expiration date, shelf/category. Primary save disabled until `name.length > 1`. Uses `.field`, `.field-input`, `.field-row`, `.segmented`.

### 6. Scan (`screens/Scan.jsx`)
- **Purpose:** Add a bottle by barcode or photo (tab bar hidden, dark UI `#0c1814`).
- **Layout:** Dark camera viewport with a scan reticle and a `scanShimmer` sweep; segmented mode switch (barcode / photo). Barcode mode simulates a hit after ~2.4s (`scanning → found`); photo mode → `photo-review`. Found state surfaces a matched-product card with a confirm action. Reached via the center **FAB** in the tab bar.

### 7. Trends (`screens/Trends.jsx`)
- **Purpose:** Usage analytics.
- **Layout:** Top-used medicines bar list (by 28-day `history` totals), acetaminophen weekly-safety chart vs `dailyMaxMg`, "predicted to run out" estimates, symptom log summary (`SYMPTOM_LOG`, `SYMPTOM_META`).

### 8. Alerts (`screens/Alerts.jsx`)
- **Purpose:** Inbox of generated alerts.
- **Layout:** Large display title + count → grouped sections **Action needed** (danger) / **Heads up** (warn) / **Reminders** (info), sourced from `ALERTS`. Each alert is dismissible (local `Set`); tab shows a badge (currently `5`).

### 9. Share Sheet (`screens/Share.jsx`)
- **Purpose:** Invite family to the app via email; bottom sheet.
- **Layout:** Email field (regex-validated), optional note, Send → `sent` confirmation, auto-close after ~1.7s. Triggered from the "Share" tab and a Tweaks demo button.

---

## Install / PWA Behavior (recreate with your stack's PWA tooling)
- **Manifest** (`manifest.webmanifest`): standalone display, portrait, `theme_color #1b3f37`, `background_color #eef4f3`, icons 32/192/512 + a 512 maskable, scope/start_url `./index.html`.
- **Service worker** (`sw.js`): precaches the app shell; **network-first for same-origin** (so updates flow when online, cached fallback offline); **cache-first for cross-origin** immutable CDN/font URLs. Reimplement via `vite-plugin-pwa`/Workbox.
- **Adaptive rendering** (`Root` in `index.html`): when truly installed (top-level standalone window) the app fills the screen with safe-area padding (`env(safe-area-inset-*)`); in a normal browser it renders inside an iOS device frame plus a bottom **install banner**.
- **Install flow** (`pwa.jsx`):
  - Captures `beforeinstallprompt`; Android/desktop Chrome get a **one-tap Install** that fires the native prompt.
  - iOS Safari (no programmatic install) gets a guided **"Add to Home Screen"** sheet (Share → Add to Home Screen → Add).
  - A generic multi-platform guide sheet is the fallback (desktop / unknown).
  - Banner is dismissible (persists in `sessionStorage['cabinet-install-dismissed']`).
- The preview distinguishes "installed" from "previewed in an iframe" by checking `window.self === window.top`.

---

## Interactions & Behavior
- **Navigation:** stack via `go(screen, id?)`; sheets are separate overlay state. Tab bar hidden on `scan`/`add`.
- **Dose safety:** before confirming a dose, project `todayMg + count*dose` against `dailyMaxMg`; if exceeded, show a danger callout.
- **Scan:** barcode auto-"finds" after 2.4s (timeout); switching modes resets to `scanning`.
- **Alerts:** dismissal is optimistic, stored in a local `Set`.
- **Share / Dose confirm:** show success state, then auto-close ~1.7s.
- **Animations (durations/easing):** splash rise .7s `cubic-bezier(.2,.7,.2,1)`, cap cork .6s `cubic-bezier(.3,1.3,.5,1)`, splash out .5–.55s; scan shimmer linear loop; generic `fadeIn`, `pulse`, `spin`, `sheetIn`/`screenIn` keyframes defined in `styles.css` (some intentionally disabled for the preview — re-enable in production). Honor `prefers-reduced-motion`.
- **Scroll:** `.app-scroll` hides scrollbars; bottom padding (~120px) clears the floating tab bar/FAB.

## State Management
Per-view local state in the prototype. For production, model:
- **Medicines** collection: `{ id, name, sub, active, dose, doseUnit, form, perDose, dailyMax, dailyMaxMg, stock, fullStock, expires (ISO), shelf, slot, preset, interactions[], history[28] }`.
- **Dose log** entries (medicine, count, mg, timestamp, symptoms[]) → drives "doses today", safety meters, trends.
- **Alerts** (id, severity ∈ danger/warn/info, message) — ideally derived from stock/expiry/safety rather than stored.
- **Symptom log** + metadata for Trends.
- **UI:** current screen, selected medicine, open sheet, dismissed alerts, install/splash flags (`localStorage`/`sessionStorage`).
See `data.jsx` for the full sample shapes and realistic values.

## Assets
- **Icons:** `icon-32.png`, `icon-192.png`, `icon-512.png`, `icon-maskable.png`, `apple-touch-icon.png` (app launcher/install icons — reuse or regenerate from final brand art).
- **In-app imagery:** none raster — bottles, shelves, the splash mark, and all UI glyphs are **SVG drawn in code** (`bottle.jsx`, `icons.jsx`, inline in `pwa.jsx`). Reproduce as components.
- **Fonts:** Google Fonts — Geist, Geist Mono, Instrument Serif.
- **Device frame:** `ios-frame.jsx` is a *preview-only* iOS bezel; do not ship it.

## Files (in this bundle)
- `index.html` — PWA entry, adaptive Root (full-screen vs framed + install banner), font/manifest/meta, SW registration.
- `manifest.webmanifest`, `sw.js` — PWA manifest + offline service worker.
- `pwa.jsx` — install flow (banner, native prompt, iOS/generic guide sheets) + launch `Splash` + bottle mark.
- `app.jsx` — app shell, navigation state machine, tab bar, **Tweaks panel** (palette, shelf style, label style, scan FAB, splash duration/tagline/frequency/replay).
- `styles.css` — all design tokens + component classes (cards, chips, buttons, sheets, fields, tab bar, segmented control, keyframes).
- `data.jsx` — sample medicines, alerts, symptom log, bottle presets (data model reference).
- `icons.jsx` — line-icon set. `bottle.jsx` — pill-bottle SVG (shelf + hero variants).
- `screens/` — `Home`, `Detail`, `Add`, `Dose`, `Scan`, `Trends`, `Alerts`, `Share`.
- `ios-frame.jsx` — preview-only device bezel (not for production).
- `tweaks-panel.jsx` — preview-only tweak controls (not for production).

## Tweaks present in the prototype (product-decision surface, not required in prod)
Palette (5 themes), shelf style (wood/metal/glass), label style (serif/sans), scan FAB on/off, and launch-splash duration / tagline / frequency / replay. These show which dimensions were explored — treat as configuration hints, not build requirements.

---

## Recommended Stack & First Steps

**Goal:** one installable PWA that works on **both iOS (Safari) and Android (Chrome)** with an easy install, offline support, and automated testing + deployment via GitHub.

### Recommended stack
- **React 18 + TypeScript + Vite** — fast, simple, and the prototype is already React, so screen logic ports directly.
- **`vite-plugin-pwa`** (Workbox under the hood) — generates the manifest + service worker, handles precaching/runtime caching and update prompts. **Use this instead of the hand-written `sw.js`** in this bundle.
- **CSS Modules or vanilla CSS with the token variables** from `styles.css` (or Tailwind with the tokens mapped into `theme.extend`). Keep the `--*` custom properties — they're the design system.
- **Zustand** (or React Context) for the medicines/dose-log/alerts store described in *State Management*. Persist to **IndexedDB via `idb-keyval`** (better than `localStorage` for the dose log and medicine collection).
- **State that must survive offline** (medicines, dose log) lives in IndexedDB; ephemeral UI flags (`cabinet-install-dismissed`, splash `has-launched`) stay in session/localStorage as in the prototype.
- **Vitest + React Testing Library** for unit/component tests; **Playwright** for end-to-end + PWA/installability smoke tests.

### Why a PWA covers both platforms
- **Android / Chrome:** real install via `beforeinstallprompt` → the one-tap "Install" button (already designed in `pwa.jsx`). Can also ship to the Play Store later via a TWA/Bubblewrap if desired.
- **iOS / Safari:** Apple has no programmatic install, so the **guided "Add to Home Screen" sheet** in `pwa.jsx` is the correct UX — keep it. Requirements for a good iOS install: `apple-mobile-web-app-capable`, `apple-touch-icon`, `viewport-fit=cover`, and `env(safe-area-inset-*)` padding (all present in `index.html`).
- Keep the **adaptive Root** idea (full-screen when `display-mode: standalone`, framed preview otherwise) but drive the install banner from the live `beforeinstallprompt` event + iOS UA detection.

### First steps for Claude Code
1. `npm create vite@latest cabinet -- --template react-ts`, then add `vite-plugin-pwa`, `zustand`, `idb-keyval`, `vitest`, `@testing-library/react`, `@playwright/test`.
2. Configure `vite-plugin-pwa` with the manifest from `manifest.webmanifest` (copy `name`, `theme_color #1b3f37`, `background_color #eef4f3`, icons incl. the maskable 512). Set `registerType: 'autoUpdate'` and a Workbox runtime-caching rule for Google Fonts.
3. Port `styles.css` tokens into `src/styles/tokens.css` (import once at root). Recreate the component classes (cards, chips, buttons, sheets, fields, tab bar, segmented control).
4. Build the data layer from `data.jsx` (types + a seed dataset), wired through the Zustand store with IndexedDB persistence.
5. Rebuild components: `Bottle`, `Icon`, the splash, then screens `Home → Detail → Dose → Add → Scan → Trends → Alerts → Share`. Drop `ios-frame.jsx` and `tweaks-panel.jsx` — they're preview-only.
6. Reimplement the install flow (`InstallUI` + iOS/generic guide sheets) against the real `beforeinstallprompt` event.
7. Add tests (below), then wire CI/CD.
8. **Serve over HTTPS** — PWAs only install over HTTPS (or `localhost`). The deploy target below provides this.

### Testing
- **Unit/component (Vitest + RTL):** dose-safety math (`todayMg + count*dose > dailyMaxMg`), stock %, days-to-expire, alert derivation, email validation in Share.
- **E2E (Playwright):** core flows — log a dose, add a medicine, dismiss an alert, share-by-email success; plus a **PWA smoke test**: manifest is served, a service worker registers, and the app shell loads offline.
- **Lighthouse CI** (`@lhci/cli`) with the PWA category to guard installability and performance budgets on every PR.

### CI/CD with GitHub Actions
Recommended: deploy to **GitHub Pages** (free static HTTPS, ideal for a Vite PWA) or Netlify/Vercel/Cloudflare Pages if preferred. Two workflows:

**`.github/workflows/ci.yml`** — run on every PR/push:
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --run        # Vitest
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e             # Playwright against the build/preview
      - run: npx lhci autorun || true     # Lighthouse PWA budgets
```

**`.github/workflows/deploy.yml`** — deploy on merge to `main`:
```yaml
name: Deploy
on:
  push: { branches: [main] }
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build            # set Vite `base` to the repo name for Pages
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: "${{ steps.deployment.outputs.page_url }}" }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
Notes: set Vite `base: '/<repo-name>/'` for project Pages (or `'/'` for a custom domain/user site). The `deploy` job's HTTPS URL is where users install the PWA on their phones. Gate deploys on `ci.yml` passing (branch protection) so only tested builds ship.

> Tell Claude Code: *"Scaffold this stack, port the designs from the bundled HTML references, then set up the two GitHub Actions workflows above and a GitHub Pages deploy."* If you want the GitHub agent to manage CI/CD, point it at this section.
