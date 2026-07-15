import { useState } from "react";
import { verses, hadiths } from "@/data/wisdom";
import { ArabicText, BackHeader, Card, Pill } from "@/components/ui";

export default function Wisdom({ onBack }: { onBack: () => void }) {
  const [vIdx, setVIdx] = useState(() => {
    const d = Math.floor(Date.now() / 86400000);
    return d % verses.length;
  });
  const [hIdx, setHIdx] = useState(() => {
    const d = Math.floor(Date.now() / 86400000);
    return d % hadiths.length;
  });

  const verse = verses[vIdx];
  const hadith = hadiths[hIdx];

  function nextVerse() {
    setVIdx((i) => (i + 1) % verses.length);
  }
  function nextHadith() {
    setHIdx((i) => (i + 1) % hadiths.length);
  }

  return (
    <div className="animate-fade space-y-5">
      <BackHeader title="Günün Âyeti & Hadisi" subtitle="Kalbe ilham veren sözler" onBack={onBack} />

      {/* Günün âyeti */}
      <Card className="overflow-hidden ring-0">
        <div className="bg-gradient-to-br from-nuur-700 to-nuur-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <Pill tone="gold">🌙 Günün Âyeti</Pill>
            <span className="text-sm text-white/70">Kur'an-ı Kerim</span>
          </div>
          <div className="mt-4 rounded-2xl bg-white/10 p-5 text-center">
            <ArabicText className="text-4xl text-white">{verse.arabic}</ArabicText>
          </div>
          <p className="mt-4 text-xl leading-relaxed text-white">{verse.meaning}</p>
          <p className="mt-3 text-base font-bold text-gold-300">📖 {verse.reference}</p>
        </div>
        <button
          onClick={nextVerse}
          className="w-full p-4 text-center text-lg font-bold text-nuur-700 hover:bg-nuur-50"
        >
          🔄 Başka bir âyet göster
        </button>
      </Card>

      {/* Günün hadisi */}
      <Card className="overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <Pill tone="nuur">💬 Günün Hadisi</Pill>
          <span className="text-sm text-nuur-400">Hadis-i Şerif</span>
        </div>
        <p className="mt-4 rounded-2xl bg-nuur-50 p-4 text-2xl font-bold leading-relaxed text-nuur-900">
          "{hadith.text}"
        </p>
        <p className="mt-3 text-base font-bold text-gold-600">📚 {hadith.source}</p>
        <button
          onClick={nextHadith}
          className="mt-4 w-full rounded-2xl bg-nuur-50 p-3 text-center text-lg font-bold text-nuur-700 hover:bg-nuur-100"
        >
          🔄 Başka bir hadis göster
        </button>
      </Card>
    </div>
  );
}
