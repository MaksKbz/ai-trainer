const CACHE_NAME = 'ai-trainer-v1.6';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  // Для запросов на скачивание WebLLM моделей не используем этот кэш (браузер кэширует их отдельно через Cache API внутри WebLLM)
  if (e.request.url.includes('huggingface.co') || e.request.url.includes('esm.run') || e.request.url.includes('mlc-ai')) {
    return;
  }
  
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
