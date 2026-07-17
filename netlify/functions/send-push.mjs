// ============================================================================
//  /send-push  (CRON ile her dakika tetiklenir)
// ----------------------------------------------------------------------------
//  Tüm aboneleri gezer; İstanbul saatine göre namaz vakti yaklaşan/
//  giren kişilere push bildirimi gönderir. Her vakit için günde bir kez gönderir.
//
//  Çalışması için Netlify ortam değişkenleri (Environment Variables) gerekir:
//    VAPID_PUBLIC_KEY   - public anahtar
//    VAPID_PRIVATE_KEY  - gizli anahtar
//    VAPID_SUBJECT      - mailto:ornek@mail.com  (Apple bunu ister)
// ============================================================================
import { getStore } from "@netlify/blobs";
import webpush from "web-push";

const TIMEZONE = "Europe/Istanbul"; // Uygulama Türkiye odaklı

// VAPID ayarı (ortam değişkenlerinden)
const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
// Formata uygun hale getir: eğer "mailto:" ile başlamıyorsa ekle
const rawSubject = process.env.VAPID_SUBJECT || "admin@zikir.app";
const SUBJECT = rawSubject.startsWith("mailto:") ? rawSubject : `mailto:${rawSubject}`;

if (PUBLIC_KEY && PRIVATE_KEY) {
  webpush.setVapidDetails(SUBJECT, PUBLIC_KEY, PRIVATE_KEY);
}

// İstanbul yerel saatini "HH:MM" olarak verir
function istanbulNowHHMM() {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return fmt.format(new Date());
}

// İstanbul'da bugünün tarihi (YYYY-MM-DD)
function istanbulToday() {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}

// Verilen koordinat için bugünkü namaz vakitlerini Aladhan'dan çeker (önbellekli)
const timingsCache = new Map(); // key: "lat,lng,date"
async function getTimings(lat, lng) {
  const date = istanbulToday();
  const key = `${lat},${lng},${date}`;
  if (timingsCache.has(key)) return timingsCache.get(key);

  const url = `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lng}&method=13&school=0`;
  const res = await fetch(url);
  const json = await res.json();
  const t = json.data.timings;
  const times = [
    { key: "imsak", name: "İmsak", time: String(t.Imsak).slice(0, 5) },
    { key: "ogle", name: "Öğle", time: String(t.Dhuhr).slice(0, 5) },
    { key: "ikindi", name: "İkindi", time: String(t.Asr).slice(0, 5) },
    { key: "aksam", name: "Akşam", time: String(t.Maghrib).slice(0, 5) },
    { key: "yatsi", name: "Yatsı", time: String(t.Isha).slice(0, 5) },
  ];
  timingsCache.set(key, times);
  return times;
}

// "HH:MM" formatından dakika cinsine çevirir
function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export default async (req) => {
  const cors = { "Access-Control-Allow-Origin": "*" };
  // İstersen elle de tetikleyebilirsin (GET ile)

  if (!PUBLIC_KEY || !PRIVATE_KEY) {
    return new Response(
      JSON.stringify({ error: "VAPID anahtarları ortam değişkenlerinde tanımlı değil." }),
      { status: 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  const store = getStore("subscriptions");
  const list = await store.list();

  // ============================================================
  //  TEST MODU: ?test=1 ile çağrılırsa, abonelere ANINDA
  //  gerçek push gönderir. Böylece push yolunu test edebilirsiniz.
  //  Kullanım: https://SITEN.netlify.app/.netlify/functions/send-push?test=1
  // ============================================================
  const url = new URL(req.url);
  const isTest = url.searchParams.get("test") === "1";

  if (isTest) {
    const payload = JSON.stringify({
      title: "🔔 Zikir Push Testi",
      body: "Bu bildirim sunucudan geldi. Namaz vakti hatırlatmaları çalışıyor!",
      tag: "push-test",
      data: { url: "./" },
    });
    let sent = 0;
    let errors = 0;
    for (const item of list.blobs) {
      const raw = await store.get(item.key);
      if (!raw) continue;
      let rec;
      try {
        rec = JSON.parse(raw);
      } catch {
        continue;
      }
      try {
        await webpush.sendNotification(rec.subscription, payload);
        sent++;
      } catch (e) {
        errors++;
        if (e.statusCode === 410 || e.statusCode === 404) {
          await store.delete(item.key);
        }
      }
    }
    return new Response(
      JSON.stringify({ ok: true, mode: "test", sent, errors, subscribers: list.blobs.length }),
      { status: 200, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  const nowMin = toMinutes(istanbulNowHHMM());
  const today = istanbulToday();

  const results = { checked: 0, sent: 0, errors: 0, details: [] };

  for (const item of list.blobs) {
    const raw = await store.get(item.key);
    if (!raw) continue;
    let rec;
    try {
      rec = JSON.parse(raw);
    } catch {
      continue;
    }
    results.checked++;

    // Koordinat yoksa atla
    if (rec.lat == null || rec.lng == null) continue;

    try {
      const times = await getTimings(rec.lat, rec.lng);
      const offset = rec.offsetMinutes ?? 10;
      if (!rec.sent || typeof rec.sent !== "object") rec.sent = {};

      for (const p of times) {
        const reminderMin = toMinutes(p.time) - offset;
        // Kullanıcının seçtiği süreye (offset) göre hatırlatma vakti hesaplanır.
        // Cron her dakika (veya 5 dakikada bir) çalışabilir; bu yüzden "vakti geldi veya
        // son 11 dakika içinde geldiyse ve bugün gönderilmediyse" mantığıyla kaçırma yok.
        const due = reminderMin <= nowMin && nowMin - reminderMin <= 11;
        if (due && rec.sent[p.key] !== today) {
          const payload = JSON.stringify({
            title:
              offset > 0 ? `🕌 ${p.name} vakti yaklaşıyor` : `🕌 ${p.name} vakti girdi`,
            body:
              offset > 0
                ? `${p.time} · ${p.name} vaktine ${offset} dakika kaldı.`
                : `${p.time} · ${p.name} vakti girdi, inşallah.`,
            tag: `prayer-${p.key}`,
            sound: "./notification.mp3",
            data: { url: "./", prayer: p.key },
          });
          try {
            await webpush.sendNotification(rec.subscription, payload);
            rec.sent[p.key] = today;
            results.sent++;
            results.details.push(`${rec.city} - ${p.name}`);
          } catch (e) {
            results.errors++;
            // Abonelik geçersizse (410 Gone) sil
            if (e.statusCode === 410 || e.statusCode === 404) {
              await store.delete(item.key);
            }
          }
        }
      }

      // Kaydı güncelle (sent bilgisi)
      await store.set(item.key, JSON.stringify(rec));
    } catch (e) {
      results.errors++;
    }
  }

  return new Response(JSON.stringify({ ok: true, ...results }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...cors },
  });
};

// Cron tetikleyici: cron-job.org üzerinden her dakika çağrılıyor
// (Netlify Scheduled Functions kullanılmıyor)
