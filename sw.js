// 自動生成（build.py）。手で編集しない。
const V = "pkmn-fbefd681042e";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const same = new URL(req.url).origin === location.origin;
  if (same) {
    // 自サイトはネットワーク優先。古い版が残り続ける事故を防ぐ。
    e.respondWith(fetch(req).then(res => {
      const c = res.clone();
      caches.open(V).then(cc => cc.put(req, c)).catch(() => {});
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("./"))));
  } else {
    // スプライト等はキャッシュ優先。200枚を毎回取りに行かない。
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      const c = res.clone();
      caches.open(V).then(cc => cc.put(req, c)).catch(() => {});
      return res;
    }).catch(() => r)));
  }
});
