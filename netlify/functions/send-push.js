const { getStore } = require("@netlify/blobs");
const webpush = require("web-push");

const TIMEZONE = "Europe/Istanbul";

function getVapid() {
  return {
    PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
    PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
    SUBJECT: (process.env.VAPID_SUBJECT || "mailto:admin@zikir.app").replace(/^mailto:/, ""),
  };
}

function getBlobStore() {
  const siteID = process.env.SITE_ID;
  const token = process.env.NETLIFY_ACCESS_TOKEN || process.env.NETLIFY_FUNCTIONS_TOKEN;
  if (siteID && token) return getStore("subscriptions", { siteID, token });
  return getStore("subscriptions");
}

function istanbulNowHHMM() {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE, hour: "2-digit", minute: "2-digit", hour12: false,
  });
  return fmt.format(new Date());
}

function istanbulToday() {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit",
  });
  return fmt.format(new Date());
}

const timingsCache = new Map();
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

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

exports.handler = async (event) => {
  const cors = { "Access-Control-Allow-Origin": "*" };
  const { PUBLIC_KEY, PRIVATE_KEY, SUBJECT } = getVapid();

  if (!PUBLIC_KEY || !PRIVATE_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "VAPID anahtarları ortam değişkenlerinde tanımlı değil." }),
      headers: { "Content-Type": "application/json", ...cors },
    };
  }

  webpush.setVapidDetails(`mailto:${SUBJECT}`, PUBLIC_KEY, PRIVATE_KEY);

  const store = getBlobStore();
  const list = await store.list();
  const isTest = (event.queryStringParameters && event.queryStringParameters.test === "1");

  if (isTest) {
    const payload = JSON.stringify({
      title: "🔔 Zikir Push Testi",
      body: "Bu bildirim sunucudan geldi. Namaz vakti hatırlatmaları çalışıyor!",
      tag: "push-test", data: { url: "./" },
    });
    const pushOpts = { TTL: 300, headers: { Urgency: "high", Topic: "zikir-test" } };
    let sent = 0, errors = 0;
    for (const item of list.blobs) {
      const raw = await store.get(item.key);
      if (!raw) continue;
      let rec;
      try { rec = JSON.parse(raw); } catch { continue; }
      try {
        await webpush.sendNotification(rec.subscription, payload, pushOpts);
        sent++;
      } catch (e) {
        errors++;
        if (e.statusCode === 410 || e.statusCode === 404) await store.delete(item.key);
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, mode: "test", sent, errors, subscribers: list.blobs.length }),
      headers: { "Content-Type": "application/json", ...cors },
    };
  }

  const nowMin = toMinutes(istanbulNowHHMM());
  const today = istanbulToday();
  const results = { checked: 0, sent: 0, errors: 0 };

  for (const item of list.blobs) {
    const raw = await store.get(item.key);
    if (!raw) continue;
    let rec;
    try { rec = JSON.parse(raw); } catch { continue; }
    results.checked++;
    if (rec.lat == null || rec.lng == null) continue;
    try {
      const times = await getTimings(rec.lat, rec.lng);
      const offset = rec.offsetMinutes ?? 10;
      if (!rec.sent || typeof rec.sent !== "object") rec.sent = {};
      for (const p of times) {
        const reminderMin = toMinutes(p.time) - offset;
        const due = reminderMin <= nowMin && nowMin - reminderMin <= 11;
        if (due && rec.sent[p.key] !== today) {
          const payload = JSON.stringify({
            title: offset > 0 ? `🕌 ${p.name} vakti yaklaşıyor` : `🕌 ${p.name} vakti girdi`,
            body: offset > 0 ? `${p.time} · ${p.name} vaktine ${offset} dakika kaldı.` : `${p.time} · ${p.name} vakti girdi, inşallah.`,
            tag: `prayer-${p.key}`, sound: "./notification.mp3", data: { url: "./", prayer: p.key },
          });
          const pushOpts = { TTL: 300, headers: { Urgency: "high", Topic: `zikir-${p.key}` } };
          try {
            await webpush.sendNotification(rec.subscription, payload, pushOpts);
            rec.sent[p.key] = today;
            results.sent++;
          } catch (e) {
            results.errors++;
            if (e.statusCode === 410 || e.statusCode === 404) await store.delete(item.key);
          }
        }
      }
      await store.set(item.key, JSON.stringify(rec));
    } catch (e) {
      results.errors++;
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, ...results }),
    headers: { "Content-Type": "application/json", ...cors },
  };
};
