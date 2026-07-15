import { useState } from "react";
import { guideSections } from "@/data/guide";
import { BackHeader, Card, Pill } from "@/components/ui";

type Gender = "male" | "female";

export default function PrayerGuide({ onBack }: { onBack: () => void }) {
  const [openId, setOpenId] = useState<string | null>(guideSections[0]?.id ?? null);
  const [gender, setGender] = useState<Gender>("male");
  const active = guideSections.find((s) => s.id === openId);
  const variant = active?.variants ? active.variants[gender] : null;

  return (
    <div className="animate-fade space-y-5">
      <BackHeader title="Namaz Rehberi" subtitle="Abdest & namaz kılınışı" onBack={onBack} />

      <p className="px-1 text-base text-nuur-600">
        Bir başlık seçin; abdest almayı ve namaz kılmayı adım adım öğrenin.
      </p>

      {/* Başlık seçimi */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {guideSections.map((s) => (
          <button
            key={s.id}
            onClick={() => setOpenId(s.id)}
            className={
              "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-center text-sm font-bold leading-tight transition sm:text-base " +
              (openId === s.id
                ? "bg-nuur-700 text-white shadow"
                : "bg-white text-nuur-700 ring-1 ring-black/5")
            }
          >
            <span className="text-2xl sm:text-3xl">{s.icon}</span>
            <span className="break-words text-balance">{s.title}</span>
          </button>
        ))}
      </div>

      {active && (
        <div className="space-y-4">
          {/* Giriş */}
          {variant ? (
            <Card className="bg-nuur-50 p-5">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{active.icon}</span>
                <p className="text-lg leading-relaxed text-nuur-800">{variant.intro}</p>
              </div>
            </Card>
          ) : (
            active.intro && (
              <Card className="bg-nuur-50 p-5">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{active.icon}</span>
                  <p className="text-lg leading-relaxed text-nuur-800">{active.intro}</p>
                </div>
              </Card>
            )
          )}

          {/* Cinsiyet seçimi (sadece kılınış için) */}
          {active.genderSpecific && active.variants && (
            <div className="rounded-2xl bg-nuur-50 p-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setGender("male")}
                  className={
                    "rounded-2xl px-4 py-4 text-lg font-extrabold transition " +
                    (gender === "male"
                      ? "bg-nuur-700 text-white shadow"
                      : "bg-white text-nuur-700 ring-1 ring-black/5")
                  }
                >
                  👨 Erkek
                </button>
                <button
                  onClick={() => setGender("female")}
                  className={
                    "rounded-2xl px-4 py-4 text-lg font-extrabold transition " +
                    (gender === "female"
                      ? "bg-nuur-700 text-white shadow"
                      : "bg-white text-nuur-700 ring-1 ring-black/5")
                  }
                >
                  👩 Kadın
                </button>
              </div>
            </div>
          )}

          {/* Postür görseli (cinsiyete göre) */}
          {variant?.image && (
            <Card className="overflow-hidden p-3">
              <img
                src={variant.image}
                alt={gender === "male" ? "Erkekler için namaz postürleri" : "Kadınlar için namaz postürleri"}
                className="block max-h-64 w-full rounded-2xl bg-white object-contain sm:max-h-80"
                loading="lazy"
              />
              <div className="mt-2 flex flex-wrap items-center gap-2 px-1">
                <Pill tone="gold">{gender === "male" ? "👨 Erkek" : "👩 Kadın"}</Pill>
                <p className="text-sm font-semibold text-nuur-500">Namaz postürleri (soldan sağa)</p>
              </div>
            </Card>
          )}

          {/* Cinsiyete özel not */}
          {variant?.note && (
            <div className="rounded-2xl bg-gold-300/30 p-4 ring-1 ring-gold-300/50">
              <p className="text-base font-bold leading-relaxed text-gold-600">⚠️ Önemli fark:</p>
              <p className="mt-1 text-lg leading-relaxed text-nuur-800">{variant.note}</p>
            </div>
          )}

          {/* Adımlar */}
          {variant?.steps && (
            <div className="space-y-3">
              {variant.steps.map((step, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-nuur-50 text-2xl sm:h-14 sm:w-14 sm:text-3xl">
                      {step.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-extrabold leading-tight text-nuur-900 sm:text-xl">{step.title}</p>
                      <p className="mt-1 text-base leading-relaxed text-nuur-700 sm:text-lg">{step.text}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Adımlar (abdest — resimli) */}
          {active.steps && (
            <div className="space-y-3">
              {active.steps.map((step, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-nuur-50 text-2xl sm:h-14 sm:w-14 sm:text-3xl">
                      {step.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-extrabold leading-tight text-nuur-900 sm:text-xl">{step.title}</p>
                      <p className="mt-1 text-base leading-relaxed text-nuur-700 sm:text-lg">{step.text}</p>
                    </div>
                  </div>
                  {step.image && (
                    <div className="mt-3 overflow-hidden rounded-2xl bg-nuur-50 p-2">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="mx-auto block max-h-60 w-auto max-w-full rounded-xl bg-white object-contain sm:max-h-72"
                        loading="lazy"
                      />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Liste (farzlar / vakitler) */}
          {active.list && (
            <div className="space-y-3">
              {active.list.map((item, i) => (
                <Card key={i} className="p-5">
                  <div className="flex items-center gap-2">
                    {active.id === "bes-vakit" ? (
                      <Pill tone="gold">Vakit</Pill>
                    ) : (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-300/40 text-sm font-black text-gold-600">
                        {i + 1}
                      </span>
                    )}
                    <p className="text-xl font-extrabold text-nuur-900">{item.title}</p>
                  </div>
                  {item.text && (
                    <p className="mt-2 text-lg leading-relaxed text-nuur-700">{item.text}</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="px-1 pb-2 text-center text-sm text-nuur-400">
        Namaz, müminin mîrâcıdır. 🕌
      </p>
    </div>
  );
}
