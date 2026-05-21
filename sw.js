const CACHE = 'annur-v5';
const STATIC = ['/', '/index.html', '/app.js', '/data.js', '/content-plus.js', '/quran-full.js', '/firebase-community.js'];

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

  // Static assets — network first so deployed JS/HTML fixes are not held back by an older cache.
  if (STATIC.some(p => url.pathname === p || url.pathname.endsWith(p.replace('/', '')))) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.ok && e.request.method === 'GET') {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
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

// Push notifications
self.addEventListener('push', e => {
  const data = e.data?.json?.() || {};
  e.waitUntil(self.registration.showNotification(data.title || 'An Nur ✨', {
    body: data.body || 'Your daily ayah awaits.',
    icon: '/icon.svg',
    badge: '/icon.svg',
    tag: 'annur-daily',
    data: { url: '/' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data?.url || '/'));
});
