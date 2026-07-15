import { useNow } from "@/hooks/useClock";
import { allPages, type Page } from "@/lib/nav";
import { formatCountdown, getCurrentPrayer, getNextPrayer, type PrayerData } from "@/lib/prayer";
import { Card, Spinner } from "@/components/ui";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "Hayırlı geceler";
  if (h < 12) return "Günaydın";
  if (h < 18) return "İyi günler";
  if (h < 22) return "İyi akşamlar";
  return "İyi geceler";
}

export default function Home({
  setPage,
  prayerData,
  loading,
  error,
}: {
  setPage: (p: Page) => void;
  prayerData: PrayerData | null;
  loading: boolean;
  error: string | null;
}) {
  const now = useNow(1000);
  const next = prayerData ? getNextPrayer(prayerData.times) : null;
  const current = prayerData ? getCurrentPrayer(prayerData.times) : null;

  return (
    <div className="animate-fade space-y-6">
      {/* Selamlama */}
      <div className="flex items-center justify-between gap-3 px-1 pt-1">
        <div className="min-w-0">
          <p className="truncate text-xl font-extrabold text-nuur-900 sm:text-2xl">
            Esselâmü aleyküm 👋
          </p>
          <p className="truncate text-base text-nuur-600 sm:text-lg">{greeting()}</p>
        </div>
        <div className="shrink-0 rounded-2xl bg-white px-4 py-2 text-center shadow-sm ring-1 ring-black/5">
          <p className="text-xl font-black tabular-nums text-nuur-800 sm:text-2xl">
            {now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="text-xs font-semibold text-nuur-500">Şu anki saat</p>
        </div>
      </div>

      {/* Bir sonraki vakit kartı */}
      <Card className="overflow-hidden bg-gradient-to-br from-nuur-700 to-nuur-900 text-white ring-0">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-bold">
              🕌 Bir Sonraki Vakit
            </span>
            {prayerData && (
              <span className="text-sm font-semibold text-white/80">📍 {prayerData.city}</span>
            )}
          </div>

          {loading ? (
            <div className="pt-6">
              <Spinner label="Vakitler yükleniyor…" />
            </div>
          ) : error || !next ? (
            <div className="pt-6">
              <p className="text-2xl font-bold">Vakit bilgisi alınamadı</p>
              <p className="mt-1 text-white/80">
                İnternet bağlantınızı kontrol edip tekrar deneyin.
              </p>
              <button
                onClick={() => setPage("prayer")}
                className="mt-4 rounded-2xl bg-white px-5 py-3 text-lg font-extrabold text-nuur-800"
              >
                Tekrar dene
              </button>
            </div>
          ) : (
            <>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
                    {next.prayer.name} vaktine kala
                  </p>
                  <p className="mt-1 text-4xl font-black tabular-nums tracking-tight sm:text-5xl">
                    {formatCountdown(next.remainingMs)}
                  </p>
                </div>
                <p className="pb-2 text-right text-lg font-bold text-gold-300">
                  {next.prayer.time}
                </p>
              </div>
              {current && (
                <p className="mt-3 rounded-2xl bg-white/10 px-4 py-2 text-base font-semibold text-white/90">
                  Şu an <span className="font-extrabold text-gold-300">{current.name}</span> vaktindeyiz.
                </p>
              )}
              {prayerData?.hijri && (
                <p className="mt-3 text-base text-white/70">🗓️ {prayerData.hijri}</p>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Hızlı erişim başlığı */}
      <div>
        <h2 className="px-1 text-lg font-bold uppercase tracking-wide text-nuur-500">
          Ne yapmak istersiniz?
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {allPages.map((p) => (
            <Card key={p.id} onClick={() => setPage(p.id)}>
              <div className="flex min-h-[132px] flex-col items-center justify-center gap-2 p-4 text-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-nuur-50 text-3xl">
                  {p.icon}
                </div>
                <div className="w-full">
                  <p className="text-balance text-base font-extrabold leading-tight text-nuur-900 sm:text-lg">
                    {p.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-tight text-nuur-500 sm:text-sm">
                    {p.subtitle}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <p className="px-1 pb-2 text-center text-sm text-nuur-400">
        Tüm mahlûkat adına hamd, âlemlerin Rabbi Allah'a olsun. 🌿
      </p>
    </div>
  );
}
