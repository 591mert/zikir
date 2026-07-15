import { useMemo, useState } from "react";
import { useNow } from "@/hooks/useClock";
import {
  turkishCities,
  REGION_ORDER,
  sortCitiesTurkish,
  getNextPrayer,
  getCurrentPrayer,
  formatCountdown,
  type PrayerData,
} from "@/lib/prayer";
import { BackHeader, Card, ErrorBox, Pill, PrimaryButton, Spinner } from "@/components/ui";
import NotifyCard from "@/components/NotifyCard";
import type { NotifySettings } from "@/lib/notifications";

const ICONS: Record<string, string> = {
  imsak: "🌙",
  gunes: "🌅",
  ogle: "☀️",
  ikindi: "🌤️",
  aksam: "🌇",
  yatsi: "🌌",
};

const GPS_LABEL = "Konumum (GPS)";

export default function PrayerTimes({
  onBack,
  prayerData,
  loading,
  error,
  selectedLabel,
  gpsLoading,
  onSelectCity,
  onUseGps,
  notify,
  onNotifyChange,
}: {
  onBack: () => void;
  prayerData: PrayerData | null;
  loading: boolean;
  error: string | null;
  selectedLabel: string;
  gpsLoading: boolean;
  onSelectCity: (name: string) => void;
  onUseGps: () => void;
  notify: NotifySettings;
  onNotifyChange: (s: NotifySettings) => void;
}) {
  const now = useNow(1000);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const next = prayerData ? getNextPrayer(prayerData.times) : null;
  const current = prayerData ? getCurrentPrayer(prayerData.times) : null;

  function handleSelect(name: string) {
    setOpen(false);
    setQuery("");
    if (name === GPS_LABEL) {
      onUseGps();
    } else {
      onSelectCity(name);
    }
  }

  // Arama metnine göre filtrelenmiş iller (bölgeye göre gruplanır)
  const grouped = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    const filtered = q
      ? turkishCities.filter((c) => c.name.toLocaleLowerCase("tr").includes(q))
      : [...turkishCities].sort(sortCitiesTurkish);

    return REGION_ORDER.map((region) => ({
      region,
      cities: filtered.filter((c) => c.region === region),
    })).filter((g) => g.cities.length > 0);
  }, [query]);

  const noResults = query.trim().length > 0 && grouped.length === 0;

  return (
    <div className="animate-fade space-y-5">
      <BackHeader title="Namaz Vakitleri" subtitle="Bugünün vakitleri" onBack={onBack} />

      {/* Şehir seçimi */}
      <div className="space-y-3">
        <label className="block px-1 text-lg font-bold text-nuur-700">Şehrinizi seçin</label>

        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4 text-xl font-bold text-nuur-900 shadow-sm ring-1 ring-black/5"
        >
          <span className="flex items-center gap-3">
            <span className="text-2xl">📍</span>
            {selectedLabel}
          </span>
          <span className="text-nuur-400">{open ? "▲" : "▼"}</span>
        </button>

        {open && (
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
            {/* Arama kutusu */}
            <div className="border-b border-nuur-100 p-3">
              <div className="flex items-center gap-2 rounded-2xl bg-nuur-50 px-4 py-3">
                <span className="text-xl text-nuur-500">🔎</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="İl adını yazın… (örn. Konya)"
                  inputMode="text"
                  autoFocus
                  className="w-full bg-transparent text-lg font-semibold text-nuur-900 placeholder:text-nuur-400 focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label="Aramayı temizle"
                    className="text-xl font-black text-nuur-400"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* GPS seçeneği */}
            <button
              onClick={() => handleSelect(GPS_LABEL)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-lg font-bold text-nuur-700 hover:bg-nuur-50"
            >
              <span className="text-2xl">📡</span> {GPS_LABEL}
              {gpsLoading && <span className="text-nuur-400">…</span>}
              <span className="ml-auto text-sm font-semibold text-nuur-400">Otomatik</span>
            </button>

            {/* İl listesi (bölgeye göre) */}
            <div className="max-h-[26rem] overflow-y-auto pb-2">
              {noResults ? (
                <p className="px-4 py-8 text-center text-lg font-semibold text-nuur-400">
                  "{query}" ile eşleşen il bulunamadı.
                </p>
              ) : (
                grouped.map((g) => (
                  <div key={g.region}>
                    {!query.trim() && (
                      <p className="sticky top-0 bg-white px-4 py-2 text-sm font-bold uppercase tracking-wide text-gold-600">
                        {g.region} Bölgesi
                      </p>
                    )}
                    {g.cities.map((c) => {
                      const selected = selectedLabel === c.name;
                      return (
                        <button
                          key={`${c.name}-${c.lat}`}
                          onClick={() => handleSelect(c.name)}
                          className={
                            "flex w-full items-center gap-3 px-4 py-3 text-left text-lg font-semibold hover:bg-nuur-50 " +
                            (selected ? "bg-nuur-50 text-nuur-900" : "text-nuur-800")
                          }
                        >
                          <span className="text-xl">📍</span> {c.name}
                          {selected && <span className="ml-auto text-xl text-nuur-600">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tarih ve saat */}
      {prayerData && (
        <div className="flex items-center justify-between gap-2 rounded-2xl bg-nuur-50 px-5 py-3">
          <div className="text-nuur-800">
            <p className="text-lg font-extrabold tabular-nums">
              🕐 {now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p className="text-sm text-nuur-600">
              {prayerData.weekday} · {prayerData.gregorianReadable}
            </p>
          </div>
          <p className="text-right text-base font-bold text-nuur-700">🗓️ {prayerData.hijri}</p>
        </div>
      )}

      {/* Geri sayım */}
      {loading ? (
        <Spinner label="Vakitler yükleniyor…" />
      ) : error || !prayerData || !next ? (
        <ErrorBox message={error || "Lütfen şehrinizi seçip tekrar deneyin."} />
      ) : (
        <>
          <Card className="overflow-hidden bg-gradient-to-br from-nuur-700 to-nuur-900 p-6 text-white ring-0">
            <p className="text-base font-semibold uppercase tracking-wide text-white/70">
              {next.prayer.name} vaktine kala
            </p>
            <p className="mt-1 text-5xl font-black tabular-nums tracking-tight sm:text-6xl">
              {formatCountdown(next.remainingMs)}
            </p>
            <p className="mt-2 text-lg font-bold text-gold-300">{next.prayer.name} · {next.prayer.time}</p>
            {current && (
              <p className="mt-3 text-base text-white/80">
                Şu an <span className="font-extrabold text-gold-300">{current.name}</span> vaktindesiniz.
              </p>
            )}
          </Card>

          {/* Vakitler listesi */}
          <div className="space-y-3">
            {prayerData.times.map((t) => {
              const isNext = next.prayer.key === t.key;
              const isCurrent = current?.key === t.key;
              return (
                <Card
                  key={t.key}
                  className={
                    isNext
                      ? "p-5 ring-2 ring-gold-400"
                      : isCurrent
                        ? "p-5 bg-nuur-50"
                        : "p-5"
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{ICONS[t.key]}</span>
                      <div>
                        <p className="text-2xl font-extrabold text-nuur-900">{t.name}</p>
                        {isCurrent && <Pill tone="nuur">Şu anki vakit</Pill>}
                        {isNext && <Pill tone="gold">Sıradaki vakit</Pill>}
                      </div>
                    </div>
                    <p className="text-3xl font-black tabular-nums text-nuur-800">{t.time}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Namaz hatırlatma bildirimleri */}
          <NotifyCard
            settings={notify}
            onChange={onNotifyChange}
            cityLabel={selectedLabel}
          />

          <p className="px-1 text-center text-sm text-nuur-400">
            Vakitler Diyanet İşleri Başkanlığı hesaplama yöntemine göre gösterilir.
          </p>
        </>
      )}

      {gpsLoading && (
        <PrimaryButton tone="gold" onClick={() => {}}>
          📡 Konumunuz bulunuyor…
        </PrimaryButton>
      )}
    </div>
  );
}
