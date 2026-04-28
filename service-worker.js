/* Service Worker del Cuaderno de Campo UAS
   Permite funcionamiento 100% offline tras la primera carga */
 
const CACHE_VERSION = 'cuaderno-uas-v1';
const ASSETS = [
  './',
  './Cuaderno_Campo_UAS.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];
 
/* Instalación: cachear todos los recursos */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});
 
/* Activación: limpiar cachés antiguas */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_VERSION)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});
 
/* Fetch: servir desde caché si existe, si no de la red */
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
