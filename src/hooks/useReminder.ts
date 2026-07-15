import { useEffect, useRef } from "react";
import type { PrayerData } from "@/lib/prayer";
import {
  permissionState,
  reminderMoments,
  showPrayerNotification,
  type NotifySettings,
} from "@/lib/notifications";
import { playPrayerChime } from "@/lib/sound";

const FIRED_KEY = "zikir-reminders-fired";

// Daha önce bildirilen vakitleri localStorage'da tutar (bugünün kaydı).
function loadFired(): Record<string, number> {
  try {
    const raw = localStorage.getItem(FIRED_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw) as Record<string, number>;
    // 2 günden eski kayıtları temizle
    const cutoff = Date.now() - 2 * 86400000;
    for (const k of Object.keys(data)) {
      if (data[k] < cutoff) delete data[k];
    }
    return data;
  } catch {
    return {};
  }
}

function saveFired(data: Record<string, number>): void {
  try {
    localStorage.setItem(FIRED_KEY, JSON.stringify(data));
  } catch {
    // yoksay
  }
}

/**
 * Namaz vakti yaklaştığında bildirim gönderen zamanlayıcı.
 * Mobil tarayıcılarda setTimeout güvenilmediği için her 30 saniyede
 * bir kontrol eder; sayfa tekrar görünür olunca da hemen yeniden değerlendirir.
 */
export function useReminder(prayer: PrayerData | null, settings: NotifySettings) {
  const firedRef = useRef<Record<string, number>>(loadFired());
  // En son props değerlerini ref'te tut (event listener'lar güncel görsün)
  const latest = useRef({ prayer, settings });
  latest.current = { prayer, settings };

  useEffect(() => {
    if (!prayer || !settings.enabled) return;

    async function check() {
      const { prayer: p, settings: s } = latest.current;
      if (!p || !s.enabled) return;
      if (permissionState() !== "granted") return;

      const now = Date.now();
      const moments = reminderMoments(p.times, s.offsetMinutes);
      // Yaklaşmakta olan ya da "kaçırılmış" vakitleri bul.
      // Bir hatırlatma anı geçtikten sonra 5 dakika içinde bildirilsin
      // (telefon uykudayken atlananlar için güvenlik payı).
      const window = s.offsetMinutes === 0 ? 5 * 60000 : 6 * 60000;

      for (const mo of moments) {
        const fireAt = mo.fireAt.getTime();
        const tag = `${mo.prayer.key}@${mo.fireAt.toDateString()}`;
        if (firedRef.current[tag]) continue;
        if (fireAt <= now && now - fireAt <= window) {
          // Vakti geldi (veya biraz önce geldi) → bildir, sesi çal ve kaydet
          firedRef.current[tag] = now;
          saveFired(firedRef.current);
          playPrayerChime();
          await showPrayerNotification(mo.prayer, s.offsetMinutes);
        }
      }
    }

    check();
    // Mobilde setTimeout durduğu için düzenli aralıklarla kontrol et.
    const intervalId = setInterval(check, 30000);

    // Sayfa tekrar görünür olunca (telefon kilidi açılınca) hemen kontrol et
    const onVisible = () => {
      if (!document.hidden) check();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    window.addEventListener("online", onVisible);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      window.removeEventListener("online", onVisible);
    };
  }, [prayer, settings.enabled, settings.offsetMinutes]);
}
