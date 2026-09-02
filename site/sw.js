const CACHE_NAME = "civic-accord-pwa-v1";
const APP_SHELL = [
  "/governance-app/",
  "/governance-app/index.html",
  "/governance-app/how-it-works.html",
  "/governance-app/bill-intelligence.html",
  "/governance-app/impact-analysis.html",
  "/governance-app/compromise-analysis.html",
  "/governance-app/voter-feedback-and-trust.html",
  "/governance-app/contributing.html",
  "/governance-app/styles.css",
  "/governance-app/favicon.svg",
  "/governance-app/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone)).catch(() => {});
          return networkResponse;
        })
        .catch(() => caches.match("/governance-app/index.html"));
    }),
  );
});