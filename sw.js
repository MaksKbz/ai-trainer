const CACHE_NAME = 'ai-trainer-v1.6.5';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Принудительно активируем новый SW
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key); // Удаляем старые кэши
        }
      }));
    }).then(() => self.clients.claim()) // Захватываем контроль над всеми открытыми вкладками
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('huggingface.co') || e.request.url.includes('esm.run') || e.request.url.includes('mlc-ai')) {
    return;
  }
  
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request)) // Сначала пробуем сеть (network-first), если нет интернета - берём из кэша
  );
});
