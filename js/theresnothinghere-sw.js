const dataCacheName = 'TNHD';
const cacheName = 'TNH';
const filesToCache = [
  '/',
  'index.html',
  'assets/apple-touch-icon.png',
  'assets/astro.png',
  'assets/audio.mp3',
  'assets/favicon.ico',
  'assets/icon-192.png',
  'assets/icon-192-maskable.png',
  'assets/icon-512-maskable.png',
  'assets/icon-512-maskable.png',
  'css/bootstrap.css',
  'css/theresnothinghere.css',
  'js/vendor/jquery-3.6.0.min.js',
  'js/vendor/popper.min.js',
  'js/bootstrap.js',
  'js/bootstrap.js.map',
  'js/theresnothinghere.js',
  'js/theresnothinghere-sw.js'
];

//install the sw
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});


self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});


self.addEventListener('fetch', function (e) {
    console.log('[Service Worker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});
