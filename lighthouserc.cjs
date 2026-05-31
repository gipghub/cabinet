/* Lighthouse CI — performance / a11y / best-practices / SEO budgets.
 *
 * Note: Lighthouse 12 (bundled with @lhci/cli 0.14) REMOVED the PWA category
 * and its audits (installable-manifest, service-worker, maskable-icon). We no
 * longer assert them here — PWA installability is verified in the Playwright
 * e2e suite instead (manifest identity + service-worker registration).
 *
 * The app is built with base '/cabinet/', so CI assembles `_site/cabinet`
 * (a copy of dist) before running, matching the production path. */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './_site',
      url: ['http://localhost/cabinet/index.html'],
      numberOfRuns: 1,
      settings: { preset: 'desktop' },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: { target: 'filesystem', outputDir: './.lighthouseci' },
  },
};
