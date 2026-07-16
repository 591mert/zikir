import { useEffect, useRef, useState } from "react";
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
export function DuaPlayButton({ dua }: { dua: Dua }) {
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [ttsBusy, setTtsBusy] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // Anlık çalan HTMLAudioElement referansı (durdurmak için)
  const tempAudioRef = useRef<HTMLAudioElement | null>(null);

  // Bileşen kapanırken TTS + temp audio durdurulur
  useEffect(() => {
    return () => {
      stopSpeaking();
      tempAudioRef.current?.pause();
    };
  }, []);

  function stopAll() {
    stopSpeaking();
    setTtsPlaying(false);
    audioPlayer.stop();
    tempAudioRef.current?.pause();
    tempAudioRef.current = null;
  }

  function handle() {
    setErrMsg(null);

    // TTS çalıyorsa durdur
    if (ttsPlaying) {
      stopAll();
      return;
    }

    stopAll();

    const ttsStart = Date.now();

    // TTS her zaman senkron başlat (gesture korunur, her cihazda çalışır)
    const ok = speakArabic(dua.arabic, {
      onEnd: () => {
        setTtsPlaying(false);
        // 500ms'den kısa sürede bittiyse → Arapça ses verisi yok
        if (Date.now() - ttsStart < 500) {
          setErrMsg("Cihazda Arapça ses yok");
        }
      },
      onError: () => {
        setTtsPlaying(false);
        setErrMsg("Cihazda ses yok");
      },
    });
    if (!ok) {
      setErrMsg("Cihaz sesi desteklemiyor");
      return;
    }
    // Hemen "çalıyor" göster — onStart callback'ini bekleme
    setTtsPlaying(true);

    // Kur'an sesi önbellekteyse ARKA PLANDA dene (başarırsa TTS'yi durdurur)
    if (dua.audioRef) {
      const url = audioCache.get(dua.audioRef);
      if (url) {
        const el = new Audio(url);
        tempAudioRef.current = el;
        el.onplay = () => {
          stopSpeaking();
          setTtsPlaying(false);
        };
        el.onerror = () => {};
        el.play().catch(() => {});
      }
      if (!audioCache.has(dua.audioRef)) {
        fetchAyahAudio(dua.audioRef).catch(() => {});
      }
    }
  }

  const loading = false;
  const playing = ttsPlaying;

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
        <span className="text-sm font-bold text-red-600">{errMsg}</span>
      ) : (
        <span className="text-xs font-semibold text-nuur-400">
          {dua.audioRef && audioCache.has(dua.audioRef) ? "Kur'an sesi" : "Okuma sesi"}
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
