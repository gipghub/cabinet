import '@testing-library/jest-dom/vitest';
// Provide a real, spec-compliant IndexedDB in jsdom so the idb-keyval
// persistence layer can be exercised in tests.
import 'fake-indexeddb/auto';

// jsdom lacks matchMedia — provide a minimal stub for components that probe it.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
