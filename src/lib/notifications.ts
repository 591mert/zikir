import type { PrayerTime } from "@/lib/prayer";
import { VAPID_PUBLIC_KEY, PUSH_BACKEND_URL, pushConfigured } from "@/lib/pushConfig";

export interface NotifySettings {
  enabled: boolean;
  offsetMinutes: number; // kaç dakika önce hatırlatılacak (0 = tam vaktinde)
  city?: string; // kullanıcının seçtiği il (push için sunucuya gönderilir)
  lat?: number;
  lng?: number;
}

export const DEFAULT_NOTIFY: NotifySettings = { enabled: false, offsetMinutes: 10 };

export const OFFSET_OPTIONS = [0, 5, 10, 15, 30];

export function notifySupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

// Cihaz Web Push destekliyor mu? (Push API + service worker)
export function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

// "Her şey hazır mı?" → push desteği + VAPID anahtarı girilmiş + sunucu adresi girilmiş
export function pushReady(): boolean {
  return pushSupported() && pushConfigured();
}

export function permissionState(): NotificationPermission {
  if (!notifySupported()) return "denied";
  return Notification.permission;
}

export async function requestNotifyPermission(): Promise<NotificationPermission> {
  if (!notifySupported()) return "denied";
  if (Notification.permission === "granted") return "granted";
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

// Belirli bir vaktin hatırlatma anını (prayerTime - offset) hesaplar
export function reminderMoments(
  times: PrayerTime[],
  offsetMinutes: number
): { prayer: PrayerTime; fireAt: Date }[] {
  const out: { prayer: PrayerTime; fireAt: Date }[] = [];
  const offsetMs = offsetMinutes * 60 * 1000;
  for (const t of times) {
    if (t.key === "gunes") continue; // Güneş vakit olarak sayılmaz
    const [h, m] = t.time.split(":").map(Number);
    // Bugün
    const today = new Date();
    today.setHours(h, m, 0, 0);
    out.push({ prayer: t, fireAt: new Date(today.getTime() - offsetMs) });
    // Yarın (bugünün saatini yaklaşık olarak kullanır)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    out.push({ prayer: t, fireAt: new Date(tomorrow.getTime() - offsetMs) });
  }
  return out;
}

// Service worker'ın aktif olmasını bekler (bildirimler için şart)
async function waitForServiceWorker(timeoutMs = 2500): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.ready;
    if (reg && typeof reg.showNotification === "function") return reg;
  } catch {
    // yoksay
  }
  // ready hemen çözülmezse kısa bekleme ile tekrar dene
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && typeof reg.showNotification === "function") {
        // active kontrolü
        if (reg.active) return reg;
      }
    } catch {
      // yoksay
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  return null;
}

// Bir vaktin yaklaşması için bildirim gösterir (service worker üzerinden)
export async function showPrayerNotification(
  prayer: PrayerTime,
  offsetMinutes: number
): Promise<void> {
  const title =
    offsetMinutes > 0
      ? `🕌 ${prayer.name} vakti yaklaşıyor`
      : `🕌 ${prayer.name} vakti girdi`;
  const body =
    offsetMinutes > 0
      ? `${prayer.time} · ${prayer.name} vaktine ${offsetMinutes} dakika kaldı.`
      : `${prayer.time} · ${prayer.name} vakti girdi, inşallah.`;

  const options: NotificationOptions = {
    body,
    tag: `prayer-${prayer.key}`,
    icon: "./icon-512.png",
    badge: "./icon-512.png",
    // @ts-expect-error: vibrate tarayıcı desteklerinde geçerli
    vibrate: [120, 60, 120],
    data: { prayer: prayer.key },
    renotify: true,
  };

  // Önce service worker üzerinden göstermeyi dene (en güvenilir yol)
  const reg = await waitForServiceWorker();
  if (reg) {
    try {
      await reg.showNotification(title, options);
      return;
    } catch {
      // başarısız olursa doğrudan bildirime düş
    }
  }
  if (notifySupported()) {
    try {
      new Notification(title, options);
    } catch {
      // sessizce geç
    }
  }
}

// Test bildirimi gönderir (kullanıcı kurulumu doğrulamak için)
export async function sendTestNotification(): Promise<void> {
  await showPrayerNotification(
    { key: "test", name: "Namaz Vakti", time: "--:--" },
    0
  );
}

// ============================================================================
//  WEB PUSH — UYGULAMA KAPALIYKEN ÇALIŞAN BİLDİRİMLER
// ============================================================================

// VAPID public key'i byte dizisine çevirir (abonelik için gerekli format)
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}

// Bu cihazı push bildirimlerine abone yapar ve sunucuya kaydeder.
// settings: il, koordinat, kaç dk önce hatırlatılacağı bilgisi sunucuya gider.
export async function subscribePush(settings: NotifySettings): Promise<boolean> {
  if (!pushReady()) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });
    }
    // Aboneliği sunucuya gönder (sunucu namaz vakti gelince bunu kullanacak)
    const resp = await fetch(`${PUSH_BACKEND_URL}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription: sub,
        city: settings.city,
        lat: settings.lat,
        lng: settings.lng,
        offsetMinutes: settings.offsetMinutes,
      }),
    });
    // Hata ayıklama için konsola yaz
    console.log("[Zikir Push] Abonelik kaydı:", resp.status, resp.ok ? "BAŞARILI" : "BAŞARISIZ");
    return resp.ok;
  } catch (e) {
    console.error("[Zikir Push] Abonelik hatası:", e);
    return false;
  }
}

// Cihazın aboneliğini iptal eder (hatırlatmaları kapatınca)
export async function unsubscribePush(): Promise<void> {
  if (!pushSupported()) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await sub.unsubscribe();
      // Sunucuya da haber ver (opsiyonel, sessizce geç)
      await fetch(`${PUSH_BACKEND_URL}/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      }).catch(() => {});
    }
  } catch {
    // sessizce geç
  }
}
