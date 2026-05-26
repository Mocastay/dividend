const CACHE = 'dividend-tracker-v2';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/', '/index.html'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.url.includes('api/divvy') || e.request.url.includes('netlify/functions')) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res && res.status === 200 && e.request.method === 'GET') {
        caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      }
      return res;
    }).catch(() => caches.match('/index.html')))
  );
});
