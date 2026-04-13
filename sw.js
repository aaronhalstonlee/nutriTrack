const CACHE = "nutritrack-v1";
const SHELL = [
  "./", 
  "./index.html",
  "https://cdn.tailwindcss.com",
  "https://unpkg.com"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => {
      return Promise.allSettled(SHELL.map(url => c.add(url)));
    })
  );          
  self.skipWaiting();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        if(e.request.method == 'GET' && res.status == 200){
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        return caches.match("./index.html");
      });
    })
  );
});
