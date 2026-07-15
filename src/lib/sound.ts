// ============================================================================
//  BİLDİRİM SESİ — Web Audio API ile sentezlenmiş yumuşak bir çan sesi
// ----------------------------------------------------------------------------
//  Hiç ses dosyası gerektirmez; kodla üretilir. Bu sayede:
//  - Uygulama açıkken gelen hatırlatmalarda bu hoş ses çalar.
//  - Uygulama kapalıyken gelen push'larda işletim sisteminin varsayılan sesi çalar.
// ============================================================================

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctx = new AC();
    }
    // Tarayıcılar bazen context'i askıya alır; devam ettir
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

// Tek bir çan notası çalar (yumuşak başlangıç, yavaş sönüm)
function playNote(ac: AudioContext, freq: number, startAt: number, volume: number) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();

  // Yumuşak, çan benzeri bir ton için "sine" dalga
  osc.type = "sine";
  osc.frequency.value = freq;

  // Sönüm (envelope): yumuşak yükseliş, yavaş düşüş (çan etkisi)
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(volume, startAt + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 1.4);

  osc.connect(gain);
  gain.connect(ac.destination);

  osc.start(startAt);
  osc.stop(startAt + 1.5);
}

// Namaz vakti için özel titreşim desenini telefonda test eder.
// (Gerçek push gelince bu desen otomatik uygulanır.)
export function vibratePrayerPattern(): void {
  try {
    if ("vibrate" in navigator) {
      navigator.vibrate([180, 90, 180, 90, 180, 250, 400]);
    }
  } catch {
    // yoksay
  }
}

// Namaz vakti için yumuşak, huzurlu iki tonlu çan sesi.
// (Ezanın "Allâhu Ekber" tonuna yakın, dingin bir duygu veren frekanslar.)
export function playPrayerChime(): void {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  // İki nazik notanın peş peşe çalması
  playNote(ac, 587.33, now, 0.25); // D5 (ilk ton)
  playNote(ac, 880.0, now + 0.35, 0.22); // A5 (ikinci, daha tiz ton)
}

// Kullanıcı, izin verir vermez sesi duyabilsin diye kısa bir ön örnekleme.
// (Bazı tarayıcılar ilk kullanıcı etkileşimine kadar sesi kapatır.)
export function primeAudio(): void {
  const ac = getCtx();
  if (ac && ac.state === "running") {
    // Çok kısa, hafif bir tık — context'i tam aktif eder
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.01);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.02);
  }
}
