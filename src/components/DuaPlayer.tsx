import { useEffect, useState } from "react";
import type { Dua } from "@/data/duas";
import { fetchSurah, fetchAyahAudio, audioCache, preFetchAyahAudio } from "@/lib/quran";
import { audioPlayer, useAudio } from "@/hooks/useAudio";
import { surahMeta } from "@/data/surahMeta";
import { speakArabic, stopSpeaking } from "@/lib/tts";
import type { DuaCategory } from "@/data/duas";

// Sûre ses listesi önbelleği (id -> url listesi)
const surahAudioCache = new Map<number, string[]>();

function listEquals(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((u, i) => u === b[i]);
}

// Tüm sesleri önyükle — component mount'ta çağrılır
export function preFetchCategoryAudio(category: DuaCategory): void {
  const refs = category.duas.map((d) => d.audioRef).filter(Boolean);
  if (refs.length) preFetchAyahAudio(refs as string[]);
  if (category.surahIds) {
    for (const id of category.surahIds) {
      if (!surahAudioCache.has(id)) {
        fetchSurah(id)
          .then((s) => {
            const urls = s.ayahs.map((a) => a.audio).filter(Boolean);
            if (urls.length) surahAudioCache.set(id, urls);
          })
          .catch(() => {});
      }
    }
  }
}

// Tam sûreyi dinleten düğme (namaz sûreleri için)
export function SurahListenButton({ surahId }: { surahId: number }) {
  const audio = useAudio();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const cached = surahAudioCache.get(surahId);
  const isActive = cached != null && listEquals(cached, audio.list);
  const playing = isActive && (audio.status === "playing" || audio.status === "loading");

  async function handle() {
    setError(false);
    if (isActive) {
      audioPlayer.toggle();
      return;
    }
    let urls = surahAudioCache.get(surahId);
    if (!urls) {
      setLoading(true);
      try {
        const s = await fetchSurah(surahId);
        urls = s.ayahs.map((a) => a.audio).filter(Boolean);
        surahAudioCache.set(surahId, urls);
      } catch {
        setError(true);
        setLoading(false);
        return;
      }
      setLoading(false);
    }
    if (urls && urls.length) audioPlayer.playList(urls);
  }

  return (
    <button
      onClick={handle}
      className="flex shrink-0 items-center gap-2 rounded-2xl bg-gold-500 px-4 py-2.5 text-base font-extrabold text-nuur-900 shadow transition active:scale-95"
    >
      <span className="text-xl">{loading ? "⏳" : playing ? "⏸" : "▶"}</span>
      {loading ? "Yükleniyor" : playing ? "Duraklat" : "Dinle"}
      {error && <span className="ml-1 text-sm text-red-700">!</span>}
    </button>
  );
}

// Tek bir duayı dinleten düğme
// - TTS (telefonun sesli okuması) birincil yöntemdir — her cihazda çalışır
// - audioRef + önbellekte URL varsa Kur'an sesi ile değiştirilir (daha kaliteli)
// - Önbellekte yoksa arka planda getirilir, bir sonraki tıklamada kullanılır
export function DuaPlayButton({ dua }: { dua: Dua }) {
  const audio = useAudio();
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [ttsBusy, setTtsBusy] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // Önbellekteki URL (varsa)
  const cachedUrl = dua.audioRef ? (audioCache.get(dua.audioRef) ?? null) : null;

  // Bileşen kapanırken TTS durdurulur
  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  // Sesli okuma çalınıyorsa ve Kur'an sesi başlarsa TTS durdurulsun
  useEffect(() => {
    if (audio.status !== "idle" && ttsPlaying) {
      stopSpeaking();
      setTtsPlaying(false);
    }
  }, [audio.status, ttsPlaying]);

  // URL henüz önbellekte yoksa arka planda getir
  useEffect(() => {
    if (dua.audioRef && !audioCache.has(dua.audioRef)) {
      fetchAyahAudio(dua.audioRef).catch(() => {});
    }
  }, [dua.audioRef]);

  function handle() {
    setErrMsg(null);

    // TTS çalıyorsa durdur
    if (ttsPlaying) {
      stopSpeaking();
      setTtsPlaying(false);
      return;
    }

    // Önce çalan her şeyi durdur
    audioPlayer.stop();

    // URL önbellekteyse Kur'an sesini çal (senkron, gesture korunur)
    if (dua.audioRef && cachedUrl) {
      audioPlayer.playSingle(cachedUrl);
      return;
    }

    // URL önbellekte değilse arka planda getir (bir sonraki tık için)
    if (dua.audioRef && !audioCache.has(dua.audioRef)) {
      fetchAyahAudio(dua.audioRef).catch(() => {});
    }

    // TTS ile sesli oku (senkron — gesture korunur, her cihazda çalışır)
    const ok = speakArabic(dua.arabic, {
      onStart: () => {
        setTtsBusy(false);
        setTtsPlaying(true);
        setErrMsg(null);
      },
      onEnd: () => {
        setTtsPlaying(false);
        setTtsBusy(false);
      },
      onError: () => {
        setTtsPlaying(false);
        setTtsBusy(false);
        setErrMsg("Cihazda ses yok");
      },
    });
    if (!ok) {
      setErrMsg("Cihaz sesi desteklemiyor");
    } else {
      setTtsBusy(true);
    }
  }

  // Kur'an sesi aktif mi (TTS'yi bastırmış mı)?
  const kuranOverride = cachedUrl != null && audio.current === cachedUrl && audio.status !== "idle";
  const kuranPlaying = kuranOverride && audio.status === "playing";
  const kuranLoading = kuranOverride && audio.status === "loading";
  const loading = ttsBusy || kuranLoading;
  const playing = kuranPlaying || ttsPlaying;

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <button
        onClick={handle}
        className={
          "flex items-center gap-2 rounded-2xl px-4 py-2.5 text-base font-extrabold transition active:scale-95 " +
          (errMsg
            ? "bg-red-50 text-red-600 ring-1 ring-red-200"
            : "bg-nuur-50 text-nuur-700 ring-1 ring-nuur-100")
        }
      >
        <span className="text-xl">
          {loading ? "⏳" : playing ? "⏹" : "▶"}
        </span>
        {loading
          ? "Yükleniyor"
          : playing
            ? "Durdur"
            : errMsg
              ? "Tekrar dene"
              : "Dinle"}
      </button>
      {errMsg ? (
        <span className="text-xs font-semibold text-red-500">{errMsg}</span>
      ) : (
        <span className="text-xs font-semibold text-nuur-400">
          {kuranOverride ? "Kur'an sesi" : "Okuma sesi"}
        </span>
      )}
    </div>
  );
}

export function surahName(id: number): string {
  return surahMeta.find((s) => s.id === id)?.name ?? `Sûre ${id}`;
}

export function surahArabic(id: number): string {
  return surahMeta.find((s) => s.id === id)?.arabicName ?? "";
}
