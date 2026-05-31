/* Lighthouse CI — PWA installability + performance budgets.
 * The app is built with base '/cabinet/', so CI assembles `_site/cabinet`
 * (a copy of dist) before running, matching the production path. */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './_site',
      url: ['http://localhost/cabinet/'],
      numberOfRuns: 1,
      settings: { preset: 'desktop' },
    },
    assert: {
      assertions: {
        'categories:pwa': ['error', { minScore: 0.9 }],
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'installable-manifest': 'error',
        'service-worker': 'error',
        'maskable-icon': 'warn',
      },
    },
    upload: { target: 'filesystem', outputDir: './.lighthouseci' },
  },
};
