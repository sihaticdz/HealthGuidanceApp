const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/style.css',   // مسار ملف CSS
  '/assets/js/script.js',    // مسار ملف JavaScript
  '/manifest.json',
  '/assets/images/icon-192x192.png', // مسار الأيقونة
  '/assets/images/icon-512x512.png', // مسار الأيقونة
  // أضف هنا أي صور أخرى مهمة أو ملفات fonts أو غيرها تحتاج لتخزينها مؤقتاً
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});