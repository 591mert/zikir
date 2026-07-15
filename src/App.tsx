import { useEffect, useState } from "react";
import type { Page } from "@/lib/nav";
import { fetchPrayerTimes, turkishCities, type PrayerData } from "@/lib/prayer";
import { loadState, saveState } from "@/hooks/useClock";
import BottomNav from "@/components/BottomNav";
import Home from "@/components/Home";
import PrayerTimes from "@/components/PrayerTimes";
import PrayerGuide from "@/components/PrayerGuide";
import Qibla from "@/components/Qibla";
import Tasbih from "@/components/Tasbih";
import Surahs from "@/components/Surahs";
import Asma from "@/components/Asma";
import Duas from "@/components/Duas";
import Wisdom from "@/components/Wisdom";
import InstallPrompt from "@/components/InstallPrompt";
import MiniPlayer from "@/components/MiniPlayer";
import { useReminder } from "@/hooks/useReminder";
import { usePrayerSound } from "@/hooks/usePrayerSound";
import { DEFAULT_NOTIFY, type NotifySettings } from "@/lib/notifications";

interface City {
  label: string;
  lat: number;
  lng: number;
}

const ISTANBUL = turkishCities.find((c) => c.name === "İstanbul") ?? turkishCities[0];
const DEFAULT_CITY: City = { label: ISTANBUL.name, lat: ISTANBUL.lat, lng: ISTANBUL.lng };
type Scale = "md" | "lg" | "xl";

function hijriToday(): string {
  try {
    return new Intl.DateTimeFormat("tr-TR-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
  } catch {
    return "";
  }
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [scale, setScale] = useState<Scale>(() => loadState<Scale>("nuur-scale", "md"));
  const [city, setCity] = useState<City>(() => loadState<City>("nuur-city", DEFAULT_CITY));
  const [prayer, setPrayer] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [notify, setNotify] = useState<NotifySettings>(() =>
    loadState<NotifySettings>("nuur-notify", DEFAULT_NOTIFY)
  );

  // Namaz vakti yaklaştığında bildirim gönderen zamanlayıcı
  useReminder(prayer, notify);

  // Push bildirimi gelince (uygulama açıksa) çan sesini çal
  usePrayerSound();

  // Bildirim ayarı değişince kaydet
  useEffect(() => {
    saveState("nuur-notify", notify);
  }, [notify]);

  // İl değişince bildirim ayarındaki il bilgisini de güncelle (push için)
  useEffect(() => {
    setNotify((n) =>
      n.city === city.label && n.lat === city.lat && n.lng === city.lng
        ? n
        : { ...n, city: city.label, lat: city.lat, lng: city.lng }
    );
  }, [city.label, city.lat, city.lng]);

  // Yazı boyutu ölçekleme
  useEffect(() => {
    document.documentElement.dataset.scale = scale === "md" ? "" : scale;
    saveState("nuur-scale", scale);
  }, [scale]);

  // Sayfa değişince en üste kaydır
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Namaz vakitlerini çek
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchPrayerTimes(city.lat, city.lng, city.label)
      .then((d) => {
        if (active) {
          setPrayer(d);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (active) {
          setError(e?.message || "Namaz vakitleri alınamadı.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [city]);

  function selectCity(name: string) {
    const found = turkishCities.find((c) => c.name === name);
    if (found) {
      const next = { label: found.name, lat: found.lat, lng: found.lng };
      setCity(next);
      saveState("nuur-city", next);
    }
  }

  function useGps() {
    if (!navigator.geolocation) {
      setError("Cihazınız konum desteklemiyor.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = {
          label: "Konumum (GPS)",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCity(next);
        saveState("nuur-city", next);
        setGpsLoading(false);
      },
      () => {
        setGpsLoading(false);
        setError("Konum alınamadı. Lütfen izin verdiğinizden emin olun.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  function bumpScale(dir: number) {
    const order: Scale[] = ["md", "lg", "xl"];
    const i = order.indexOf(scale);
    setScale(order[Math.max(0, Math.min(2, i + dir))]);
  }

  return (
    <div className="min-h-screen bg-cream pb-28">
      {/* Üst başlık */}
      <header className="sticky top-0 z-20 border-b border-nuur-100 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <button
            onClick={() => setPage("home")}
            className="flex items-center gap-3 text-left"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-nuur-700 to-nuur-900 text-2xl shadow-md">
              🌙
            </span>
            <span>
              <span className="block text-2xl font-black leading-none text-nuur-900">Zikir</span>
              <span className="block text-sm font-semibold text-nuur-500">İslamî Rehber</span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            {hijriToday() && (
              <span className="hidden rounded-xl bg-white px-3 py-2 text-sm font-bold text-nuur-700 shadow-sm ring-1 ring-black/5 sm:block">
                🗓️ {hijriToday()}
              </span>
            )}
            <div className="flex items-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
              <button
                onClick={() => bumpScale(-1)}
                aria-label="Yazıyı küçült"
                className="px-3 py-2 text-xl font-black text-nuur-600 active:bg-nuur-50"
              >
                A−
              </button>
              <span className="h-6 w-px bg-nuur-100" />
              <button
                onClick={() => bumpScale(1)}
                aria-label="Yazıyı büyüt"
                className="px-3 py-2 text-2xl font-black text-nuur-600 active:bg-nuur-50"
              >
                A
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* İçerik */}
      <main className="mx-auto max-w-2xl px-4 py-5">
        {page === "home" && (
          <Home setPage={setPage} prayerData={prayer} loading={loading} error={error} />
        )}
        {page === "prayer" && (
          <PrayerTimes
            onBack={() => setPage("home")}
            prayerData={prayer}
            loading={loading}
            error={error}
            selectedLabel={city.label}
            gpsLoading={gpsLoading}
            onSelectCity={selectCity}
            onUseGps={useGps}
            notify={notify}
            onNotifyChange={setNotify}
          />
        )}
        {page === "guide" && <PrayerGuide onBack={() => setPage("home")} />}
        {page === "qibla" && <Qibla onBack={() => setPage("home")} />}
        {page === "tasbih" && <Tasbih onBack={() => setPage("home")} />}
        {page === "quran" && <Surahs onBack={() => setPage("home")} />}
        {page === "asma" && <Asma onBack={() => setPage("home")} />}
        {page === "duas" && <Duas onBack={() => setPage("home")} />}
        {page === "wisdom" && <Wisdom onBack={() => setPage("home")} />}
      </main>

      <MiniPlayer />
      <InstallPrompt />

      <BottomNav page={page} setPage={setPage} />
    </div>
  );
}
