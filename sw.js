// Fil d'Ariane : cache hors ligne de l'appli et des morceaux de carte consultés.
const CACHE = "ariane-v2";
const TILES = "ariane-tiles";
const MAX_TILES = 6000;
const FILES = [
  "./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png",
  "vendor/leaflet/leaflet.js", "vendor/leaflet/leaflet.css",
  "vendor/leaflet/images/layers.png", "vendor/leaflet/images/layers-2x.png",
  "vendor/leaflet/images/marker-icon.png", "vendor/leaflet/images/marker-icon-2x.png", "vendor/leaflet/images/marker-shadow.png"
];
const TILE_HOSTS = /(^|\.)tile\.opentopomap\.org$|^server\.arcgisonline\.com$/;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(n => n !== CACHE && n !== TILES).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});

let puts = 0;
async function trim() {
  const c = await caches.open(TILES), keys = await c.keys();
  for (let i = 0; i < keys.length - MAX_TILES; i++) await c.delete(keys[i]);
}

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);

  // Morceaux de carte : mémoire d'abord, réseau ensuite (et on garde ce qui arrive).
  if (TILE_HOSTS.test(url.hostname)) {
    e.respondWith(caches.open(TILES).then(async c => {
      const hit = await c.match(e.request.url);
      if (hit) return hit;
      try {
        const res = await fetch(e.request);
        if (res.ok) { c.put(e.request.url, res.clone()); if (++puts % 100 === 0) trim(); }
        return res;
      } catch (err) {
        return new Response("", { status: 504 });
      }
    }));
    return;
  }

  // Appli et polices : mémoire d'abord, réseau ensuite.
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match("index.html"))));
});
