const CACHE_NAME = "level-up-trainings-v19";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./about.html",
  "./services.html",
  "./quest.html",
  "./accessibility.html",
  "./contact.html",
  "./styles.css",
  "./app.js",
  "./mascot.png",
  "./icon-192.png",
  "./icon-512.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match("./index.html"));
    })
  );
});
