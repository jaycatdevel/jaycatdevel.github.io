const version = "0.4";

var cacheName = 'stormcloud';
var filesToCache = [
  '/',  
  '/dates.js', 
  '/db.js', 
  '/favicon.ico',
  '/graph.js', 
  '/index.html', 
  '/manifest.json', 
  '/messages.js',  
  '/reports', 
  '/site.webmanifest',  
  '/stormcloud.css', 
  '/stormcloud.js',
  '/sw.js',
  '/fonts/bebaskai.otf',  
  '/fonts/roboto-regular.otf',  
  '/images/android-chrome-192x192.png',  
  '/images/android-chrome-512x512.png',  
  '/images/apple-touch-icon.png',  
  '/images/bars-solid.png',  
  '/images/favicon-16x16.png',  
  '/images/favicon-32x32.png',  
  '/images/favicon.ico',  
  '/images/logo-128.png',  
  '/images/logo-144.png',  
  '/images/logo-152.png',  
  '/images/logo-192.png',  
  '/images/logo-256.png',  
  '/images/logo-512.png',  
  '/images/trash-can.png', 
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

