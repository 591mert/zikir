import { useEffect, useState } from "react";
import { qiblaBearing, distanceKm } from "@/lib/qibla";
import { BackHeader, Card, ErrorBox, PrimaryButton, Spinner } from "@/components/ui";

type LocStatus = "idle" | "loading" | "ready" | "error";

export default function Qibla({ onBack }: { onBack: () => void }) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locStatus, setLocStatus] = useState<LocStatus>("idle");
  const [locError, setLocError] = useState("");
  const [heading, setHeading] = useState<number | null>(null);
  const [compassActive, setCompassActive] = useState(false);

  const bearing = coords ? qiblaBearing(coords.lat, coords.lng) : 0;
  const dist = coords ? distanceKm(coords.lat, coords.lng) : 0;

  function locate() {
    if (!navigator.geolocation) {
      setLocStatus("error");
      setLocError("Cihazınız konum desteklemiyor.");
      return;
    }
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus("ready");
      },
      (err) => {
        setLocStatus("error");
        setLocError(
          err.code === 1
            ? "Konum izni reddedildi. Lütfen tarayıcı ayarlarından izin verin."
            : "Konum alınamadı. Lütfen tekrar deneyin."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  // Cihaz yönünü dinle
  function startCompass() {
    const DOE = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      const ev = e as DeviceOrientationEvent & { webkitCompassHeading?: number };
      let h: number | null = null;
      if (typeof ev.webkitCompassHeading === "number") h = ev.webkitCompassHeading;
      else if (e.alpha != null) h = 360 - e.alpha;
      if (h != null) setHeading(h);
    };
    if (typeof DOE?.requestPermission === "function") {
      DOE.requestPermission()
        .then((res) => {
          if (res === "granted") {
            window.addEventListener("deviceorientation", onOrient, true);
            window.addEventListener("deviceorientationabsolute", onOrient as EventListener, true);
            setCompassActive(true);
          }
        })
        .catch(() => setCompassActive(false));
    } else {
      window.addEventListener("deviceorientationabsolute", onOrient as EventListener, true);
      window.addEventListener("deviceorientation", onOrient, true);
      setCompassActive(true);
    }
  }

  useEffect(() => {
    return () => {
      // Bileşen kapanırken dinleyiciler temizlenir (basitleştirilmiş)
    };
  }, []);

  const dialRotation = heading != null ? -heading : 0;

  function marker(angleDeg: number, r: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: 140 + r * Math.sin(rad), y: 140 - r * Math.cos(rad) };
  }

  return (
    <div className="animate-fade space-y-5">
      <BackHeader title="Kıble Pusulası" subtitle="Kâbe'nin yönü" onBack={onBack} />

      {!coords && locStatus !== "loading" && (
        <Card className="p-8 text-center">
          <p className="text-6xl">🧭</p>
          <p className="mt-4 text-2xl font-extrabold text-nuur-900">Kıble yönünü bulalım</p>
          <p className="mt-2 text-lg text-nuur-600">
            Doğru yön için telefonunuzun konumuna ihtiyacımız var. Konumunuz sadece yön hesaplamak
            için kullanılır ve kaydedilmez.
          </p>
          <div className="mt-5">
            <PrimaryButton onClick={locate}>📡 Konumumu Bul</PrimaryButton>
          </div>
          {locStatus === "error" && (
            <p className="mt-3 text-base font-semibold text-red-600">{locError}</p>
          )}
        </Card>
      )}

      {locStatus === "loading" && <Spinner label="Konumunuz bulunuyor…" />}

      {locStatus === "error" && coords === null && (
        <ErrorBox message={locError} />
      )}

      {coords && (
        <>
          <Card className="bg-gradient-to-br from-nuur-700 to-nuur-900 p-5 text-center text-white ring-0">
            <p className="text-base font-semibold text-white/70">Kıble yönü (kuzeyden)</p>
            <p className="text-5xl font-black tabular-nums">{Math.round(bearing)}°</p>
            <p className="mt-1 text-base text-gold-300">
              🕋 Kâbe'ye yaklaşık {dist.toLocaleString("tr-TR")} km
            </p>
          </Card>

          {/* Pusula */}
          <div className="flex justify-center py-4">
            <div className="relative">
              <svg viewBox="0 0 280 280" className="h-72 w-72 drop-shadow-lg">
                {/* Zemin daire */}
                <circle cx="140" cy="140" r="135" fill="#ffffff" stroke="#b9ddc9" strokeWidth="3" />
                <circle cx="140" cy="140" r="135" fill="none" stroke="#dcefe4" strokeWidth="1" strokeDasharray="2 10" />

                {/* Dönen grup: yön harfleri */}
                <g style={{ transform: `rotate(${dialRotation}deg)`, transformOrigin: "140px 140px", transition: "transform 0.2s" }}>
                  {(["K", "D", "G", "B"] as const).map((label, i) => {
                    const ang = i * 90;
                    const p = marker(ang, 112);
                    return (
                      <text key={label} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
                        fontSize="24" fontWeight="900" fill={label === "K" ? "#c0392b" : "#236b4c"}>
                        {label}
                      </text>
                    );
                  })}
                  {/* Kıble işareti */}
                  <g style={{ transform: `rotate(${bearing}deg)`, transformOrigin: "140px 140px" }}>
                    {(() => {
                      const p = marker(0, 92);
                      return (
                        <>
                          <rect x={p.x - 22} y={p.y - 22} width="44" height="44" rx="12" fill="#c9a227" />
                          <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="26">🕋</text>
                        </>
                      );
                    })()}
                    <line x1="140" y1="140" x2={marker(0, 92).x} y2={marker(0, 92).y} stroke="#c9a227" strokeWidth="3" strokeDasharray="4 4" />
                  </g>
                </g>

                {/* Cihazın ön yönü (yukarı) */}
                <polygon points="140,18 128,40 152,40" fill="#0a3d2f" />
                <circle cx="140" cy="140" r="8" fill="#0a3d2f" />
              </svg>
            </div>
          </div>

          <Card className="p-5 text-center">
            <p className="text-xl font-extrabold text-nuur-900">
              {heading != null
                ? "Üstteki ▲ oku Kâbe 🕋 işaretine doğrultun"
                : "Telefonu kuzeye (K) doğrultarak yönü belirleyin"}
            </p>
            <p className="mt-1 text-base text-nuur-600">
              {heading != null
                ? "Cihazınız canlı olarak yönü gösteriyor."
                : "Canlı pusula için aşağıdaki düğmeye basın."}
            </p>
            {!compassActive && (
              <div className="mt-4">
                <PrimaryButton tone="gold" onClick={startCompass}>🧭 Canlı Pusulayı Başlat</PrimaryButton>
              </div>
            )}
            {compassActive && heading == null && (
              <p className="mt-3 text-base font-semibold text-gold-600">
                Cihazınız canlı yönü desteklemiyor olabilir. Yukarıdaki ▲ işareti Kâbe yönüne bakacak şekilde telefonunuzu çevirin.
              </p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
