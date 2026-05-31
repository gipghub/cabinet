/* Cabinet PWA service worker
   Strategy:
   - Precache the local app shell on install (tolerant of individual misses).
   - Runtime cache-first for everything else (React/Babel CDN, Google Fonts),
     so the app launches and runs fully offline after first load.
*/
const VERSION = 'cabinet-v1';
const SHELL = 'cabinet-shell-' + VERSION;
const RUNTIME = 'cabinet-runtime-' + VERSION;

// Local app shell — relative to the SW scope.
const SHELL_FILES = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './ios-frame.jsx',
  './tweaks-panel.jsx',
  './pwa.jsx',
  './data.jsx',
  './icons.jsx',
  './bottle.jsx',
  './app.jsx',
  './screens/Home.jsx',
  './screens/Scan.jsx',
  './screens/Detail.jsx',
  './screens/Add.jsx',
  './screens/Dose.jsx',
  './screens/Trends.jsx',
  './screens/Alerts.jsx',
  './screens/Share.jsx',
  './icon-32.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    // Tolerant precache: don't let one bad URL abort the whole install.
    await Promise.allSettled(
      SHELL_FILES.map((url) =>
        fetch(new Request(url, { cache: 'reload' }))
          .then((res) => { if (res.ok || res.type === 'opaque') return cache.put(url, res); })
          .catch(() => {})
      )
    );
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((k) => k !== SHELL && k !== RUNTIME).map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isNavigation = req.mode === 'navigate';

  // Navigations + same-origin app files: network-first so updates always flow
  // when online; fall back to cache (offline launch / flaky network).
  if (isNavigation || sameOrigin) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        if (fresh && (fresh.ok || fresh.type === 'opaque')) {
          const cache = await caches.open(SHELL);
          cache.put(isNavigation ? './index.html' : req, fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch {
        const cached = await caches.match(req);
        if (cached) return cached;
        if (isNavigation) {
          return (await caches.match('./index.html')) ||
                 (await caches.match('./')) ||
                 Response.error();
        }
        return Response.error();
      }
    })());
    return;
  }

  // Cross-origin (React/Babel CDN, Google Fonts — immutable, versioned URLs):
  // cache-first for instant, offline-capable loads.
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) {
        const runtime = await caches.open(RUNTIME);
        runtime.put(req, res.clone()).catch(() => {});
      }
      return res;
    } catch {
      return cached || Response.error();
    }
  })());
});
