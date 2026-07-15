import { audioPlayer, useAudio } from "@/hooks/useAudio";

interface Props {
  url: string | null;
  label?: string;
  className?: string;
  variant?: "solid" | "subtle";
}

// Tek bir ses dosyasını çalan/duraklatan büyük dokunmatik düğme
export default function AudioButton({ url, label, className, variant = "solid" }: Props) {
  const audio = useAudio();
  const isCurrent = url != null && audio.current === url;
  const isPlaying = isCurrent && audio.status === "playing";
  const isLoading = isCurrent && audio.status === "loading";
  const disabled = !url;

  const base =
    variant === "solid"
      ? "bg-gold-500 text-nuur-900 shadow-md"
      : "bg-nuur-50 text-nuur-700 ring-1 ring-nuur-100";

  return (
    <button
      onClick={() => url && audioPlayer.playSingle(url)}
      disabled={disabled}
      aria-label={label || "Dinle"}
      className={
        "flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-lg font-extrabold transition active:scale-95 disabled:opacity-40 " +
        base +
        (className ? " " + className : "")
      }
    >
      <span className="text-2xl">{isLoading ? "⏳" : isPlaying ? "⏸" : "▶"}</span>
      {label && <span>{isLoading ? "Yükleniyor…" : isPlaying ? "Duraklat" : label}</span>}
    </button>
  );
}
