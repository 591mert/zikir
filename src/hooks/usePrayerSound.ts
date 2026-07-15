import { useEffect } from "react";
import { playPrayerChime } from "@/lib/sound";

// Service worker'dan gelen push bildirimini dinler.
// Uygulama açıksa, push geldiğinde hoş çan sesini çalar.
// (Uygulama kapalıyken işletim sisteminin kendi sesi çalar.)
export function usePrayerSound() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const handler = (event: MessageEvent) => {
      if (event.data && event.data.type === "PLAY_PRAYER_SOUND") {
        playPrayerChime();
      }
    };
    navigator.serviceWorker.addEventListener("message", handler);
    return () => navigator.serviceWorker.removeEventListener("message", handler);
  }, []);
}
