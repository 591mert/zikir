import { useEffect, useState } from "react";
import { loadState, saveState } from "@/hooks/useClock";
import { BackHeader, Card } from "@/components/ui";

interface Dhikr {
  name: string;
  arabic: string;
  target: number;
}

const DHIKRS: Dhikr[] = [
  { name: "Sübhânallah", arabic: "سُبْحَانَ اللّٰه", target: 33 },
  { name: "Elhamdülillâh", arabic: "اَلْحَمْدُ لِلّٰه", target: 33 },
  { name: "Allâhu Ekber", arabic: "اَللّٰهُ اَكْبَر", target: 34 },
  { name: "Lâ ilâhe illallâh", arabic: "لَٓا اِلٰهَ اِلَّا اللّٰه", target: 100 },
  { name: "Estağfirullâh", arabic: "اَسْتَغْفِرُ اللّٰه", target: 100 },
  { name: "Sallallâhu Teâlâ", arabic: "صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّم", target: 100 },
];

export default function Tasbih({ onBack }: { onBack: () => void }) {
  const [dhikrIdx, setDhikrIdx] = useState(() => loadState("tasbih-idx", 0));
  const [count, setCount] = useState(() => loadState("tasbih-count", 0));
  const [rounds, setRounds] = useState(() => loadState("tasbih-rounds", 0));
  const [pop, setPop] = useState(false);

  const dhikr = DHIKRS[dhikrIdx] ?? DHIKRS[0];

  useEffect(() => saveState("tasbih-idx", dhikrIdx), [dhikrIdx]);
  useEffect(() => saveState("tasbih-count", count), [count]);
  useEffect(() => saveState("tasbih-rounds", rounds), [rounds]);

  function tap() {
    if (navigator.vibrate) navigator.vibrate(25);
    setPop(true);
    setTimeout(() => setPop(false), 120);
    const next = count + 1;
    if (next >= dhikr.target) {
      // Tur tamamlandı
      if (navigator.vibrate) navigator.vibrate([30, 40, 80]);
      setCount(0);
      setRounds((r) => r + 1);
    } else {
      setCount(next);
    }
  }

  function reset() {
    setCount(0);
    setRounds(0);
  }

  const progress = count / dhikr.target;

  return (
    <div className="animate-fade space-y-5">
      <BackHeader title="Tesbihat" subtitle="Zikir sayacı" onBack={onBack} />

      {/* Zikir seçimi */}
      <div>
        <p className="mb-2 px-1 text-lg font-bold text-nuur-700">Zikrinizi seçin</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {DHIKRS.map((d, i) => (
            <button
              key={d.name}
              onClick={() => {
                setDhikrIdx(i);
                setCount(0);
              }}
              className={
                "shrink-0 rounded-2xl px-4 py-3 text-base font-bold transition " +
                (i === dhikrIdx
                  ? "bg-nuur-700 text-white shadow"
                  : "bg-white text-nuur-700 ring-1 ring-black/5")
              }
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Büyük sayaç */}
      <div className="flex flex-col items-center pt-2">
        <p dir="rtl" className="font-arabic text-5xl text-nuur-800">{dhikr.arabic}</p>
        <p className="mt-1 text-xl font-bold text-nuur-600">{dhikr.name}</p>

        <button
          onClick={tap}
          aria-label="Zikir say"
          className="relative mt-6 flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-nuur-600 to-nuur-800 text-white shadow-2xl shadow-nuur-700/30 transition active:scale-95"
        >
          {/* İlerleme halkası */}
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#e8cd7f"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - progress)}
              className="transition-all duration-150"
            />
          </svg>
          <div className={"flex flex-col items-center " + (pop ? "scale-110" : "scale-100")}>
            <span className="text-7xl font-black tabular-nums transition-transform">{count}</span>
            <span className="mt-1 text-lg font-bold text-white/70">/ {dhikr.target}</span>
          </div>
        </button>

        <p className="mt-4 text-lg font-semibold text-nuur-700">
          Tamamlanan tur: <span className="text-nuur-800">{rounds}</span> · Toplam:{" "}
          <span className="text-nuur-800">{rounds * dhikr.target + count}</span>
        </p>

        <p className="mt-1 px-6 text-center text-sm text-nuur-400">
          Büyük daireye dokunarak zikrinizi sayın.
        </p>
      </div>

      <Card className="p-4">
        <button
          onClick={reset}
          className="flex w-full items-center justify-center gap-2 text-lg font-bold text-red-600"
        >
          🔄 Sıfırla
        </button>
      </Card>
    </div>
  );
}
