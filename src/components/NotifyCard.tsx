import { useState } from "react";
import { Card, Pill } from "@/components/ui";
import { playPrayerChime, primeAudio, vibratePrayerPattern } from "@/lib/sound";

import {
  OFFSET_OPTIONS,
  notifySupported,
  permissionState,
  pushReady,
  requestNotifyPermission,
  sendTestNotification,
  subscribePush,
  unsubscribePush,
  type NotifySettings,
} from "@/lib/notifications";

export default function NotifyCard({
  settings,
  onChange,
  cityLabel,
}: {
  settings: NotifySettings;
  onChange: (s: NotifySettings) => void;
  cityLabel: string;
}) {
  const [perm, setPerm] = useState<NotificationPermission>(permissionState());
  const [busy, setBusy] = useState(false);
  const supported = notifySupported();
  const pushOn = pushReady();

  async function toggle() {
    if (!settings.enabled) {
      // Açılıyor: önce izin iste
      setBusy(true);
      const result = await requestNotifyPermission();
      setPerm(result);
      setBusy(false);
      if (result === "granted") {
        const next = { ...settings, enabled: true };
        onChange(next);
        // Ses motorunu bu kullanıcı etkileşimiyle aktifleştir (tarayıcı gereği)
        primeAudio();
        playPrayerChime();
        // Push hazırken sunucuya abone ol (il bilgisi ile) → kapalıyken de çalışır
        if (pushOn) {
          await subscribePush(next);
        }
        // Service worker'ın hazır olmasına kısa süre tanı, sonra test bildirimi gönder
        await new Promise((r) => setTimeout(r, 600));
        await sendTestNotification();
      }
    } else {
      // Kapatılıyor: push aboneliğini iptal et
      if (pushOn) await unsubscribePush();
      onChange({ ...settings, enabled: false });
    }
  }

  // Hatırlatma süresi değişince push aboneliğini güncelle
  async function changeOffset(o: number) {
    const next = { ...settings, offsetMinutes: o };
    onChange(next);
    if (pushOn && settings.enabled) {
      await subscribePush(next);
    }
  }

  if (!supported) {
    return (
      <Card className="p-5">
        <p className="text-xl font-extrabold text-nuur-900">🔔 Namaz Hatırlatma</p>
        <p className="mt-1 text-base text-nuur-400">
          Cihazınız veya tarayıcınız bildirimleri desteklemiyor.
        </p>
      </Card>
    );
  }

  const blocked = perm === "denied";

  return (
    <Card className="overflow-hidden">
      <div className="bg-nuur-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xl font-extrabold text-nuur-900">🔔 Namaz Hatırlatma</p>
          <Pill tone={settings.enabled ? "nuur" : "gold"}>
            {settings.enabled ? "Açık" : "Kapalı"}
          </Pill>
        </div>
        <p className="mt-1 text-base text-nuur-600">
          Seçtiğiniz ilde ({cityLabel}) namaz vakti yaklaşırken bildirim gönderir.
        </p>
      </div>

      <div className="space-y-4 p-5">
        {blocked && (
          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-200">
            <p className="text-base font-bold text-red-700">Bildirim izni engellendi</p>
            <p className="mt-1 text-base text-red-600">
              Telefonunuzun tarayıcı ayarlarından (site adı → Bildirimler) izni açmanız gerekir.
            </p>
          </div>
        )}

        {/* Aç/Kapa düğmesi */}
        <button
          onClick={toggle}
          disabled={busy}
          className={
            "flex w-full items-center justify-between rounded-2xl px-5 py-4 text-lg font-extrabold transition active:scale-[0.98] " +
            (settings.enabled
              ? "bg-nuur-700 text-white"
              : "bg-gold-500 text-nuur-900")
          }
        >
          <span>{settings.enabled ? "Hatırlatmaları Kapat" : "Hatırlatmaları Aç"}</span>
          <span className="text-2xl">{busy ? "⏳" : settings.enabled ? "🔔" : "🔕"}</span>
        </button>

        {/* Vakti seçimi (sadece açıkken) */}
        {settings.enabled && !blocked && (
          <div>
            <p className="mb-2 text-base font-bold text-nuur-700">Ne zaman hatırlatılsın?</p>
            <div className="flex flex-wrap gap-2">
              {OFFSET_OPTIONS.map((o) => (
                <button
                  key={o}
                  onClick={() => changeOffset(o)}
                  className={
                    "rounded-2xl px-4 py-3 text-base font-bold transition " +
                    (settings.offsetMinutes === o
                      ? "bg-nuur-700 text-white shadow"
                      : "bg-white text-nuur-700 ring-1 ring-black/5")
                  }
                >
                  {o === 0 ? "Tam vaktinde" : `${o} dk önce`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Test bildirimi, ses, titreşim */}
        {settings.enabled && !blocked && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              onClick={() => sendTestNotification()}
              className="flex items-center justify-center gap-1 rounded-2xl bg-white px-2 py-3 text-sm font-bold text-nuur-700 ring-1 ring-black/5"
            >
              🔔 Test
            </button>
            <button
              onClick={() => {
                primeAudio();
                playPrayerChime();
              }}
              className="flex items-center justify-center gap-1 rounded-2xl bg-white px-2 py-3 text-sm font-bold text-nuur-700 ring-1 ring-black/5"
            >
              🔊 Ses
            </button>
            <button
              onClick={() => {
                vibratePrayerPattern();
                playPrayerChime();
              }}
              className="flex items-center justify-center gap-1 rounded-2xl bg-white px-2 py-3 text-sm font-bold text-nuur-700 ring-1 ring-black/5"
            >
              📳 Titreşim
            </button>
          </div>
        )}

        <p className="text-xs leading-relaxed text-nuur-400">
          Bildirim sesi: Uygulama açıkken hoş bir çan sesi çalar; kapalıyken telefonun kendi
          bildirim sesi çalar. En sağlıklı çalışma için uygulamayı ana ekrana kurun ve telefonu
          sessize almayın.
        </p>
      </div>
    </Card>
  );
}
