// ============================================================================
//  GÜVENLİ ARAPÇA SESLİ OKUMA (Text-to-Speech)
// ----------------------------------------------------------------------------
//  Çözülen sorunlar:
//   - iOS, speak()'i kullanıcı dokunuşuyla AYNI anda (senkron) ister.
//     async/await veya setTimeout kullanınca dokunuş bağlantısı kopar ve
//     okuma anında iptal olur. Bu yüzden SENKRON çağrılır.
//   - Sesler uygulama açılırken önceden yüklenir (Android için kritik).
//   - En iyi Arapça sesi seçilir.
// ============================================================================

let voicesCache: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;
// ÖNEMLİ: Okuma nesnesi modül düzeyinde tutulur. Chrome (bilgisayar/Android)
// bu nesneyi çöp toplayıp silerse okuma anında durur. Bu referans bunu engeller.
let currentUtterance: SpeechSynthesisUtterance | null = null;

// UYGULAMA AÇILIRKEN çağrılır. Sesleri önceden yükler.
export function primeVoices(): void {
  if (!("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  const load = () => {
    const v = synth.getVoices();
    if (v.length > 0) {
      voicesCache = v;
      voicesLoaded = true;
    }
  };
  load();
  // Periyodik olarak sesleri yenile (bazı tarayıcılar geç yükler)
  let tries = 0;
  const timer = setInterval(() => {
    load();
    tries++;
    if (voicesLoaded || tries > 10) clearInterval(timer);
  }, 400);
  try {
    synth.addEventListener("voiceschanged", load);
  } catch {
    // yoksay
  }
}

// Cihazda Arapça ses var mı?
export function hasArabicVoice(): boolean {
  return pickBestArabicVoice(voicesCache) != null;
}

// Öncelik sırasına göre en iyi Arapça sesi seçer
function pickBestArabicVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const arabic = voices.filter((v) => v.lang?.toLowerCase().startsWith("ar"));
  if (arabic.length === 0) return null;

  const preferredNames = [
    "maged", "majed", "google", "amira", "tarik", "naayf", "hamed", "salma",
  ];
  for (const name of preferredNames) {
    const found = arabic.find((v) => v.name?.toLowerCase().includes(name));
    if (found) return found;
  }
  const sa = arabic.find((v) => v.lang?.toLowerCase().includes("ar-sa"));
  if (sa) return sa;
  return arabic[0];
}

export interface SpeakHandlers {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

// Arapça metni SENKRON olarak yüksek sesle okur.
// Dokunuş anında çağrılmalı (iOS için zorunlu). Hiç await/setTimeout yok.
export function speakArabic(text: string, handlers: SpeakHandlers = {}): boolean {
  if (!("speechSynthesis" in window)) {
    handlers.onError?.();
    return false;
  }

  const synth = window.speechSynthesis;
  // Askıdaysa devam ettir
  try {
    if (synth.speaking) synth.cancel();
  } catch {
    // yoksay
  }

  // Ses henüz yüklenmediyse şimdi yüklemeyi dene
  if (!voicesLoaded || voicesCache.length === 0) {
    voicesCache = synth.getVoices();
    voicesLoaded = voicesCache.length > 0;
  }

  const voice = pickBestArabicVoice(voicesCache);
  const u = new SpeechSynthesisUtterance(text);
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang;
  } else {
    u.lang = "ar-SA";
  }
  u.rate = 0.8;
  u.pitch = 1.0;
  u.volume = 1.0;

  let started = false;
  u.onstart = () => {
    started = true;
    handlers.onStart?.();
  };
  u.onend = () => {
    currentUtterance = null; // referansı bırak
    handlers.onEnd?.();
  };
  u.onerror = () => {
    currentUtterance = null;
    handlers.onError?.();
  };

  // 🔑 KRİTİK: Nesneyi canlı tut (Chrome çöp toplamasını engeller).
  // Bu, bilgisayar ve Android'de "anında durma" sorununu çözer.
  currentUtterance = u;

  // Doğrudan (senkron) çağır — dokunuş bağlamı korunur (iOS için şart)
  try {
    synth.speak(u);
  } catch {
    currentUtterance = null;
    handlers.onError?.();
    return false;
  }

  // Güvenlik: eğer 1.5 saniye içinde başlamadıysa yine de "çalıyor" kabul et
  setTimeout(() => {
    if (!started) handlers.onStart?.();
  }, 1500);
  return true;
}

export function stopSpeaking(): void {
  try {
    currentUtterance = null;
    window.speechSynthesis?.cancel();
  } catch {
    // yoksay
  }
}

// Şu an okuma yapılıyor mu?
export function isSpeaking(): boolean {
  return currentUtterance != null;
}
