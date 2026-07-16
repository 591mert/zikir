import { useEffect, useState } from "react";
import { duaCategories } from "@/data/duas";
import { surahMeta } from "@/data/surahMeta";
import { DuaPlayButton, SurahListenButton, surahArabic, preFetchCategoryAudio } from "@/components/DuaPlayer";
import { ArabicText, BackHeader, Card, Pill } from "@/components/ui";

export default function Duas({ onBack }: { onBack: () => void }) {
  const [openId, setOpenId] = useState<string | null>(duaCategories[0]?.id ?? null);
  const active = duaCategories.find((c) => c.id === openId);

  // Kategori değişince duaların seslerini önyükle (Android gesture sorunu için)
  useEffect(() => {
    if (active) preFetchCategoryAudio(active);
  }, [active]);

  return (
    <div className="animate-fade space-y-5">
      <BackHeader title="Günlük Dualar" subtitle="Hayatın her ânı · sesli dinleme" onBack={onBack} />

      <p className="px-1 text-base text-nuur-600">
        Bir kategori seçin; duaların Arapçasını, anlamını ve sesli okunuşunu göreceksiniz.
      </p>

      {/* Kategori seçimi */}
      <div className="flex flex-wrap gap-2">
        {duaCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setOpenId(c.id)}
            className={
              "flex items-center gap-2 rounded-2xl px-4 py-3 text-base font-bold transition " +
              (openId === c.id
                ? "bg-nuur-700 text-white shadow"
                : "bg-white text-nuur-700 ring-1 ring-black/5")
            }
          >
            <span className="text-xl">{c.icon}</span> {c.title}
          </button>
        ))}
      </div>

      {active && (
        <div className="space-y-4">
          <p className="px-1 text-lg font-bold text-nuur-700">
            {active.icon} {active.description}
          </p>

          {/* Namaz sûreleri (tam sûre sesli dinleme) */}
          {active.surahIds && active.surahIds.length > 0 && (
            <Card className="overflow-hidden ring-0">
              <div className="bg-nuur-50 p-4">
                <div className="flex items-center gap-2">
                  <Pill tone="gold">📖 Namazda Okunan Sûreler</Pill>
                </div>
                <p className="mt-2 text-base text-nuur-600">
                  Sûreyi "Dinle" düğmesiyle baştan sona dinleyebilirsiniz.
                </p>
              </div>
              <div className="divide-y divide-nuur-50">
                {active.surahIds.map((id) => {
                  const m = surahMeta.find((s) => s.id === id);
                  if (!m) return null;
                  return (
                    <div key={id} className="flex items-center justify-between gap-3 p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-nuur-50 text-base font-black text-nuur-700">
                          {id}
                        </div>
                        <div>
                          <p className="text-xl font-extrabold text-nuur-900">{m.name}</p>
                          <p className="text-sm text-nuur-500">{m.ayahs} âyet · {m.type}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <SurahListenButton surahId={id} />
                        <span dir="rtl" className="font-arabic text-2xl text-nuur-700">
                          {surahArabic(id)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Dualar listesi */}
          {active.duas.map((d, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xl font-extrabold text-nuur-900">{d.title}</p>
                <DuaPlayButton dua={d} />
              </div>
              <div className="mt-3 rounded-2xl bg-nuur-50 p-4 text-center">
                <ArabicText className="text-4xl">{d.arabic}</ArabicText>
              </div>
              <p className="mt-3 text-xl leading-relaxed text-nuur-800">
                Anlamı: {d.meaning}
              </p>
              {!d.audioRef && (
                <p className="mt-2 text-xs text-nuur-400">
                  Tilâvet usûlünde sesli dua
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
