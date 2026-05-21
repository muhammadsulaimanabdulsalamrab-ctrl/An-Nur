const CACHE = 'annur-v1';
const STATIC = ['/', '/index.html', '/app.js', '/data.js', '/content-plus.js', '/quran-full.js'];

// Install: cache static shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for static, network-first with cache fallback for API
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Static assets — cache first
  if (STATIC.some(p => url.pathname === p || url.pathname.endsWith(p.replace('/', '')))) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
    return;
  }

  // Quran API calls — network first, cache fallback (enables offline reading of cached surahs)
  if (url.hostname === 'api.quran.com') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Everything else — network with cache fallback
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
