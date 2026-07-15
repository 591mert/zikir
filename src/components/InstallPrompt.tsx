import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIos(): boolean {
  return (
    typeof window !== "undefined" &&
    /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !(/crios|fxios/i.test(navigator.userAgent) && false)
  );
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIos, setShowIos] = useState(false);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem("nur-install-dismissed") === "1"
  );

  useEffect(() => {
    if (isStandalone() || dismissed) return;

    function onPrompt(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onPrompt);

    // iOS'ta otomatik kurulum yok; kılavuz göster
    const iosTimer = window.setTimeout(() => {
      if (isIos() && !isStandalone()) setShowIos(true);
    }, 6000);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.clearTimeout(iosTimer);
    };
  }, [dismissed]);

  if (isStandalone() || dismissed) return null;

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") setDeferred(null);
  }

  function dismiss() {
    setDismissed(true);
    localStorage.setItem("nur-install-dismissed", "1");
  }

  // Android / Chrome: kurulum düğmesi
  if (deferred) {
    return (
      <div className="fixed inset-x-3 bottom-20 z-40 mx-auto max-w-2xl animate-fade rounded-3xl bg-nuur-800 p-4 text-white shadow-2xl ring-1 ring-black/10">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl">
            📲
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-extrabold leading-tight">Nûr'u telefona kur</p>
            <p className="text-sm text-white/80">Ana ekrandan tek dokunuşla açın.</p>
          </div>
          <button
            onClick={install}
            className="shrink-0 rounded-2xl bg-gold-500 px-4 py-3 text-base font-extrabold text-nuur-900"
          >
            Kur
          </button>
          <button
            onClick={dismiss}
            aria-label="Kapat"
            className="shrink-0 px-2 text-2xl font-black text-white/60"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  // iOS: paylaş menüsü kılavuzu
  if (showIos) {
    return (
      <div className="fixed inset-x-3 bottom-20 z-40 mx-auto max-w-2xl animate-fade rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-black/10">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-nuur-50 text-2xl">
            📲
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-extrabold leading-tight text-nuur-900">
              Zikir'i ana ekrana ekleyin
            </p>
            <p className="mt-1 text-sm text-nuur-600">
              Safari'de alttaki <span className="font-bold">Paylaş</span> (
              <span className="text-base">⬆️</span>) düğmesine, sonra{" "}
              <span className="font-bold">"Ana Ekrana Ekle"</span> seçeneğine dokunun.
            </p>
          </div>
          <button
            onClick={dismiss}
            aria-label="Kapat"
            className="shrink-0 px-2 text-2xl font-black text-nuur-300"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return null;
}
