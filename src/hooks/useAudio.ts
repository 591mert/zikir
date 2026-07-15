import { useSyncExternalStore } from "react";

// Uygulama genelinde tek bir ses oynatıcı (aynı anda iki ses çalmaz).

export type AudioStatus = "idle" | "loading" | "playing" | "paused";

export interface AudioState {
  status: AudioStatus;
  index: number;
  list: string[];
  current: string | null;
}

let state: AudioState = { status: "idle", index: 0, list: [], current: null };
const listeners = new Set<() => void>();

function emit(next: Partial<AudioState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

let audio: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio();
    audio.preload = "auto";
    audio.addEventListener("playing", () => emit({ status: "playing" }));
    audio.addEventListener("pause", () => {
      // Ses tamamen bittiyse "ended" olayı durumu zaten yönetir; burada duraklatma durumunu ayarla.
      if (!audio || audio.ended) return;
      emit({ status: "paused" });
    });
    audio.addEventListener("ended", () => {
      const nextIndex = state.index + 1;
      if (nextIndex < state.list.length) {
        playIndex(nextIndex);
      } else {
        emit({ status: "idle" });
      }
    });
    audio.addEventListener("error", () => emit({ status: "idle" }));
    audio.addEventListener("waiting", () => emit({ status: "loading" }));
  }
  return audio;
}

function playIndex(i: number) {
  const el = getAudio();
  const url = state.list[i];
  if (!url) return;
  el.src = url;
  el.play().then(
    () => emit({ status: "playing", index: i, current: url }),
    () => emit({ status: "idle" })
  );
}

export const audioPlayer = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): AudioState {
    return state;
  },
  // Bir çalma listesi (âyet sesleri) başlat veya tek URL çal
  playList(urls: string[], startIndex = 0) {
    if (!urls.length) return;
    const list = urls.filter(Boolean);
    // Aynı listeyse ve o an çalıyorsa -> duraklat
    const sameList =
      list.length === state.list.length &&
      list.every((u, i) => u === state.list[i]) &&
      state.current === list[startIndex];
    if (sameList && (state.status === "playing" || state.status === "loading")) {
      audio?.pause();
      emit({ status: "paused" });
      return;
    }
    emit({ list, index: startIndex, current: list[startIndex], status: "loading" });
    playIndex(startIndex);
  },
  // Tek bir ses çal (önceden bir liste varsa onu durdurur)
  playSingle(url: string) {
    if (state.current === url) {
      if (state.status === "playing" || state.status === "loading") {
        audio?.pause();
        emit({ status: "paused" });
      } else {
        audio?.play().then(
          () => emit({ status: "playing" }),
          () => emit({ status: "idle" })
        );
      }
      return;
    }
    emit({ list: [url], index: 0, current: url, status: "loading" });
    const el = getAudio();
    el.src = url;
    el.play().then(
      () => emit({ status: "playing" }),
      () => emit({ status: "idle" })
    );
  },
  toggle() {
    const el = audio;
    if (!el) return;
    if (state.status === "playing" || state.status === "loading") {
      el.pause();
      emit({ status: "paused" });
    } else if (el.src) {
      el.play().then(
        () => emit({ status: "playing" }),
        () => emit({ status: "idle" })
      );
    }
  },
  stop() {
    const el = audio;
    if (el) {
      el.pause();
      el.removeAttribute("src");
      el.load();
    }
    emit({ status: "idle", current: null, list: [], index: 0 });
  },
  next() {
    const i = state.index + 1;
    if (i < state.list.length) playIndex(i);
  },
  prev() {
    const i = state.index - 1;
    if (i >= 0) playIndex(i);
  },
};

export function useAudio(): AudioState {
  return useSyncExternalStore(audioPlayer.subscribe, audioPlayer.getSnapshot, audioPlayer.getSnapshot);
}
