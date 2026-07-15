import { useEffect, useMemo, useState } from "react";
import { surahMeta } from "@/data/surahMeta";
import { fetchSurah, type SurahFull } from "@/lib/quran";
import { audioPlayer, useAudio } from "@/hooks/useAudio";
import { BackHeader, Card, ErrorBox, Spinner } from "@/components/ui";

export default function Surahs({ onBack }: { onBack: () => void }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [surah, setSurah] = useState<SurahFull | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audio = useAudio();

  useEffect(() => {
    if (openId == null) return;
    let active = true;
    setLoading(true);
    setError(null);
    setSurah(null);
    fetchSurah(openId)
      .then((s) => active && (setSurah(s), setLoading(false)))
      .catch(() => active && (setError("Sûre yüklenemedi. İnternet bağlantınızı kontrol edin."), setLoading(false)));
    return () => {
      active = false;
    };
  }, [openId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return surahMeta;
    return surahMeta.filter(
      (s) =>
        s.name.toLocaleLowerCase("tr").includes(q) ||
        String(s.id) === q
    );
  }, [query]);

  // Liste görünümü
  if (openId == null) {
    return (
      <div className="animate-fade space-y-5">
        <BackHeader title="Kur'an-ı Kerim" subtitle="114 sûre · meal ve sesli dinleme" onBack={onBack} />

        <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
          <span className="text-xl text-nuur-500">🔎</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sûre ara… (örn. Yâsîn, Kehf, 36)"
            inputMode="text"
            className="w-full bg-transparent text-lg font-semibold text-nuur-900 placeholder:text-nuur-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Temizle" className="text-xl font-black text-nuur-400">
              ✕
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="px-1 py-8 text-center text-lg font-semibold text-nuur-400">
            "{query}" ile sûre bulunamadı.
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((s) => (
              <Card key={s.id} onClick={() => setOpenId(s.id)} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-nuur-50 text-lg font-black text-nuur-700">
                      {s.id}
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-nuur-900">{s.name}</p>
                      <p className="text-base text-nuur-500">
                        {s.ayahs} âyet · {s.type}
                      </p>
                    </div>
                  </div>
                  <span dir="rtl" className="font-arabic text-3xl text-nuur-800">
                    {s.arabicName}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Sûre detay görünümü
  const meta = surahMeta.find((s) => s.id === openId);
  const allAudio = surah ? surah.ayahs.map((a) => a.audio) : [];

  return (
    <div className="animate-fade space-y-4">
      <BackHeader title={meta?.name ?? "Sûre"} subtitle="Kur'an-ı Kerim" onBack={onBack} />

      <button
        onClick={() => setOpenId(null)}
        className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-lg font-bold text-nuur-700 shadow-sm ring-1 ring-black/5"
      >
        ← Sûreler listesi
      </button>

      <Card className="overflow-hidden ring-0">
        <div className="bg-gradient-to-br from-nuur-700 to-nuur-900 p-6 text-center text-white">
          {meta && (
            <p dir="rtl" className="font-arabic text-5xl">{meta.arabicName}</p>
          )}
          <p className="mt-2 text-2xl font-extrabold">{meta?.name} Sûresi</p>
          <p className="mt-1 text-base text-white/70">
            {meta?.ayahs} âyet · {meta?.type} sûresi
          </p>

          {surah && allAudio.length > 0 && (
            <button
              onClick={() => audioPlayer.playList(allAudio)}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gold-500 px-6 py-4 text-lg font-extrabold text-nuur-900 shadow-lg transition active:scale-95"
            >
              <span className="text-2xl">
                {audio.status === "playing" ? "⏸" : audio.status === "loading" ? "⏳" : "▶"}
              </span>
              Sûreyi Dinle (M. Âlafâsî)
            </button>
          )}
        </div>

        {surah && openId !== 1 && openId !== 9 && (
          <div className="border-b border-nuur-100 p-5 text-center">
            <p dir="rtl" className="font-arabic text-4xl text-nuur-900">
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ
            </p>
            <p className="mt-1 text-sm text-nuur-500">Rahmân ve Rahîm olan Allah'ın adıyla.</p>
          </div>
        )}

        {loading ? (
          <Spinner label="Sûre yükleniyor…" />
        ) : error ? (
          <div className="p-4">
            <ErrorBox message={error} />
          </div>
        ) : surah ? (
          <div className="divide-y divide-nuur-50">
            {surah.ayahs.map((a) => {
              const active = audio.current === a.audio;
              const playing = active && audio.status === "playing";
              return (
                <div key={a.number} className={"p-5 " + (active ? "bg-gold-300/20" : "")}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-300/40 text-sm font-black text-gold-600">
                        {a.numberInSurah}
                      </span>
                      <span className="text-sm font-bold text-nuur-400">Âyet</span>
                    </div>
                    <button
                      onClick={() => audioPlayer.playSingle(a.audio)}
                      aria-label="Bu âyeti dinle"
                      className={
                        "flex h-11 w-11 items-center justify-center rounded-full text-xl transition active:scale-90 " +
                        (active ? "bg-gold-500 text-nuur-900" : "bg-nuur-50 text-nuur-700")
                      }
                    >
                      {active && audio.status === "loading" ? "⏳" : playing ? "⏸" : "▶"}
                    </button>
                  </div>
                  <p dir="rtl" className="font-arabic text-3xl leading-loose text-nuur-900 sm:text-4xl">
                    {a.arabic}
                  </p>
                  <p className="mt-2 text-xl leading-relaxed text-nuur-800">{a.turkish}</p>
                </div>
              );
            })}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
