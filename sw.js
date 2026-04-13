const CACHE = "nutritrack-v1";
const SHELL = [
  "./", 
  "./index.html",
  "https://tailwindcss.com",
  "https://unpkg.com"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        if(e.request.method == 'GET' &&
           (e.request.url.includes("openfoodfacts.org") ||
            e.request.url.includes("unpkg.com") ||
            e.request.url.includes("tailwindcss.com"))) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
