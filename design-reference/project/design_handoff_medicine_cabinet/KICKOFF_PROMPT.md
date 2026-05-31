# Kickoff Prompt — paste into your first Claude Code session

> Place this repo so that `design-reference/README.md` and `CLAUDE.md` are present at the root.
> Copy the block below as your first message to Claude Code.

---

Read `CLAUDE.md` and `design-reference/README.md` in full — together they are the complete spec for **Cabinet**, an installable PWA for tracking over-the-counter medicines, to run on iOS and Android with easy install, offline support, and GitHub Actions CI/CD.

Follow the **Recommended Stack & First Steps** section of the README exactly. The files in `design-reference/` are **design references, not production code** — recreate them in the real stack; do not copy `sw.js`, the in-browser Babel setup, `ios-frame.jsx`, or `tweaks-panel.jsx`.

Before writing code, confirm the three items in the **DECISIONS** list in `CLAUDE.md` with me (repo type / seed-vs-empty / deploy target).

Then, in this order:
1. Scaffold **React + TypeScript + Vite** with `vite-plugin-pwa`, `zustand`, `idb-keyval`, `vitest`, `@testing-library/react`, `@playwright/test`.
2. Configure the PWA manifest (name "Cabinet", `theme_color #1b3f37`, `background_color #eef4f3`, icons incl. the maskable 512) and `registerType: 'autoUpdate'`.
3. Port the design tokens from `design-reference/styles.css` into `src/styles/tokens.css` and recreate the base component classes.
4. Build the data layer (types + seed) from `design-reference/data.jsx`, wired through a Zustand store persisted to IndexedDB.
5. Build the **Home** screen + the `Bottle`/`Icon` components and the launch splash. **Stop and show me a working Home screen** (`npm run dev`) before continuing.

After I approve Home, continue screen-by-screen (`Detail → Dose → Add → Scan → Trends → Alerts → Share`), adding Vitest/Playwright tests with each. Then set up the `ci.yml` and `deploy.yml` GitHub Actions workflows and the GitHub Pages deploy from the README.

Work on a feature branch, open a PR, and never push directly to `main`.
