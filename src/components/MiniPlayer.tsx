import { audioPlayer, useAudio } from "@/hooks/useAudio";

// Çalma sırasında altta beliren küçük oynatıcı çubuğu
export default function MiniPlayer() {
  const audio = useAudio();
  if (audio.status === "idle" || !audio.current) return null;

  const playing = audio.status === "playing";
  const hasList = audio.list.length > 1;

  return (
    <div className="fixed inset-x-3 bottom-20 z-40 mx-auto max-w-2xl animate-fade">
      <div className="flex items-center gap-3 rounded-2xl bg-nuur-800 px-4 py-3 text-white shadow-2xl ring-1 ring-black/10">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-2xl">
          {playing ? "🔊" : "🔈"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">
            {hasList ? `Âyet ${audio.index + 1} / ${audio.list.length}` : "Dinleniyor"}
          </p>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className={
                "h-full rounded-full bg-gold-400 transition-all " +
                (audio.status === "loading" ? "w-1/3 animate-pulse" : "w-full")
              }
            />
          </div>
        </div>

        {hasList && (
          <button
            onClick={() => audioPlayer.prev()}
            disabled={audio.index <= 0}
            aria-label="Önceki"
            className="px-2 text-2xl disabled:opacity-30"
          >
            ⏮
          </button>
        )}
        <button
          onClick={() => audioPlayer.toggle()}
          aria-label={playing ? "Duraklat" : "Çal"}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-2xl text-nuur-900"
        >
          {audio.status === "loading" ? "⏳" : playing ? "⏸" : "▶"}
        </button>
        {hasList && (
          <button
            onClick={() => audioPlayer.next()}
            disabled={audio.index >= audio.list.length - 1}
            aria-label="Sonraki"
            className="px-2 text-2xl disabled:opacity-30"
          >
            ⏭
          </button>
        )}
        <button
          onClick={() => audioPlayer.stop()}
          aria-label="Kapat"
          className="px-1 text-xl text-white/60"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
