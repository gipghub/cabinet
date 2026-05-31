/* eslint-env node */
module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', 'dev-dist', '_site', 'design-reference', '.eslintrc.cjs', 'node_modules'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-explicit-any': 'error',
  },
  overrides: [
    {
      files: ['*.config.ts', 'playwright.config.ts', 'vite.config.ts', 'vitest.config.ts'],
      env: { node: true },
      rules: { 'react-refresh/only-export-components': 'off' },
    },
    {
      files: ['**/*.test.ts', '**/*.test.tsx', 'e2e/**/*.ts', 'src/test/**/*.ts'],
      env: { node: true, browser: true },
    },
  ],
};
