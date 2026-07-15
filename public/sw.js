// Zikir - Basit Service Worker (çevrimdışı destek)
// Tek dosya (index.html) önbelleğe alınır; API istekleri her zaman ağdan gelir.
const CACHE = "zikir-cache-v5";
const APP_URL = "./";

// Çevrimdışı çalışırken önbelleğe alınacak görseller
const IMAGE_ASSETS = [
  "./images/abdest-1-el.png",
  "./images/abdest-2-yuz.png",
  "./images/abdest-3-kol.png",
  "./images/abdest-4-bas-ayak.png",
  "./images/namaz-erkek.png",
  "./images/namaz-kadin.png",
  "./icon-512.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll([APP_URL, ...IMAGE_ASSETS]))
      .catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// PUSH bildirimleri: sunucudan gelen push'u telefonda bildirim olarak gösterir.
// Bu, uygulama kapalıyken bile çalışır (işletim sistemi push servisi tetikler).
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    payload = { title: "Zikir", body: event.data ? event.data.text() : "" };
  }
  const title = payload.title || "🕌 Zikir";
  const options = {
    body: payload.body || "Namaz vakti hatırlatması",
    icon: "./icon-512.png",
    badge: "./icon-512.png",
    // Özel "namaz vakti" titreşim deseni (Android'de kapalıyken de çalışır):
    // 3 kısa güçlü titreşim, kısa duraklama, 1 uzun — ezan/çan hissi verir.
    vibrate: [180, 90, 180, 90, 180, 250, 400],
    tag: payload.tag || "prayer",
    data: payload.data || { url: "./" },
    renotify: true,
    requireInteraction: false,
  };
  // iOS: showNotification mutlaka event.waitUntil içinde olmalı, yoksa abonelik iptal edilir.
  // Ayrıca, uygulama açıksa ona "ses çal" mesajı gönder (kapalıysa OS varsayılan sesini çalar).
  event.waitUntil(
    (async () => {
      try {
        const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
        for (const client of clients) {
          client.postMessage({ type: "PLAY_PRAYER_SOUND" });
        }
      } catch (e) {}
      await self.registration.showNotification(title, options);
    })()
  );
});

// Bildirime tıklandığında uygulamayı açar/öne getirir
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const client of clients) {
        if ("focus" in client) {
          await client.focus();
          return;
        }
      }
      if (self.clients.openWindow) {
        await self.clients.openWindow(targetUrl);
      }
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Sadece GET istekleri ele alınır
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Dış API istekleri (namaz vakitleri) her zaman ağdan gelir
  if (url.origin !== self.location.origin) {
    return;
  }

  // Aynı kökten gelen istekler: ağ önce, yoksa önbellek
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match(APP_URL)))
  );
});
