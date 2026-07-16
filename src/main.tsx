import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { primeVoices } from "@/lib/tts";
import { preFetchAyahAudio } from "@/lib/quran";
import { duaCategories } from "@/data/duas";

// Cihazın sesli okuma seslerini önceden yükle (dualar için)
primeVoices();

// Tüm duaların Kur'an seslerini uygulama açılır açılmaz önbelleğe al
// Böylece kullanıcı butona tıkladığında URL hazır olur
const allAudioRefs = duaCategories.flatMap((c) =>
  c.duas.map((d) => d.audioRef).filter(Boolean)
);
if (allAudioRefs.length) preFetchAyahAudio(allAudioRefs as string[]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
