const CACHE_NAME = 'absen-online-cache-v1';
const APP_SHELL = [
  '/',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Selalu ambil dari network dulu (biar data absen selalu real-time),
  // fallback ke cache kalau offline.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
