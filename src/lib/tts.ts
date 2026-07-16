// ============================================================================
//  GÜVENLİ ARAPÇA SESLİ OKUMA (Text-to-Speech)
// ----------------------------------------------------------------------------
//  Çözülen sorunlar:
//   - iOS, speak()'i kullanıcı dokunuşuyla AYNI anda (senkron) ister.
//     async/await veya setTimeout kullanınca dokunuş bağlantısı kopar ve
//     okuma anında iptal olur. Bu yüzden SENKRON çağrılır.
//   - Sesler uygulama açılırken önceden yüklenir (Android için kritik).
//   - En iyi Arapça sesi seçilir.
//   - iOS'ta ses kalitesi düşüktü — premium sesler önceliklendirildi.
//   - Android'de TTS bazen sessiz kalıyordu — hata yönetimi eklendi.
// ============================================================================

let voicesCache: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;
let isIOS = false;
let isWindows = false;
// ÖNEMLİ: Okuma nesnesi modül düzeyinde tutulur. Chrome (bilgisayar/Android)
// bu nesneyi çöp toplayıp silerse okuma anında durur. Bu referans bunu engeller.
let currentUtterance: SpeechSynthesisUtterance | null = null;

function detectIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

// UYGULAMA AÇILIRKEN çağrılır. Sesleri önceden yükler.
export function primeVoices(): void {
  if (!("speechSynthesis" in window)) return;
  isIOS = detectIOS();
  isWindows = navigator.platform?.toLowerCase().includes("win") || false;
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

  // 1. ÖNCELİK: Doğal sinir ağı sesleri (neural / online natural)
  // Windows Edge'de "Microsoft ... Online (Natural)" çok kalitelidir
  const natural = arabic.find(
    (v) => v.name?.toLowerCase().includes("natural") || v.name?.toLowerCase().includes("neural")
  );
  if (natural) return natural;

  // 2. ÖNCELİK: Klasik yüksek kaliteli sesler (sıralı)
  const preferredNames = [
    "maged", "majed", "amira", "tarik", "salma", "hazem", "mohamed",
    "naayf", "hamed", "nora", "ayman",
    "microsoft", "zira", "lena",
    "google",
  ];
  for (const name of preferredNames) {
    const found = arabic.find((v) => v.name?.toLowerCase().includes(name));
    if (found) return found;
  }
  // 3. ÖNCELİK: Suudi Arapçası sesi (genelde daha kaliteli)
  const sa = arabic.find((v) => v.lang?.toLowerCase().includes("ar-sa"));
  if (sa) return sa;
  return arabic[0];
}

// TTS'in bu cihazda çalışıp çalışmayacağını kabaca kontrol eder
export function isTtsAvailable(): boolean {
  if (!("speechSynthesis" in window)) return false;
  return true; // her ihtimale karşı true; ses olmasa bile synth.speak() deneriz
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
  // Kurân tilâveti tonunda: yavaş, derin, doğal, etkileyici
  // Windows'ta neural sesler çok kaliteli olduğu için daha yavaş okutulur
  u.rate = isIOS ? 0.5 : isWindows ? 0.5 : 0.55;
  u.pitch = 0.75;
  u.volume = 1.0;

  let started = false;
  u.onstart = () => {
    started = true;
    handlers.onStart?.();
  };
  u.onend = () => {
    currentUtterance = null;
    handlers.onEnd?.();
  };
  u.onerror = (e) => {
    currentUtterance = null;
    // "interrupted" kullanıcı durdurması — sadece başladıysa yoksay
    if (e.error === "interrupted" && started) return;
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

  // Android'de bazen ses başlamaz ama hata da vermez.
  // 3 sn içinde başlamazsa "Cihazda ses yok" kabul et.
  setTimeout(() => {
    if (!started) {
      synth.cancel();
      currentUtterance = null;
      handlers.onError?.();
    }
  }, 3000);
  return true;
}

export function stopSpeaking(): void {
  try {
    currentUtterance = null;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // yoksay
  }
}

// Şu an okuma yapılıyor mu?
export function isSpeaking(): boolean {
  return currentUtterance != null;
}
